from fastapi import APIRouter, HTTPException, Query
from typing import Optional

from ..database import get_db

router = APIRouter(prefix="/businesses", tags=["Businesses"])


def _fmt(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id", ""))
    return d


@router.get("")
async def list_businesses(
    query: Optional[str] = None,
    city: Optional[str] = None,
    category: Optional[str] = None,
    subcategory: Optional[str] = None,
    featured: Optional[bool] = None,
    sort: Optional[str] = Query(default="rating", enum=["rating", "reviews", "latest"]),
    limit: int = Query(default=20, ge=1, le=100),
    skip: int = Query(default=0, ge=0),
):
    db = get_db()

    # Base filter: only approved listings
    filters: dict = {"status": "APPROVED"}
    and_clauses = []

    # Free-text search across multiple fields
    if query:
        and_clauses.append({
            "$or": [
                {"businessName": {"$regex": query, "$options": "i"}},
                {"description": {"$regex": query, "$options": "i"}},
                {"categoryName": {"$regex": query, "$options": "i"}},
                {"subcategoryName": {"$regex": query, "$options": "i"}},
                {"city": {"$regex": query, "$options": "i"}},
                {"services": {"$elemMatch": {"$regex": query, "$options": "i"}}},
            ]
        })

    # Strict city filter
    if city:
        filters["city"] = {"$regex": city, "$options": "i"}

    # Category filter — accepts either a category ID or name substring
    if category:
        and_clauses.append({
            "$or": [
                {"categoryId": category},
                {"categoryName": {"$regex": category, "$options": "i"}},
                {"subcategoryId": category},
                {"subcategoryName": {"$regex": category, "$options": "i"}},
            ]
        })

    if subcategory:
        filters["subcategoryId"] = subcategory

    if featured is not None:
        filters["featured"] = featured

    if and_clauses:
        filters["$and"] = and_clauses

    # Sorting
    sort_map = {
        "rating": ("rating", -1),
        "reviews": ("reviewCount", -1),
        "latest": ("createdAt", -1),
    }
    sort_field, sort_dir = sort_map.get(sort, ("rating", -1))

    cursor = db.businesses.find(filters).sort(sort_field, sort_dir).skip(skip).limit(limit)
    docs = await cursor.to_list(length=limit)
    return [_fmt(d) for d in docs]


@router.get("/{business_id}")
async def get_business(business_id: str):
    db = get_db()
    doc = await db.businesses.find_one({"_id": business_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Business not found.")
    return _fmt(doc)
