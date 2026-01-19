import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_read_users_me(client: AsyncClient):
    # 1. Register & Login to get token
    await client.post(
        "/users/",
        json={"email": "me@example.com", "password": "password", "full_name": "Me"}
    )
    login_res = await client.post(
        "/auth/login",
        data={"username": "me@example.com", "password": "password"}
    )
    token = login_res.json()["access_token"]

    # 2. Get Profile
    response = await client.get(
        "/users/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "me@example.com"

@pytest.mark.asyncio
async def test_read_users_me_unauthorized(client: AsyncClient):
    response = await client.get("/users/me")
    assert response.status_code == 401
