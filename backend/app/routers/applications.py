import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException

from ..models.application import ApplicationCreate, ApplicationUpdate
from ..auth.dependencies import get_admin_user
from ..database import get_db

router = APIRouter(prefix="/applications", tags=["Applications"])


def _fmt(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id", ""))
    return d


@router.post("", status_code=201)
async def submit_application(data: ApplicationCreate):
    """Public endpoint — anyone can submit a business application."""
    db = get_db()
    app_id = "app-" + uuid.uuid4().hex[:8]

    doc = {
        "_id": app_id,
        **data.model_dump(),
        "status": "PENDING",
        "createdAt": datetime.utcnow().isoformat() + "Z",
    }

    await db.applications.insert_one(doc)
    return _fmt(doc)


@router.get("")
async def list_applications(_: dict = Depends(get_admin_user)):
    """Admin only — returns all applications sorted newest first."""
    db = get_db()
    cursor = db.applications.find({}).sort("createdAt", -1)
    docs = await cursor.to_list(length=500)
    return [_fmt(d) for d in docs]


@router.patch("/{app_id}")
async def update_application(
    app_id: str,
    data: ApplicationUpdate,
    _: dict = Depends(get_admin_user),
):
    """Admin only — approve or reject an application.
    On APPROVED, automatically creates an approved business listing.
    """
    db = get_db()

    app = await db.applications.find_one({"_id": app_id})
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")

    await db.applications.update_one({"_id": app_id}, {"$set": {"status": data.status}})

    # Auto-promote to business listing on approval
    if data.status == "APPROVED":
        biz_id = "biz-" + uuid.uuid4().hex[:8]

        # Look up readable category / subcategory names
        cat = await db.categories.find_one({"_id": app.get("categoryId")})
        sub = await db.subcategories.find_one({"_id": app.get("subcategoryId")})

        logo_name = app["businessName"].replace(" ", "+")
        biz_doc = {
            "_id": biz_id,
            "businessName": app["businessName"],
            "ownerName": app["ownerName"],
            "email": app["email"],
            "phone": app["phone"],
            "categoryId": app.get("categoryId", ""),
            "subcategoryId": app.get("subcategoryId", ""),
            "address": app["address"],
            "city": app["city"],
            "state": app["state"],
            "website": app.get("website", ""),
            "description": app["description"],
            "logoUrl": (
                f"https://ui-avatars.com/api/?name={logo_name}"
                "&background=2563eb&color=fff&size=128&rounded=true"
            ),
            "galleryImages": [],
            "verified": True,
            "featured": False,
            "status": "APPROVED",
            "categoryName": cat["name"] if cat else "",
            "subcategoryName": sub["name"] if sub else "",
            "rating": 0.0,
            "reviewCount": 0,
            "socialMediaLinks": {},
            "services": app.get("services", []),
            "brands": [],
            "createdAt": datetime.utcnow().isoformat() + "Z",
        }

        await db.businesses.insert_one(biz_doc)

    updated = await db.applications.find_one({"_id": app_id})
    return _fmt(updated)
