from fastapi import APIRouter

from app.services.stats_service import (
    get_banners,
    get_quick_services,
    get_public_stats
)

router = APIRouter()


@router.get("/api/banners")
async def list_banners():
    return await get_banners()


@router.get("/api/quick-services")
async def list_quick_services():
    return await get_quick_services()


@router.get("/api/public-stats")
async def get_stats():
    return await get_public_stats()