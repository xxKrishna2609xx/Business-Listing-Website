from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.models.bookmark import BookmarkCreate
from app.services.bookmark_service import (
    add_bookmark,
    get_user_bookmarks,
    remove_bookmark
)
from fastapi import Request
from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)

from app.core.config import settings

router = APIRouter()


@router.post("/api/bookmarks")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key
)
async def add_bookmark_endpoint(
    request: Request,
    bookmark: BookmarkCreate,
    current_user=Depends(get_current_user),
):
    return await add_bookmark(bookmark, current_user)

@router.get("/api/bookmarks/{user_id}")

async def get_bookmarks(user_id: str):
    return await get_user_bookmarks(user_id)


@router.delete("/api/bookmarks/{user_id}/{business_id}")

async def remove_bookmark_endpoint(
    user_id: str,
    business_id: str
):
    return await remove_bookmark(user_id, business_id)