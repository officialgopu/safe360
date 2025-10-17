from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from pydantic import BaseModel
from passlib.context import CryptContext
from app.database.connection import get_db
from app.models.user import User
from app.models.alert import Alert
from app.ml import ml_service, ML_AVAILABLE

# Password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User schemas for request validation
class UserCreate(BaseModel):
    username: str
    email: str
    password: str
    full_name: str | None = None
    phone: str | None = None
    role: str = "user"

class UserUpdate(BaseModel):
    username: str | None = None
    email: str | None = None
    full_name: str | None = None
    phone: str | None = None
    role: str | None = None
    is_active: bool | None = None

router = APIRouter(prefix="/admin", tags=["Admin"])


@router.get("/overview")
def get_overview_stats(db: Session = Depends(get_db)):
    """Get dashboard overview statistics"""
    try:
        today = datetime.utcnow().date()
        
        # Total alerts today
        total_alerts_today = db.query(Alert).filter(
            func.date(Alert.created_at) == today
        ).count()
        
        # Crime alerts
        crime_alerts = db.query(Alert).filter(
            and_(
                func.date(Alert.created_at) == today,
                Alert.alert_type.ilike("%crime%")
            )
        ).count()
        
        # Fraud alerts
        fraud_alerts = db.query(Alert).filter(
            and_(
                func.date(Alert.created_at) == today,
                Alert.alert_type.ilike("%fraud%")
            )
        ).count()
        
        # Weather alerts
        weather_alerts = db.query(Alert).filter(
            and_(
                func.date(Alert.created_at) == today,
                or_(
                    Alert.alert_type.ilike("%weather%"),
                    Alert.alert_type.ilike("%flood%"),
                    Alert.alert_type.ilike("%storm%")
                )
            )
        ).count()
        
        # Active responders
        active_responders = db.query(User).filter(
            and_(
                User.is_active == True,
                or_(User.role == 'police', User.role == 'ngo')
            )
        ).count()
        
        return {
            "totalAlertsToday": total_alerts_today,
            "crimeAlerts": crime_alerts,
            "fraudAlerts": fraud_alerts,
            "weatherAlerts": weather_alerts,
            "activeResponders": active_responders,
            "avgResponseTime": 12.5
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ==================== ALERTS MANAGEMENT ====================
@router.get("/alerts/all")
def get_all_alerts_admin(
    alert_type: str = None,
    severity: str = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all alerts with filters for admin dashboard"""
    try:
        query = db.query(Alert)
        
        # Apply filters if provided
        if alert_type:
            query = query.filter(Alert.alert_type.ilike(f"%{alert_type}%"))
        
        if severity:
            query = query.filter(Alert.severity == severity)
        
        if status:
            query = query.filter(Alert.status == status)
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        alerts = query.order_by(Alert.created_at.desc()).offset(skip).limit(limit).all()
        
        # Format response
        alert_list = []
        for alert in alerts:
            alert_list.append({
                "id": alert.id,
                "type": alert.alert_type,
                "title": alert.title,
                "location": alert.location_name or "Unknown",
                "severity": alert.severity,
                "status": alert.status,
                "reportedOn": alert.created_at.isoformat(),
                "latitude": alert.latitude,
                "longitude": alert.longitude,
                "description": alert.description
            })
        
        return {
            "data": alert_list,
            "total": total,
            "page": skip // limit + 1,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/alerts/stats")
def get_alerts_statistics(db: Session = Depends(get_db)):
    """Get alert statistics for charts"""
    try:
        # Alerts by type
        alerts_by_type = db.query(
            Alert.alert_type,
            func.count(Alert.id).label('count')
        ).group_by(Alert.alert_type).all()
        
        # Alerts by severity
        alerts_by_severity = db.query(
            Alert.severity,
            func.count(Alert.id).label('count')
        ).group_by(Alert.severity).all()
        
        # Alerts by status
        alerts_by_status = db.query(
            Alert.status,
            func.count(Alert.id).label('count')
        ).group_by(Alert.status).all()
        
        return {
            "byType": [{"name": t[0], "value": t[1]} for t in alerts_by_type],
            "bySeverity": [{"name": s[0], "value": s[1]} for s in alerts_by_severity],
            "byStatus": [{"name": st[0], "value": st[1]} for st in alerts_by_status]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ==================== USER MANAGEMENT ====================
@router.get("/users")
def get_all_users(
    role: str = None,
    status: str = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all users with filters"""
    try:
        query = db.query(User)
        
        if role:
            query = query.filter(User.role == role)
        if status:
            is_active = status.lower() == 'active'
            query = query.filter(User.is_active == is_active)
        
        total = query.count()
        users = query.offset(skip).limit(limit).all()
        
        user_list = []
        for user in users:
            user_list.append({
                "id": user.id,
                "name": user.full_name or user.username,
                "email": user.email,
                "role": user.role,
                "phone": user.phone,
                "status": "active" if user.is_active else "inactive",
                "createdAt": user.created_at.isoformat()
            })
        
        return {"data": user_list, "total": total}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.post("/users")
def create_user_admin(user: UserCreate, db: Session = Depends(get_db)):
    """Create new user"""
    try:
        existing = db.query(User).filter(User.email == user.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already exists")
        
        hashed_password = pwd_context.hash(user.password)
        db_user = User(
            username=user.username,
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            role=user.role,
            hashed_password=hashed_password
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return {"message": "User created successfully", "id": db_user.id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.put("/users/{user_id}")
def update_user_admin(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    """Update user"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        for key, value in user_update.dict(exclude_unset=True).items():
            setattr(user, key, value)
        
        db.commit()
        return {"message": "User updated successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.delete("/users/{user_id}")
def delete_user_admin(user_id: int, db: Session = Depends(get_db)):
    """Delete user"""
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.delete(user)
        db.commit()
        return {"message": "User deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ==================== AI INSIGHTS & ANALYTICS ====================
@router.get("/insights")
def get_ai_insights(db: Session = Depends(get_db)):
    """Get AI-powered insights and predictions"""
    try:
        # Get last 7 days data
        seven_days_ago = datetime.utcnow() - timedelta(days=7)
        
        # Daily alert trends
        daily_trends = db.query(
            func.date(Alert.created_at).label('date'),
            func.count(Alert.id).label('count')
        ).filter(Alert.created_at >= seven_days_ago).group_by(
            func.date(Alert.created_at)
        ).all()
        
        trends_data = [{"date": str(d[0]), "count": d[1]} for d in daily_trends]
        
        # Crime hotspots (top locations)
        hotspots = db.query(
            Alert.location_name,
            func.count(Alert.id).label('count')
        ).filter(
            Alert.location_name.isnot(None)
        ).group_by(Alert.location_name).order_by(
            func.count(Alert.id).desc()
        ).limit(5).all()
        
        hotspots_data = [{"location": h[0], "incidents": h[1]} for h in hotspots]
        
        # Severity distribution
        severity_dist = db.query(
            Alert.severity,
            func.count(Alert.id).label('count')
        ).group_by(Alert.severity).all()
        
        severity_data = [{"severity": s[0], "count": s[1]} for s in severity_dist]
        
        return {
            "trends": trends_data,
            "hotspots": hotspots_data,
            "severityDistribution": severity_data,
            "predictions": {
                "nextWeekAlerts": len(trends_data) * 15 if trends_data else 100,
                "highRiskAreas": len(hotspots_data),
                "confidence": 0.85
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


@router.get("/map/alerts")
def get_map_alerts(db: Session = Depends(get_db)):
    """Get alerts with coordinates for map visualization"""
    try:
        alerts = db.query(Alert).filter(
            Alert.is_active == True,
            Alert.latitude.isnot(None),
            Alert.longitude.isnot(None)
        ).all()
        
        map_data = []
        for alert in alerts:
            map_data.append({
                "id": alert.id,
                "type": alert.alert_type,
                "title": alert.title,
                "severity": alert.severity,
                "latitude": alert.latitude,
                "longitude": alert.longitude,
                "location": alert.location_name,
                "timestamp": alert.created_at.isoformat()
            })
        
        return {"alerts": map_data, "total": len(map_data)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ==================== ML PREDICTIONS ====================
class RiskFactor(BaseModel):
    name: str
    weight: float

class PredictionResponse(BaseModel):
    risk_score: float
    confidence: float
    factors: list[RiskFactor]
    recommendations: list[str]

class CrimePredictionRequest(BaseModel):
    population_density: float = 1000
    unemployment_rate: float = 5.0
    income_level: float = 50000
    prior_incidents: int = 0
    location_risk: float = 0.5
    economic_stress: float = 0.5
    is_night: int = 0
    is_weekend: int = 0

class WeatherPredictionRequest(BaseModel):
    temperature: float = 25          # Temperature in Celsius
    precipitation: float = 0         # Precipitation in mm
    wind_speed: float = 10          # Wind speed in km/h
    humidity: float = 60            # Relative humidity %
    weather_encoded: int = 0        # Encoded weather type
    hour: int = 12                  # Hour of the day (0-23)
    month: int = 6                  # Month (1-12)
    pressure: float = 1013.25       # Air pressure in hPa
    visibility: float = 10          # Visibility in km
    wind_direction: float = 180     # Wind direction in degrees
    cloud_cover: float = 50         # Cloud cover percentage

class FraudPredictionRequest(BaseModel):
    amount: float = 1000
    victim_income: float = 50000
    previous_frauds: int = 0
    detection_time_hours: float = 24
    fraud_type_encoded: int = 0
    channel_encoded: int = 0

class HeatmapLocation(BaseModel):
    lat: float
    lng: float
    area_name: str
    area_data: dict[str, float | int]

@router.post("/predict/crime", response_model=PredictionResponse)
def predict_crime(data: CrimePredictionRequest):
    """
    Predict crime risk using ML model.
    
    Uses demographic data and location factors to generate a risk assessment
    for potential criminal activity in an area.
    
    Returns:
        PredictionResponse with:
        - risk_score: Float between 0-1 indicating crime risk level
        - confidence: Model confidence score
        - factors: List of contributing risk factors and their weights
        - recommendations: List of suggested preventive actions
    """
    if not ML_AVAILABLE or ml_service is None:
        raise HTTPException(status_code=503, detail="ML service not available")
    try:
        result = ml_service.predict_crime_risk(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.post("/predict/weather", response_model=PredictionResponse)
def predict_weather(data: WeatherPredictionRequest):
    """
    Predict weather-related incident risk using ML model.
    
    Analyzes meteorological data to predict the likelihood of 
    weather-related emergencies or natural disasters.
    
    Returns:
        PredictionResponse with:
        - risk_score: Float between 0-1 indicating weather risk level
        - confidence: Model confidence score
        - factors: List of contributing weather factors and their weights
        - recommendations: List of suggested safety measures
    """
    if not ML_AVAILABLE or ml_service is None:
        raise HTTPException(status_code=503, detail="ML service not available")
    try:
        result = ml_service.predict_weather_risk(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

@router.post("/predict/fraud", response_model=PredictionResponse)
def predict_fraud(data: FraudPredictionRequest):
    """
    Predict fraud risk using ML model.
    
    Evaluates transaction data and victim profile to assess the likelihood
    of fraudulent activity and potential financial risk.
    
    Returns:
        PredictionResponse with:
        - risk_score: Float between 0-1 indicating fraud risk level
        - confidence: Model confidence score
        - factors: List of contributing risk factors and their weights
        - recommendations: List of suggested preventive measures
    """
    if not ML_AVAILABLE or ml_service is None:
        raise HTTPException(status_code=503, detail="ML service not available")
    try:
        result = ml_service.predict_fraud_risk(data.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

class HeatmapResponse(BaseModel):
    heatmap: list[HeatmapLocation]
    total_areas: int
    last_updated: datetime
    alert_density: dict[str, int]

@router.get("/map/heatmap", response_model=HeatmapResponse)
def get_heatmap_data(db: Session = Depends(get_db)):
    """
    Generate risk heatmap data for map visualization.
    
    Combines historical alert data with ML predictions to create a 
    risk heatmap overlay for the map interface. Also provides alert
    density statistics by area.
    
    Returns:
        HeatmapResponse containing:
        - heatmap: List of locations with risk scores and metadata
        - total_areas: Number of areas analyzed
        - last_updated: Timestamp of the last data update
        - alert_density: Count of alerts by area/region
    """
    try:
        # Get all active alerts with coordinates
        alerts = db.query(Alert).filter(
            Alert.latitude.isnot(None),
            Alert.longitude.isnot(None)
        ).all()
        
        # Prepare location data for ML predictions
        locations = []
        alert_counts: dict[str, int] = {}
        
        for alert in alerts:
            area_name = alert.location_name or "Unknown"
            alert_counts[area_name] = alert_counts.get(area_name, 0) + 1
            
            locations.append(HeatmapLocation(
                lat=alert.latitude,
                lng=alert.longitude,
                area_name=area_name,
                area_data={
                    "population_density": 1500,  # Default values - you can fetch real data
                    "unemployment_rate": 6.0,
                    "income_level": 45000,
                    "prior_incidents": alert_counts[area_name],
                    "location_risk": 0.6,
                    "economic_stress": 0.5,
                    "is_night": 0,
                    "is_weekend": 0
                }
            ))
        
        # Get risk scores from ML model
        if not ML_AVAILABLE or ml_service is None:
            raise HTTPException(status_code=503, detail="ML service not available")
            
        heatmap_data = ml_service.get_area_risk_scores(locations)
        
        return HeatmapResponse(
            heatmap=heatmap_data,
            total_areas=len(heatmap_data),
            last_updated=datetime.utcnow(),
            alert_density=alert_counts
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")