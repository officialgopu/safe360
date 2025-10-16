from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.connection import get_db
from app.models.alert import Alert
from app.firebase.realtime_alerts import FirebaseAlertService
from datetime import datetime
import json

router = APIRouter(prefix="/submit-alert", tags=["Alert Submission"])
firebase_service = FirebaseAlertService()

@router.post("/")
async def submit_alert(
    category: str = Form(...),
    pincode: str = Form(...),
    address: str = Form(...),
    city: str = Form(...),
    date: str = Form(...),
    time: str = Form(...),
    description: str = Form(...),
    urgency_level: str = Form(...),
    latitude: float = Form(0.0),
    longitude: float = Form(0.0),
    other_category: Optional[str] = Form(None),
    files: Optional[List[UploadFile]] = File(None),
    file_captions: Optional[str] = Form(None),  # JSON string of captions
    is_verified: bool = Form(True),  # Default to True for backward compatibility
    db: Session = Depends(get_db)
):
    """
    Submit alert to both PostgreSQL (historical) and Firebase (real-time)
    This endpoint matches your frontend AlertSubmissionForm
    """
    try:
        print("📝 Received alert submission with data:", {
            "category": category,
            "pincode": pincode,
            "city": city,
            "urgency_level": urgency_level
        })
        # Map urgency to severity
        severity_map = {
            "low": "low",
            "medium": "medium",
            "high": "critical"
        }
        severity = severity_map.get(urgency_level.lower(), "medium")
        
        # Prepare alert data
        alert_data = {
            "alert_type": other_category if category == "other" else category,
            "severity": severity,
            "title": f"{category.title()} Alert in {city}",
            "description": description,
            "latitude": latitude,
            "longitude": longitude,
            "location_name": f"{address}, {city}",
            "pincode": pincode,
            "incident_date": date,
            "incident_time": time,
            "urgency_level": urgency_level
        }
        
        # Save to PostgreSQL (historical data)
        db_alert = Alert(
            alert_type=alert_data["alert_type"],
            severity=alert_data["severity"],
            title=alert_data["title"],
            description=alert_data["description"],
            latitude=alert_data["latitude"],
            longitude=alert_data["longitude"],
            location_name=alert_data["location_name"],
            status="active",
            is_active=True
        )
        db.add(db_alert)
        db.commit()
        db.refresh(db_alert)
        
        # Handle file captions if provided
        captions = []
        if file_captions:
            try:
                captions = json.loads(file_captions)
            except json.JSONDecodeError:
                pass

        # Process files if provided
        file_info = []
        if files:
            for i, file in enumerate(files):
                caption = captions[i] if i < len(captions) else ""
                file_info.append({
                    "filename": file.filename,
                    "caption": caption,
                    # You can add file upload logic here
                    # For example, save to cloud storage and store URL
                })
        
        # Update alert data with file info and verification
        alert_data["files"] = file_info
        alert_data["is_verified"] = is_verified
        
        # Save to Firebase (real-time)
        firebase_alert_id = firebase_service.create_alert(alert_data)
        
        return {
            "message": "Alert submitted successfully",
            "postgresql_id": db_alert.id,
            "firebase_id": firebase_alert_id,
            "status": "active",
            "timestamp": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to submit alert: {str(e)}")