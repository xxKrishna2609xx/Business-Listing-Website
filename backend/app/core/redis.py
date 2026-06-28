"""
Redis client initialization and connection management.
Infrastructure prepared for caching, session management, and rate limiting.
"""
import logging
from typing import Optional

from app.core.config import settings

logger = logging.getLogger("app.core.redis")


class RedisClient:
    """Redis client wrapper for async operations."""

    def __init__(self):
        """Initialize Redis client."""
        self.client = None
        self.enabled = bool(settings.REDIS_URL)

    async def connect(self) -> None:
        """Establish connection to Redis."""
        if not self.enabled:
            logger.info("Redis disabled - REDIS_URL not configured")
            return

        try:
            import aioredis

            self.client = await aioredis.create_redis_pool(settings.REDIS_URL)
            logger.info("Connected to Redis successfully")

        except ImportError:
            logger.warning("aioredis not installed - Redis features disabled")
            self.enabled = False

        except Exception as exc:
            logger.error(f"Failed to connect to Redis: {exc}")
            self.enabled = False

    async def disconnect(self) -> None:
        """Close connection to Redis."""
        if self.client:
            self.client.close()
            await self.client.wait_closed()
            logger.info("Disconnected from Redis")

    async def get(self, key: str) -> Optional[str]:
        """Get value from Redis."""
        if not self.enabled or not self.client:
            return None

        try:
            value = await self.client.get(key)
            return value.decode() if value else None
        except Exception as exc:
            logger.error(f"Redis GET error: {exc}")
            return None

    async def set(self, key: str, value: str, ex: int = None) -> bool:
        """Set value in Redis."""
        if not self.enabled or not self.client:
            return False

        try:
            await self.client.set(key, value, expire=ex)
            return True
        except Exception as exc:
            logger.error(f"Redis SET error: {exc}")
            return False

    async def delete(self, key: str) -> bool:
        """Delete key from Redis."""
        if not self.enabled or not self.client:
            return False

        try:
            await self.client.delete(key)
            return True
        except Exception as exc:
            logger.error(f"Redis DELETE error: {exc}")
            return False

    async def exists(self, key: str) -> bool:
        """Check if key exists in Redis."""
        if not self.enabled or not self.client:
            return False

        try:
            result = await self.client.exists(key)
            return bool(result)
        except Exception as exc:
            logger.error(f"Redis EXISTS error: {exc}")
            return False


# Global Redis client instance
redis_client = RedisClient()


async def init_redis() -> None:
    """Initialize Redis connection on startup."""
    await redis_client.connect()


async def close_redis() -> None:
    """Close Redis connection on shutdown."""
    await redis_client.disconnect()
