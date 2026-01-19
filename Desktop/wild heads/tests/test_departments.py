import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_department_admin(client: AsyncClient, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    payload = {
        "name": "Cardiology",
        "description": "Heart stuff",
        "location": "Building A, Floor 3"
    }
    response = await client.post("/departments/", json=payload, headers=headers)
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Cardiology"
    assert "id" in data

@pytest.mark.asyncio
async def test_create_department_unauthorized(client: AsyncClient):
    payload = {
        "name": "Neurology",
        "description": "Brain stuff",
        "location": "Building B"
    }
    # No auth
    response = await client.post("/departments/", json=payload)
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_list_departments(client: AsyncClient):
    response = await client.get("/departments/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
