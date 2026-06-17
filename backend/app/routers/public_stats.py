from fastapi import APIRouter
from ..database import get_db

router = APIRouter(prefix="/public-stats", tags=["Public Stats"])


@router.get("")
async def get_public_stats():
    db = get_db()
    
    # Calculate real-time counts from MongoDB
    listings_count = await db.businesses.count_documents({"status": "APPROVED"})
    verified_count = await db.businesses.count_documents({"status": "APPROVED", "verified": True})
    categories_count = await db.categories.count_documents({})
    
    # Calculate average rating
    pipeline = [
        {"$match": {"status": "APPROVED", "rating": {"$exists": True}}},
        {"$group": {"_id": None, "avgRating": {"$avg": "$rating"}}}
    ]
    cursor = db.businesses.aggregate(pipeline)
    avg_rating_doc = await cursor.to_list(length=1)
    
    if avg_rating_doc and avg_rating_doc[0].get("avgRating") is not None:
        avg_rating = round(avg_rating_doc[0]["avgRating"], 1)
    else:
        avg_rating = 4.8  # Fallback standard rating
        
    return {
        "listingsCount": listings_count,
        "verifiedCount": verified_count,
        "categoriesCount": categories_count,
        "avgRating": f"{avg_rating}★",
        "monthlyUsers": "10K+",  # Static estimate
    }
