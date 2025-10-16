from firebase_admin import db
from datetime import datetime
from typing import Dict, Any, Optional

class FirebaseAlertService:
    
    def __init__(self):
        from app.firebase.config import initialize_firebase
        # Make sure Firebase is initialized
        initialize_firebase()
        self.ref = db.reference('/alerts')
    
    def create_alert(self, alert_data: Dict[str, Any]) -> str:
        """Create a new real-time alert in Firebase"""
        try:
            alert_id = self.ref.push().key
            alert_data['id'] = alert_id
            alert_data['timestamp'] = datetime.utcnow().isoformat()
            alert_data['status'] = 'active'
            
            self.ref.child(alert_id).set(alert_data)
            return alert_id
        except Exception as e:
            print(f"Error creating alert: {e}")
            raise
    
    def get_all_alerts(self) -> Optional[Dict]:
        """Get all active alerts from Firebase"""
        try:
            return self.ref.get()
        except Exception as e:
            print(f"Error getting alerts: {e}")
            return None
    
    def get_alert(self, alert_id: str) -> Optional[Dict]:
        """Get specific alert by ID"""
        try:
            return self.ref.child(alert_id).get()
        except Exception as e:
            print(f"Error getting alert: {e}")
            return None
    
    def update_alert(self, alert_id: str, update_data: Dict[str, Any]) -> bool:
        """Update existing alert"""
        try:
            self.ref.child(alert_id).update(update_data)
            return True
        except Exception as e:
            print(f"Error updating alert: {e}")
            return False
    
    def delete_alert(self, alert_id: str) -> bool:
        """Delete alert from Firebase"""
        try:
            self.ref.child(alert_id).delete()
            return True
        except Exception as e:
            print(f"Error deleting alert: {e}")
            return False
    
    def get_active_alerts(self) -> Dict:
        """Get only active alerts"""
        try:
            all_alerts = self.ref.get()
            if not all_alerts:
                return {}
            
            active = {k: v for k, v in all_alerts.items() if v.get('status') == 'active'}
            return active
        except Exception as e:
            print(f"Error getting active alerts: {e}")
            return {}