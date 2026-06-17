from fastapi import APIRouter, Depends, HTTPException

from ..models.business import BusinessUpdate
from ..auth.dependencies import get_admin_user
from ..database import get_db

router = APIRouter(prefix="/admin", tags=["Admin"])


def _fmt(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id", ""))
    return d


@router.get("/stats")
async def get_stats(_: dict = Depends(get_admin_user)):
    """Dashboard statistics card data."""
    db = get_db()

    total = await db.businesses.count_documents({"status": "APPROVED"})
    pending = await db.applications.count_documents({"status": "PENDING"})
    approved = await db.businesses.count_documents({"status": "APPROVED"})
    rejected = await db.applications.count_documents({"status": "REJECTED"})
    featured = await db.businesses.count_documents({"featured": True})
    leads = await db.leads.count_documents({})

    return {
        "totalListings": total,
        "pendingApplications": pending,
        "approvedListings": approved,
        "rejectedListings": rejected,
        "featuredListings": featured,
        "totalLeads": leads,
    }


@router.get("/listings")
async def get_all_listings(_: dict = Depends(get_admin_user)):
    """Full business listing list for admin management."""
    db = get_db()
    cursor = db.businesses.find({}).sort("createdAt", -1)
    docs = await cursor.to_list(length=1000)
    return [_fmt(d) for d in docs]


@router.patch("/listings/{business_id}")
async def update_listing(
    business_id: str,
    data: BusinessUpdate,
    _: dict = Depends(get_admin_user),
):
    """Admin — toggle featured/verified or change status."""
    db = get_db()

    # Build update dict — only include non-None fields
    update_fields = {k: v for k, v in data.model_dump().items() if v is not None}
    if not update_fields:
        raise HTTPException(status_code=400, detail="No update fields provided.")

    result = await db.businesses.update_one(
        {"_id": business_id}, {"$set": update_fields}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Business not found.")

    updated = await db.businesses.find_one({"_id": business_id})
    return _fmt(updated)


@router.delete("/listings/{business_id}", status_code=200)
async def delete_listing(business_id: str, _: dict = Depends(get_admin_user)):
    """Admin — permanently delete a listing."""
    db = get_db()
    result = await db.businesses.delete_one({"_id": business_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Business not found.")
    return {"message": "Business deleted successfully."}
