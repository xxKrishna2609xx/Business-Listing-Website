from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import get_admin_user
from app.models.admin import RejectApplicationRequest
from app.services.admin_service import (
    get_all_applications,
    approve_application,
    reject_application,
    delete_application,
    delete_business,
    toggle_business_verification,
    toggle_business_featured
)
from fastapi import Request
from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)

from app.core.config import settings

router = APIRouter()


@router.get("/api/admin/applications")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def get_applications(request: Request, admin=Depends(get_admin_user)):
    return await get_all_applications()


@router.put("/api/admin/applications/{id}/approve")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def approve_application_endpoint(
    request: Request,
    id: str,
    admin=Depends(get_admin_user)
):
    try:
        return await approve_application(id)
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.put("/api/admin/applications/{id}/reject")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def reject_application_endpoint(
    request: Request,
    id: str,
    payload: RejectApplicationRequest,
    admin=Depends(get_admin_user)
):
    return await reject_application(id, payload.reason)


@router.delete("/api/admin/applications/{id}")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def delete_application_endpoint(
    request: Request,
    id: str,
    admin=Depends(get_admin_user)
):
    try:
        return await delete_application(id)
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e)
        )


@router.delete("/api/admin/businesses/{id}")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def delete_business_endpoint(
    request: Request,
    id: str,
    admin=Depends(get_admin_user)
):
    return await delete_business(id)


@router.put("/api/admin/businesses/{id}/verify")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def toggle_verify_endpoint(
    request: Request,
    id: str,
    admin=Depends(get_admin_user)
):
    return await toggle_business_verification(id)


@router.put("/api/admin/businesses/{id}/feature")
@limiter.limit(settings.ADMIN_RATE_LIMIT,key_func=user_key)
async def toggle_feature_endpoint(request: Request, id: str, admin=Depends(get_admin_user)):
    return await toggle_business_featured(id)


