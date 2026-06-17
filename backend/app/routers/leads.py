import uuid
from datetime import datetime
from fastapi import APIRouter, Depends

from ..models.lead import LeadCreate
from ..auth.dependencies import get_current_user, get_admin_user
from ..database import get_db

router = APIRouter(prefix="/leads", tags=["Leads"])


def _fmt(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id", ""))
    return d


@router.post("", status_code=201)
async def submit_lead(
    data: LeadCreate, current_user: dict = Depends(get_current_user)
):
    """Authenticated users can submit a quote/lead request."""
    db = get_db()
    lead_id = "lead-" + uuid.uuid4().hex[:8]

    doc = {
        "_id": lead_id,
        **data.model_dump(),
        "userId": current_user["uid"],
        "createdAt": datetime.utcnow().isoformat() + "Z",
    }

    await db.leads.insert_one(doc)
    return _fmt(doc)


@router.get("")
async def list_all_leads(_: dict = Depends(get_admin_user)):
    """Admin only — all leads sorted newest first."""
    db = get_db()
    cursor = db.leads.find({}).sort("createdAt", -1)
    docs = await cursor.to_list(length=1000)
    return [_fmt(d) for d in docs]


@router.get("/my")
async def list_my_leads(current_user: dict = Depends(get_current_user)):
    """Authenticated user — returns only their own leads."""
    db = get_db()
    cursor = db.leads.find({"userId": current_user["uid"]}).sort("createdAt", -1)
    docs = await cursor.to_list(length=200)
    return [_fmt(d) for d in docs]
