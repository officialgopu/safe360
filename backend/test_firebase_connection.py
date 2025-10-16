import firebase_admin
from firebase_admin import credentials, db
import os

def test_firebase():
    try:
        # Get the current directory
        current_dir = os.path.dirname(os.path.abspath(__file__))
        creds_path = os.path.join(current_dir, 'firebase-credentials.json')
        
        # Initialize Firebase
        cred = credentials.Certificate(creds_path)
        firebase_admin.initialize_app(cred, {
            'databaseURL': 'https://preact-49c27-default-rtdb.asia-southeast1.firebasedatabase.app'
        })
        
        # Try to read from the database
        ref = db.reference('/')
        print("✅ Firebase connection successful!")
        print("Database reference:", ref.get())
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    test_firebase()