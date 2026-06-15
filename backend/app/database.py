from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings

_client: AsyncIOMotorClient = None


async def connect_db():
    global _client
    _client = AsyncIOMotorClient(settings.MONGO_URI)
    # Verify connection
    await _client.admin.command("ping")
    print("[OK] Connected to MongoDB successfully.")


async def close_db():
    global _client
    if _client:
        _client.close()
        print("[DONE] MongoDB connection closed.")


def get_db():
    """Return the application database."""
    if _client is None:
        raise RuntimeError("Database not connected. Call connect_db() first.")
    return _client[settings.DB_NAME]
