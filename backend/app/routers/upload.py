from fastapi import APIRouter, UploadFile, File

from app.services.upload_service import upload_image_file
from fastapi import Request
from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)
from fastapi import Depends
from app.core.auth import get_current_user
from app.core.config import settings

router = APIRouter()


@router.post("/api/upload")
@router.post("/api/upload")
@limiter.limit(
    settings.UPLOAD_RATE_LIMIT,
    key_func=user_key
)
async def upload_image(
    request: Request,
    file: UploadFile = File(...),
    current_user=Depends(get_current_user),
):
    return await upload_image_file(file)
