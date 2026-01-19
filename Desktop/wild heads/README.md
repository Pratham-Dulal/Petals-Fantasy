# WildHeads Hospital Resource Management System (HRM)

## Purpose
An AI-powered Hospital Resource Management system designed to manage patient records, appointments, doctor consultations, and AI-assisted diagnosis. Built with modern, scalable technologies.

## Technology Stack
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL (Async)
- **Authentication**: JWT (Stateless)
- **AI Integration**: Anthropic Claude (Planned)

### Key Features
- **User Management**: Authentication (JWT), RBAC (Admin/Patient), Profile Management.
- **Patient Registration**: Comprehensive registration with Medical History.
- **Doctor & Department**: Admin tools to manage hospital resources.
- **Security**: Robust password hashing, stateless auth, proper CORS.

## Setup Steps

### 1. Prerequisites
- Python 3.10+
- PostgreSQL 15+

### 2. Installation
```bash
# Clone the repository
git clone <repo-url>
cd wild-heads

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Configuration
Copy `.env.example` to `.env` (or create one):
```ini
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/wildheads
SECRET_KEY=your_secure_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 4. Running the Application
```bash
uvicorn wildheads.main:app --reload
```
API Docs will be available at: `http://localhost:8000/docs`

### 5. Running Tests
The project uses `pytest` with an in-memory SQLite database for test isolation.
```bash
python -m pytest
```

## Architecture
This project follows a strict layered architecture:
- **Routers**: API Endpoints (Validation, HTTP handling).
- **Services**: Business Logic (Rules, processing).
- **Core**: Configuration, Logging, Security.
- **Models/Schemas**: Data definitions.
