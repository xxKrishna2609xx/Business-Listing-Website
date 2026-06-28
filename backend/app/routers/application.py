from fastapi import APIRouter, Depends, Request

from app.core.auth import get_current_user
from app.models.business import BusinessApplication
from app.services.application_service import (
    submit_business_application,
    get_user_applications,
)
from app.middleware.rate_limit import (
    limiter,
    user_key,
)
from app.core.config import settings

router = APIRouter()


@router.post("/api/business/apply")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key,
)
async def apply_business(
    request: Request,
    application: BusinessApplication,
    current_user=Depends(get_current_user),
):
    return await submit_business_application(application, current_user)


@router.get("/api/my-applications")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key,
)
async def get_my_applications(
    request: Request,
    current_user=Depends(get_current_user),
):
    return await get_user_applications(current_user)