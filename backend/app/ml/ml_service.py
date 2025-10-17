import joblib
import numpy as np
from pathlib import Path
from typing import Dict, List, Optional
import os

ML_AVAILABLE = True

class MLService:
    def __init__(self):
        self.models_dir = Path(__file__).parent / "models"
        if not self.models_dir.exists():
            self.models_dir.mkdir(parents=True, exist_ok=True)
        self.crime_model = None
        self.weather_model = None
        self.fraud_model = None
        self.load_models()
    
    def load_models(self):
        """Load all ML models"""
        try:
            crime_path = self.models_dir / "crime_risk_model.pkl"
            weather_path = self.models_dir / "weather_risk_model.pkl"
            fraud_path = self.models_dir / "fraud_risk_model.pkl"
            
            if crime_path.exists():
                self.crime_model = joblib.load(crime_path)
                print("✅ Crime model loaded successfully")
            else:
                print("⚠️ Crime model not found")
            
            if weather_path.exists():
                self.weather_model = joblib.load(weather_path)
                print("✅ Weather model loaded successfully")
            else:
                print("⚠️ Weather model not found")
            
            if fraud_path.exists():
                self.fraud_model = joblib.load(fraud_path)
                print("✅ Fraud model loaded successfully")
            else:
                print("⚠️ Fraud model not found")
                
        except Exception as e:
            print(f"❌ Error loading models: {e}")
    
    def predict_crime_risk(self, data: Dict) -> Dict:
        """
        Predict crime risk
        Input: {population_density, unemployment_rate, income_level, 
                prior_incidents, location_risk, economic_stress, 
                is_night, is_weekend}
        Output: {probability, risk_level, is_high_risk}
        """
        try:
            if self.crime_model is None:
                return {"error": "Crime model not loaded", "probability": 0.0}
            
            features = np.array([[
                data.get('population_density', 1000),
                data.get('unemployment_rate', 5.0),
                data.get('income_level', 50000),
                data.get('prior_incidents', 0),
                data.get('location_risk', 0.5),
                data.get('economic_stress', 0.5),
                data.get('is_night', 0),
                data.get('is_weekend', 0)
            ]])
            
            probability = float(self.crime_model.predict_proba(features)[0][1])
            is_high_risk = probability > 0.5
            
            if probability > 0.7:
                risk_level = "critical"
            elif probability > 0.5:
                risk_level = "high"
            elif probability > 0.3:
                risk_level = "medium"
            else:
                risk_level = "low"
            
            factors = []
            if data.get('population_density'):
                factors.append({"name": "Population Density", "weight": 0.2})
            if data.get('unemployment_rate'):
                factors.append({"name": "Unemployment Rate", "weight": 0.15})
            if data.get('prior_incidents'):
                factors.append({"name": "Prior Incidents", "weight": 0.3})
            if data.get('economic_stress'):
                factors.append({"name": "Economic Stress", "weight": 0.2})
            if data.get('location_risk'):
                factors.append({"name": "Location Risk", "weight": 0.15})

            return {
                "risk_score": round(probability, 3),
                "confidence": round(probability * 100, 1),
                "factors": [{"name": f.get("name"), "weight": f.get("weight")} for f in factors],
                "recommendations": [
                    "Increase community policing in high-risk areas",
                    "Implement neighborhood watch programs",
                    "Improve street lighting in vulnerable locations",
                    "Deploy mobile surveillance units during peak hours"
                ]
            }
        except Exception as e:
            print(f"Error in crime prediction: {e}")
            return {
                "risk_score": 0.0,
                "confidence": 0.0,
                "factors": [],
                "recommendations": ["Unable to generate recommendations due to error"]
            }
    
    def predict_weather_risk(self, data: Dict) -> Dict:
        """
        Predict weather risk
        Input: {temperature, precipitation, wind_speed, humidity, 
                weather_encoded, hour, month}
        Output: PredictionResponse with risk assessment and recommendations
        """
        try:
            if self.weather_model is None:
                return {"error": "Weather model not loaded"}
            
            # Prepare the 11 required features
            features = np.array([[
                data.get('temperature', 25),                 # Temperature
                data.get('precipitation', 0),                # Precipitation
                data.get('wind_speed', 10),                  # Wind Speed
                data.get('humidity', 60),                    # Humidity
                data.get('weather_encoded', 0),              # Weather Code
                data.get('hour', 12),                        # Hour
                data.get('month', 6),                        # Month
                data.get('pressure', 1013.25),               # Air Pressure (hPa)
                data.get('visibility', 10),                  # Visibility (km)
                data.get('wind_direction', 180),             # Wind Direction (degrees)
                data.get('cloud_cover', 50)                  # Cloud Cover (%)
            ]])
            
            prediction = int(self.weather_model.predict(features)[0])
            probability = float(self.weather_model.predict_proba(features)[0][1])
            
            factors = []
            if data.get('temperature'):
                factors.append({"name": "Temperature", "weight": 0.2})
            if data.get('precipitation'):
                factors.append({"name": "Precipitation", "weight": 0.2})
            if data.get('wind_speed'):
                factors.append({"name": "Wind Speed", "weight": 0.3})
            if data.get('humidity'):
                factors.append({"name": "Humidity", "weight": 0.15})
            if data.get('hour'):
                factors.append({"name": "Time of Day", "weight": 0.15})

            return {
                "risk_score": round(probability, 3),
                "confidence": round(probability * 100, 1),
                "factors": [{"name": f.get("name"), "weight": f.get("weight")} for f in factors],
                "recommendations": [
                    "Monitor severe weather alerts",
                    "Prepare emergency evacuation routes",
                    "Ensure proper drainage systems",
                    "Stock emergency supplies"
                ]
            }
        except Exception as e:
            print(f"Error in weather prediction: {e}")
            return {
                "risk_score": 0.0,
                "confidence": 0.0,
                "factors": [],
                "recommendations": ["Unable to generate recommendations due to error"]
            }
    
    def predict_fraud_risk(self, data: Dict) -> Dict:
        """
        Predict fraud risk
        Input: {amount, victim_income, previous_frauds, 
                detection_time_hours, fraud_type_encoded, channel_encoded}
        Output: PredictionResponse with risk assessment and recommendations
        """
        try:
            if self.fraud_model is None:
                return {"error": "Fraud model not loaded"}
            
            features = np.array([[
                data.get('amount', 1000),
                data.get('victim_income', 50000),
                data.get('previous_frauds', 0),
                data.get('detection_time_hours', 24),
                data.get('fraud_type_encoded', 0),
                data.get('channel_encoded', 0)
            ]])
            
            prediction = int(self.fraud_model.predict(features)[0])
            probability = float(self.fraud_model.predict_proba(features)[0][1])
            
            factors = []
            if data.get('amount'):
                factors.append({"name": "Transaction Amount", "weight": 0.25})
            if data.get('victim_income'):
                factors.append({"name": "Victim Income Level", "weight": 0.15})
            if data.get('previous_frauds'):
                factors.append({"name": "Previous Fraud History", "weight": 0.3})
            if data.get('detection_time_hours'):
                factors.append({"name": "Detection Time", "weight": 0.15})
            if data.get('channel_encoded'):
                factors.append({"name": "Channel Risk", "weight": 0.15})

            return {
                "risk_score": round(probability, 3),
                "confidence": round(probability * 100, 1),
                "factors": [{"name": f.get("name"), "weight": f.get("weight")} for f in factors],
                "recommendations": [
                    "Implement additional verification steps",
                    "Monitor transaction patterns",
                    "Set up fraud alerts and notifications",
                    "Educate users about common fraud schemes"
                ]
            }
        except Exception as e:
            print(f"Error in fraud prediction: {e}")
            return {
                "risk_score": 0.0,
                "confidence": 0.0,
                "factors": [],
                "recommendations": ["Unable to generate recommendations due to error"]
            }
    
    def get_area_risk_scores(self, locations: List[Dict]) -> List[Dict]:
        """
        Calculate risk scores for multiple locations for heat map
        Input: [{"lat": float, "lng": float, "area_data": {...}}]
        Output: [{"lat": float, "lng": float, "risk_score": float, "risk_level": str}]
        """
        results = []
        for location in locations:
            area_data = location.get('area_data', {})
            crime_pred = self.predict_crime_risk(area_data)
            
            risk_score = crime_pred.get('probability', 0.0)
            
            if risk_score > 0.7:
                risk_level = "high"
                color = "#ef4444"  # red
            elif risk_score > 0.4:
                risk_level = "medium"
                color = "#f97316"  # orange
            else:
                risk_level = "low"
                color = "#22c55e"  # green
            
            results.append({
                "latitude": location.get('lat'),
                "longitude": location.get('lng'),
                "risk_score": round(risk_score, 3),
                "risk_level": risk_level,
                "color": color,
                "area_name": location.get('area_name', 'Unknown')
            })
        
        return results

# Global ML service instance
ml_service = MLService()