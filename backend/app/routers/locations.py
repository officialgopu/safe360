from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database.connection import get_db
from app.models.location import Location
from app.schemas.location import LocationCreate, LocationResponse

router = APIRouter(prefix="/locations", tags=["Locations"])

@router.get("/", response_model=List[LocationResponse])
def get_all_locations(db: Session = Depends(get_db)):
    locations = db.query(Location).all()
    return locations

@router.get("/{location_id}", response_model=LocationResponse)
def get_location(location_id: int, db: Session = Depends(get_db)):
    location = db.query(Location).filter(Location.id == location_id).first()
    if not location:
        raise HTTPException(status_code=404, detail="Location not found")
    return location

@router.post("/", response_model=LocationResponse)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    db_location = Location(**location.dict())
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location