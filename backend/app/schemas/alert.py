from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class AlertBase(BaseModel):
    alert_type: str
    severity: str
    title: str
    description: Optional[str] = None
    latitude: float
    longitude: float
    location_name: Optional[str] = None
    radius: Optional[float] = None

class AlertCreate(AlertBase):
    created_by: Optional[int] = None

class AlertUpdate(BaseModel):
    status: Optional[str] = None
    is_active: Optional[bool] = None

class AlertResponse(AlertBase):
    id: int
    status: str
    is_active: bool
    created_at: datetime
    resolved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True