from app.firebase.config import initialize_firebase, get_firebase_db

def test_firebase_connection():
    try:
        # Initialize Firebase
        initialize_firebase()
        
        # Try to get a database reference
        db = get_firebase_db()
        
        # Try to read some data (this will validate the connection)
        test_ref = db.child('test').get()
        print("✅ Firebase connection successful!")
        
    except Exception as e:
        print(f"❌ Firebase connection error: {e}")

if __name__ == "__main__":
    test_firebase_connection()