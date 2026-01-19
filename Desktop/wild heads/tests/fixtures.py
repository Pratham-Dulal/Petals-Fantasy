import pytest
from httpx import AsyncClient
from wildheads.models import User
from wildheads.core.security import get_password_hash
from sqlalchemy.future import select

# We need a way to promote a user to admin for testing.
# We can create a fixture that uses the DB session to create an admin.

@pytest.fixture
async def admin_token(client: AsyncClient):
    # This fixture should return a token for an admin user
    # Ideally we'd reuse the 'db' session but it's tricky with the AsyncClient isolation.
    # Simple hack: Register via API, then upgrade via SQL.
    
    email = "admin2@hospital.com"
    pwd = "adminpass"
    
    # 1. Register as patient
    res = await client.post("/patients/register", json={
        "email": email,
        "password": pwd,
        "full_name": "Admin Test"
    })
    
    if res.status_code == 201:
        # 2. Login to get token? No, we need to be admin FIRST.
        # We need to access the DB to update the role.
        # Since we are using in-memory sqlite shared via StaticPool in conftest,
        # we CAN use a separate session to update it.
        from wildheads.database import AsyncSessionLocal
        
        async with AsyncSessionLocal() as session:
           result = await session.execute(select(User).where(User.email == email))
           user = result.scalars().first()
           if user:
               user.role = "admin"
               await session.commit()
    
    # 3. Login
    login_res = await client.post("/auth/login", data={"username": email, "password": pwd})
    return login_res.json()["access_token"]
