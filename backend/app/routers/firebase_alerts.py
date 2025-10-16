from fastapi import APIRouter, HTTPException
from typing import Dict, Any, List
from app.firebase.realtime_alerts import FirebaseAlertService
from datetime import datetime

router = APIRouter(prefix="/firebase/alerts", tags=["Firebase Alerts"])

# Initialize Firebase service lazily
firebase_service = None

def get_firebase_service():
    global firebase_service
    if firebase_service is None:
        firebase_service = FirebaseAlertService()
    return firebase_service

@router.get("/")
def get_all_firebase_alerts():
    """Get all alerts from Firebase"""
    try:
        service = get_firebase_service()
        alerts = service.get_all_alerts()
        if not alerts:
            return {"alerts": []}
        return {"alerts": alerts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/active")
def get_active_firebase_alerts():
    """Get only active alerts from Firebase"""
    try:
        service = get_firebase_service()
        alerts = service.get_active_alerts()
        return {"alerts": alerts}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{alert_id}")
def get_firebase_alert(alert_id: str):
    """Get specific alert by ID from Firebase"""
    try:
        service = get_firebase_service()
        alert = service.get_alert(alert_id)
        if not alert:
            raise HTTPException(status_code=404, detail="Alert not found")
        return {"alert": alert}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/")
def create_firebase_alert(alert_data: Dict[str, Any]):
    """Create new real-time alert in Firebase"""
    try:
        # Validate required fields
        required_fields = ["alert_type", "severity", "title", "latitude", "longitude"]
        for field in required_fields:
            if field not in alert_data:
                raise HTTPException(status_code=400, detail=f"Missing required field: {field}")
        
        service = get_firebase_service()
        alert_id = service.create_alert(alert_data)
        return {
            "message": "Alert created successfully",
            "alert_id": alert_id,
            "timestamp": datetime.utcnow().isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{alert_id}")
def update_firebase_alert(alert_id: str, update_data: Dict[str, Any]):
    """Update existing alert in Firebase"""
    try:
        service = get_firebase_service()
        success = service.update_alert(alert_id, update_data)
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found or update failed")
        return {"message": "Alert updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{alert_id}")
def delete_firebase_alert(alert_id: str):
    """Delete alert from Firebase"""
    try:
        service = get_firebase_service()
        success = service.delete_alert(alert_id)
        if not success:
            raise HTTPException(status_code=404, detail="Alert not found")
        return {"message": "Alert deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))