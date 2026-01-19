import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_patient(client: AsyncClient):
    payload = {
        "email": "patient@example.com",
        "password": "strongpassword",
        "full_name": "John Doe",
        "patient_profile": {
            "dob": "1990-01-01T00:00:00",
            "gender": "Male",
            "phone": "1234567890",
            "address": "123 Main St"
        },
        "medical_history": {
            "allergies": "Peanuts",
            "chronic_conditions": "None"
        }
    }
    response = await client.post("/patients/register", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["medical_history"]["allergies"] == "Peanuts"

@pytest.mark.asyncio
async def test_get_patient_profile(client: AsyncClient):
    # 1. Register
    reg_payload = {
        "email": "jane@example.com",
        "password": "password",
        "full_name": "Jane Doe"
    }
    reg_res = await client.post("/patients/register", json=reg_payload)
    assert reg_res.status_code == 201
    
    # 2. Login
    login_res = await client.post(
        "/auth/login",
        data={"username": "jane@example.com", "password": "password"}
    )
    token = login_res.json()["access_token"]
    
    # 3. Get Profile
    response = await client.get(
        "/patients/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["user_id"] is not None
