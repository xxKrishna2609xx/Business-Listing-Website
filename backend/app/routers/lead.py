from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.models.lead import LeadCreate
from app.services.lead_service import (
    create_lead,
    get_all_leads,
    get_user_leads,
    delete_lead
)

from app.core.auth import get_admin_user
from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)

from fastapi import Request
from app.core.config import settings



from fastapi import APIRouter, Depends

from app.core.auth import get_current_user
from app.models.lead import LeadCreate
from app.services.lead_service import (
    create_lead,
    get_all_leads,
    get_user_leads,
    delete_lead,
)

from app.middleware.rate_limit import (
    limiter,
    ip_key,
    user_key,
)




router = APIRouter()


@router.post("/api/leads")
@limiter.limit(
    settings.LEAD_RATE_LIMIT,
    key_func=user_key
)
async def create_lead_endpoint(request:Request, lead: LeadCreate, current_user=Depends(get_current_user)):
    return await create_lead(lead, current_user)


@router.get("/api/leads")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def get_leads(
    request: Request,
    admin=Depends(get_admin_user),
):
    return await get_all_leads()


@router.get("/api/my-leads")
@limiter.limit(
    settings.DEFAULT_RATE_LIMIT,
    key_func=user_key
)
async def get_my_leads_endpoint(
    request: Request,
    current_user=Depends(get_current_user),
):
    return await get_user_leads(current_user)


@router.delete("/api/leads/{id}")
@limiter.limit(
    settings.ADMIN_RATE_LIMIT,
    key_func=user_key
)
async def delete_lead_endpoint(request: Request, id: str, admin=Depends(get_admin_user)):
    return await delete_lead(id)