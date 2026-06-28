from fastapi import APIRouter
from fastapi import Request
from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)

from app.core.config import settings


from app.models.auth import (
    UserRegister,
    UserLogin,
    RefreshTokenRequest,
)

from app.services.auth_service import (
    register_user,
    login_user,
    refresh_token_service
)

router = APIRouter()


@router.post("/api/auth/register")
@limiter.limit(settings.AUTH_RATE_LIMIT, key_func=ip_key)
async def register(request: Request, user: UserRegister):
    return await register_user(user)


@router.post("/api/auth/login")
@limiter.limit(settings.AUTH_RATE_LIMIT, key_func=ip_key)
async def login(request: Request, user: UserLogin):
    return await login_user(user)


@router.post("/api/auth/refresh")
@limiter.limit("20/minute", key_func=user_key)
async def refresh_token(request: Request, body: RefreshTokenRequest,):
    return await refresh_token_service(body)

