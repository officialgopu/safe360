from app.database.connection import Base, engine
from app.models import User, Alert, Location

def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)
    print("✅ All tables created successfully!")

if __name__ == "__main__":
    create_tables()