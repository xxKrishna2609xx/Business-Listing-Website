"""
Rate limiting middleware preparation.
Infrastructure prepared for future implementation with SlowAPI + Redis.
Currently disabled - ready to be enabled with minimal changes.
"""
import logging
from slowapi import Limiter
from fastapi import Request
from jose import jwt, JWTError


from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler
from app.core.config import settings


logger = logging.getLogger("app.middleware.rate_limit")


def ip_key(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")

    if forwarded:
        return forwarded.split(",")[0].strip()

    return request.client.host if request.client else "unknown"

def user_key(request: Request) -> str:
    """
    Rate limit authenticated users by user_id.
    Falls back to IP if JWT is missing or invalid.
    """

    auth = request.headers.get("Authorization")

    if auth and auth.startswith("Bearer "):

        token = auth.split(" ")[1]

        try:
            payload = jwt.decode(
                token,
                settings.SECRET_KEY,
                algorithms=[settings.ALGORITHM],
            )

            user_id = payload.get("user_id")

            if user_id:
                return f"user:{user_id}"

        except JWTError:
            pass

    return ip_key(request)


limiter = Limiter(
    key_func=ip_key,
    default_limits=[settings.DEFAULT_RATE_LIMIT],
)

def setup_rate_limiting(app):
    app.state.limiter = limiter
    app.add_exception_handler(
        RateLimitExceeded,
        _rate_limit_exceeded_handler
    )

# Export for use in main.py
__all__ = ["limiter", "ip_key", "user_key", "setup_rate_limiting"]
