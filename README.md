# Safe360 - Real-time Alert System

A real-time alert system built with FastAPI, React, PostgreSQL, and Firebase.

## Project Structure

```
safe360/
├── backend/           # FastAPI Backend
│   ├── app/
│   │   ├── database/
│   │   ├── firebase/
│   │   ├── models/
│   │   ├── routers/
│   │   └── schemas/
│   └── requirements.txt
│
└── frontend/          # React Frontend
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   └── hooks/
    └── package.json
```

## Features

- Real-time alert notifications
- PostgreSQL for historical data
- Firebase for real-time updates
- Interactive map interface
- User authentication
- Alert submission and tracking

## Setup Instructions

### Backend Setup

1. Create a virtual environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables in `.env`

4. Run the server:
```bash
uvicorn app.main:app --reload
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

## API Documentation

- API documentation is available at `/docs` when the backend server is running
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
till nowq we done alert submission done
