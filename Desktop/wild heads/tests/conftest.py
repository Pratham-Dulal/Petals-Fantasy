import pytest
import os
from typing import AsyncGenerator
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.pool import StaticPool

# Set env var BEFORE importing app to override .env loading for DB
os.environ["DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

from wildheads.main import app
from wildheads.database import Base, get_db

# Use in-memory SQLite for testing
SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///:memory:"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)

TestingSessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)

async def override_get_db():
    async with TestingSessionLocal() as session:
        yield session

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
async def prepare_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client() -> AsyncGenerator[AsyncClient, None]:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

@pytest.fixture
async def admin_token(client: AsyncClient):
    from wildheads.models import User
    from sqlalchemy.future import select
    
    email = "admin2@hospital.com"
    pwd = "adminpass"
    
    # 1. Register as patient
    res = await client.post("/patients/register", json={
        "email": email,
        "password": pwd,
        "full_name": "Admin Test"
    })
    
    if res.status_code == 201:
        # 2. Upgrade to admin directly in DB using the TEST session maker
        async with TestingSessionLocal() as session:
           result = await session.execute(select(User).where(User.email == email))
           user = result.scalars().first()
           if user:
               user.role = "admin"
               await session.commit()
    
    # 3. Login
    login_res = await client.post("/auth/login", data={"username": email, "password": pwd})
    return login_res.json()["access_token"]
