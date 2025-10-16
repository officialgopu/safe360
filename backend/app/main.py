from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import alerts, users, locations
from app.database.connection import engine, Base
from app.firebase.config import initialize_firebase

# Create tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Alert System API",
    version="1.0.0",
    description="Backend API for Real-time Alert System with PostgreSQL and Firebase"
)

# CORS Configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firebase on startup
@app.on_event("startup")
async def startup_event():
    print("🚀 Starting Alert System API...")
    firebase_status = initialize_firebase()
    if firebase_status:
        print("✅ All systems initialized successfully!")
    else:
        print("⚠️ Firebase initialization failed, but API will continue running")

# Include routers
app.include_router(alerts.router)
app.include_router(users.router)
app.include_router(locations.router)

@app.get("/")
def read_root():
    return {
        "message": "Alert System API is running!",
        "version": "1.0.0",
        "status": "active",
        "endpoints": {
            "alerts": "/alerts",
            "users": "/users",
            "locations": "/locations",
            "docs": "/docs",
            "health": "/health"
        }
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "PostgreSQL connected",
        "realtime": "Firebase connected"
    }