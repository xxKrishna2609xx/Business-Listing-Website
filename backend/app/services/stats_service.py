
import app.core.database as database
from app.utils.serializer import serializeDict


async def get_banners() -> list:
    """Get all banners."""
    docs = await database.db.banners.find({}).to_list(length=100)
    return [serializeDict(d) for d in docs]


async def get_quick_services() -> list:
    """Get all quick services."""
    docs = await database.db.quick_services.find({}).to_list(length=100)
    return [serializeDict(d) for d in docs]


async def get_public_stats() -> dict:
    """Get public platform statistics."""
    listings_count = await database.db.businesses.count_documents(
        {"status": "APPROVED"}
    )

    verified_count = await database.db.businesses.count_documents(
        {
            "status": "APPROVED",
            "verified": True
        }
    )

    categories_count = await database.db.categories.count_documents({})

    pipeline = [
        {
            "$match": {
                "status": "APPROVED",
                "rating": {"$exists": True}
            }
        },
        {
            "$group": {
                "_id": None,
                "avgRating": {"$avg": "$rating"}
            }
        }
    ]

    cursor = database.db.businesses.aggregate(pipeline)
    avg_rating_doc = await cursor.to_list(length=1)

    if avg_rating_doc and avg_rating_doc[0].get("avgRating") is not None:
        avg_rating = round(avg_rating_doc[0]["avgRating"], 1)
    else:
        avg_rating = 4.8

    return {
        "listingsCount": listings_count,
        "verifiedCount": f"{verified_count} +",
        "categoriesCount": f"{categories_count} +",
        "avgRating": f"{avg_rating}★",
        "monthlyUsers": "10K+",
    }
