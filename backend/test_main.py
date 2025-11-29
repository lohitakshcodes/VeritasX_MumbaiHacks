import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.main import app
from backend.database import Base, get_db

# Setup test DB
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the AI Misinformation Detection System API"}

def test_create_claim():
    response = client.post(
        "/claims/",
        json={"text": "The earth is flat", "source": "Internet"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["text"] == "The earth is flat"
    assert "id" in data

def test_read_claims():
    response = client.get("/claims/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_verify_claim_not_found():
    response = client.post("/verify-claim/?claim_id=9999")
    assert response.status_code == 404

# Note: We are not mocking the external APIs here for simplicity in this hackathon context,
# but in a real app we would mock fact_checker.verify_claim.
# For now, we test the flow, assuming the external call might fail or return default if no key.
