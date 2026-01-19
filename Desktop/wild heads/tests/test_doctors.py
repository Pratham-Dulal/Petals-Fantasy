import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_doctor(client: AsyncClient, admin_token):
    # Prereq: Create Dept
    headers = {"Authorization": f"Bearer {admin_token}"}
    dept_res = await client.post("/departments/", json={"name": "Pediatrics", "location": "C1"}, headers=headers)
    dept_id = dept_res.json()["id"]
    
    # Prereq: Create target user (as patient)
    reg_res = await client.post("/patients/register", json={
        "email": "dr.house@hospital.com",
        "password": "vicodin",
        "full_name": "Gregory House"
    })
    user_id = reg_res.json()["user_id"]
    
    # Create Doctor Profile
    payload = {
        "user_id": user_id,
        "department_id": dept_id,
        "specialization": "Diagnostician",
        "qualification": "MD",
        "experience_years": 15,
        "consultation_fee": 50000
    }
    
    response = await client.post("/doctors/", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["specialization"] == "Diagnostician"
    assert data["department"]["name"] == "Pediatrics"

@pytest.mark.asyncio
async def test_list_doctors(client: AsyncClient):
    response = await client.get("/doctors/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
