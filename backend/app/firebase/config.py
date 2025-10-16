import firebase_admin
from firebase_admin import credentials, db
from app.config import get_settings
import os

settings = get_settings()

def initialize_firebase():
    """Initialize Firebase Admin SDK"""
    try:
        # Get absolute path of credentials file
        creds_path = os.path.abspath(settings.firebase_credentials_path)
        
        # Check if file exists
        if not os.path.exists(creds_path):
            print(f"❌ Firebase credentials file not found at: {creds_path}")
            print("Please download firebase-credentials.json and place it in the backend folder")
            return False
        
        # Initialize Firebase only once
        if not firebase_admin._apps:
            cred = credentials.Certificate(creds_path)
            firebase_admin.initialize_app(cred, {
                'databaseURL': 'https://preact-49c27-default-rtdb.asia-southeast1.firebasedatabase.app'
            })
            print("✅ Firebase initialized successfully!")
            return True
        else:
            print("ℹ️ Firebase already initialized")
            return True
            
    except Exception as e:
        print(f"❌ Firebase initialization error: {e}")
        return False

def get_firebase_db():
    """Get Firebase database reference"""
    try:
        return db.reference()
    except Exception as e:
        print(f"❌ Error getting Firebase database: {e}")
        return None