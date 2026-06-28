from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_current_user
from app.models.auth import UpdateProfile
from app.services.user_service import (
    update_user_profile,
    get_user_business_leads,
    get_current_user_info,
)
from fastapi import Request

from app.middleware.rate_limit import (
    limiter,
    user_key,
)

from app.core.config import settings

router = APIRouter()


@router.put("/api/users/{user_id}")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key
)
async def update_profile(
    request: Request,
    user_id: str,
    profile: UpdateProfile,
    current_user=Depends(get_current_user),
):
    
    return await update_user_profile(user_id, profile, current_user,)


@router.get("/api/my-business-leads")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key
)
async def get_my_business_leads(
    request: Request,
    current_user=Depends(get_current_user),
):
    return await get_user_business_leads(current_user["email"])


@router.get("/api/me")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key
)
async def get_me(
    request: Request,
    current_user=Depends(get_current_user),
):
    return await get_current_user_info(current_user)
