from fastapi import APIRouter

from app.models.category import (
    CategoryCreate,
    CategoryUpdate,
    SubcategoryCreate,
)
from app.services.category_service import (
    get_all_categories,
    get_all_subcategories,
    create_category,
    delete_category,
    create_subcategory,
    delete_subcategory,
    update_category
)
from fastapi import Request
from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)
from app.core.auth import get_admin_user
from fastapi import Depends

from app.core.config import settings

router = APIRouter()


@router.get("/api/categories")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=ip_key
)
async def get_categories(request: Request,):
    return await get_all_categories()


@router.get("/api/subcategories")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=ip_key
)
async def get_subcategories(
    request: Request,
):
    return await get_all_subcategories()


@router.post("/api/categories")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def create_category_endpoint(
    request: Request,
    category: CategoryCreate,
    admin=Depends(get_admin_user),
):
    return await create_category(category)


@router.delete("/api/categories/{id}")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def delete_category_endpoint(
    request: Request,
    id: str,
    admin=Depends(get_admin_user),
):
    return await delete_category(id)


@router.post("/api/subcategories")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def create_subcategory_endpoint(
    request: Request,
    subcategory: SubcategoryCreate,
    admin=Depends(get_admin_user),
):
    return await create_subcategory(subcategory)


@router.delete("/api/subcategories/{id}")
@limiter.limit(settings.ADMIN_RATE_LIMIT,key_func=user_key)
async def delete_subcategory_endpoint(request: Request, id: str, admin=Depends(get_admin_user),):
    return await delete_subcategory(id)


@router.put("/api/categories/{id}")
@limiter.limit(settings.ADMIN_RATE_LIMIT, key_func=user_key)
async def update_category_endpoint(request: Request,  id: str, category: CategoryUpdate, admin=Depends(get_admin_user),):
    return await update_category(id, category)