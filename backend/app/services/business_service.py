from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException

import app.core.database as database
from app.utils.serializer import serializeDict, serializeList


async def get_all_businesses() -> list:
    """Get all approved businesses."""
    businesses = await database.db.businesses.find(
        {"$or": [{"status": "APPROVED"}, {"status": {"$exists": False}}]}
    ).to_list(1000)
    return serializeList(businesses)


async def get_featured_businesses() -> list:
    """Get featured businesses."""
    businesses = await database.db.businesses.find({"featured": True}).to_list(1000)
    return serializeList(businesses)


async def get_business_by_id(business_id: str) -> dict:
    """Get a single business by ID."""
    try:
        business = await database.db.businesses.find_one(
            {"_id": ObjectId(business_id)}
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid business id"
        )

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    return serializeDict(business)


async def update_business(business_id: str, data: dict, current_user: dict) -> dict:
    """Update business information."""
    try:
        business = await database.db.businesses.find_one(
            {"_id": ObjectId(business_id)}
        )
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid business id"
        )

    if not business:
        raise HTTPException(
            status_code=404,
            detail="Business not found"
        )

    if business.get("userId") != str(current_user["_id"]):
        raise HTTPException(
            status_code=403,
            detail="Not authorized"
        )

    data["updatedAt"] = datetime.utcnow().isoformat()

    await database.db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {"$set": data}
    )

    return {"message": "Business updated successfully"}


async def get_user_businesses(current_user: dict) -> list:
    """Get all businesses owned by the logged-in user."""

    businesses = await database.db.businesses.find(
        {
            "userId": str(current_user["_id"])
        }
    ).sort(
        "createdAt",
        -1
    ).to_list(None)

    return [serializeDict(b) for b in businesses]


async def search_businesses(
    query: str = "",
    city: str = "",
    pincode: str = "",
    categoryId: str = "",
    subcategoryId: str = "",
    brand: str = "",
    page: int = 1,
    limit: int = 6
) -> dict:
    """Search businesses with multiple filters."""
    filter_query = {"status": "APPROVED"}

    if query:
        filter_query["$or"] = [
            {"businessName": {"$regex": query, "$options": "i"}},
            {"description": {"$regex": query, "$options": "i"}},
            {"categoryName": {"$regex": query, "$options": "i"}},
            {"subcategoryName": {"$regex": query, "$options": "i"}},
            {"city": {"$regex": query, "$options": "i"}},
            {"state": {"$regex": query, "$options": "i"}}
        ] 

    if city:
        filter_query["city"] = {"$regex": city, "$options": "i"}

    if categoryId:
        filter_query["categoryId"] = categoryId

    if subcategoryId:
        filter_query["subcategoryId"] = subcategoryId

    if brand:
        filter_query["brands"] = brand

    skip = (page - 1) * limit
    total = await database.db.businesses.count_documents(filter_query)

    businesses = await database.db.businesses.find(filter_query).skip(skip).limit(limit).to_list(length=limit)

    return {
        "data": serializeList(businesses),
        "page": page,
        "limit": limit,
        "total": total,
        "totalPages": (total + limit - 1) // limit
    }
