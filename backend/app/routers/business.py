from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.services.business_service import (
    get_all_businesses,
    get_featured_businesses,
    get_business_by_id,
    update_business,
    get_user_businesses,
    search_businesses
)
from fastapi import Request

from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)

from app.core.config import settings

router = APIRouter()


@router.get("/api/businesses")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=ip_key
)
async def get_businesses(
    request: Request,
):
    return await get_all_businesses()


@router.get("/api/businesses/featured")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=ip_key
)
async def get_featured_businesses_endpoint(
    request: Request,
):
    return await get_featured_businesses()
 

@router.get("/api/businesses/{id}")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=ip_key
)
async def get_business(
    request: Request,
    id: str,
):
    return await get_business_by_id(id)


@router.put("/api/business/{business_id}")
@limiter.limit(settings.DEFAULT_RATE_LIMIT, key_func=user_key)
async def update_business_endpoint(request: Request, business_id: str, data: dict, current_user=Depends(get_current_user),):
    return await update_business(business_id, data, current_user)


@router.get("/api/my-businesses")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key
)
async def get_my_businesses(
    request: Request,
    current_user=Depends(get_current_user),
):
    return await get_user_businesses(current_user)


@router.get("/api/search")
@limiter.limit(
    settings.SEARCH_RATE_LIMIT,
    key_func=ip_key
)
async def search_businesses_endpoint(
    request: Request,
    query: str = "",
    city: str = "",
    pincode: str = "",
    categoryId: str = "",
    subcategoryId: str = "",
    brand: str = "",
    page: int = 1,
    limit: int = 6,
):
    return await search_businesses(
        query=query,
        city=city,
        pincode=pincode,
        categoryId=categoryId,
        subcategoryId=subcategoryId,
        brand=brand,
        page=page,
        limit=limit
    )
