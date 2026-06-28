"""
MongoDB database connection and management.
"""
import logging
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import settings

logger = logging.getLogger("app.core.database")

# MongoDB client
client: AsyncIOMotorClient = None
db: AsyncIOMotorDatabase = None


async def connect_to_mongo() -> None:
    """Connect to MongoDB on startup."""
    global client, db

    try:
        client = AsyncIOMotorClient(settings.MONGO_URI)
        db = client[settings.DATABASE_NAME]
        
        # Verify connection by pinging the database
        await db.command("ping")
        logger.info(f"Connected to MongoDB: {settings.DATABASE_NAME}")

    except Exception as exc:
        logger.error(f"Failed to connect to MongoDB: {exc}")
        raise


async def disconnect_from_mongo() -> None:
    """Disconnect from MongoDB on shutdown."""
    global client

    if client:
        client.close()
        logger.info("Disconnected from MongoDB")
