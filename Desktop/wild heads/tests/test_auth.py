import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_register_and_login(client: AsyncClient):
    # 1. Register
    response = await client.post(
        "/users/",
        json={"email": "test@example.com", "password": "password123", "full_name": "Test User"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
    assert "id" in data

    # 2. Login
    response = await client.post(
        "/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    token_data = response.json()
    assert "access_token" in token_data
    assert token_data["token_type"] == "bearer"

@pytest.mark.asyncio
async def test_duplicate_email(client: AsyncClient):
    payload = {"email": "dup@example.com", "password": "pass", "full_name": "Dup"}
    await client.post("/users/", json=payload)
    response = await client.post("/users/", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"
