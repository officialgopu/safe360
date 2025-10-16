from sqlalchemy import Column, Integer, String, DateTime, Float, Boolean, Text
from datetime import datetime
from app.database.connection import Base

class Alert(Base):
    __tablename__ = "alerts"
    
    id = Column(Integer, primary_key=True, index=True)
    alert_type = Column(String, nullable=False)  # fire, flood, earthquake, etc.
    severity = Column(String, nullable=False)  # low, medium, high, critical
    title = Column(String, nullable=False)
    description = Column(Text)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String)
    radius = Column(Float)  # affected area radius in km
    status = Column(String, default="active")  # active, resolved, archived
    is_active = Column(Boolean, default=True)
    created_by = Column(Integer)  # user_id
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)