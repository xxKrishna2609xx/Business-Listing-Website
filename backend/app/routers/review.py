from fastapi import APIRouter, Depends

from app.models.review import ReviewCreate
from app.core.auth import get_current_user
from app.services.review_service import (
    create_or_update_review,
    get_reviews_with_user_names
)
from fastapi import Request
from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)

from app.core.config import settings

router = APIRouter()


@router.post("/api/reviews")
@limiter.limit(
    settings.REVIEW_RATE_LIMIT,
    key_func=user_key
)
async def add_review(
    request: Request,
    review: ReviewCreate,
    current_user=Depends(get_current_user)
):
    return await create_or_update_review(review, current_user)

@router.get("/api/reviews/{business_id}")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=ip_key
)
async def get_reviews(
    request: Request,
    business_id: str,
):
    return await get_reviews_with_user_names(business_id)
