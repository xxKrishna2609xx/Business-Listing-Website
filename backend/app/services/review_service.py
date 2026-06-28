from datetime import datetime
from bson import ObjectId

import app.core.database as database
from app.utils.serializer import serializeList


def calculate_rating(reviews: list) -> tuple:
    """Calculate average rating and review count."""
    review_count = len(reviews)

    if review_count == 0:
        return 0, 0

    rating_avg = round(
        sum(r["rating"] for r in reviews) / review_count,
        1
    )

    return rating_avg, review_count


async def update_business_rating(business_id: str) -> None:
    """Update business rating based on all its reviews."""
    reviews = await database.db.reviews.find({
        "businessId": business_id
    }).to_list(1000)

    rating_avg, review_count = calculate_rating(reviews)

    query_filter = {}
    try:
        query_filter = {"_id": ObjectId(business_id)}
    except Exception:
        query_filter = {"_id": business_id}

    await database.db.businesses.update_one(
        query_filter,
        {
            "$set": {
                "rating": rating_avg,
                "reviewCount": review_count
            }
        }
    )


async def create_or_update_review(review_data, current_user: dict) -> dict:
    """Create a new review or update existing one."""
    existing_review = await database.db.reviews.find_one({
        "businessId": review_data.businessId,
        "userId": str(current_user["_id"])
    })

    if existing_review:
        await database.db.reviews.update_one(
            {"_id": existing_review["_id"]},
            {
                "$set": {
                    "rating": review_data.rating,
                    "comment": review_data.comment,
                    "updatedAt": datetime.utcnow().isoformat()
                }
            }
        )

        await update_business_rating(review_data.businessId)

        return {
            "success": True,
            "message": "Review updated successfully"
        }

    result = await database.db.reviews.insert_one({
        **review_data.dict(),
        "userId": str(current_user["_id"]),
        "createdAt": datetime.utcnow().isoformat()
    })

    await update_business_rating(review_data.businessId)

    return {
        "success": True,
        "reviewId": str(result.inserted_id),
        "message": "Review submitted successfully"
    }


async def get_reviews_with_user_names(business_id: str) -> list:
    """Get reviews for a business with customer names."""
    reviews = await database.db.reviews.find({
        "businessId": business_id
    }).to_list(1000)

    user_ids = [
        ObjectId(r["userId"])
        for r in reviews
        if r.get("userId")
    ]

    users = await database.db.users.find(
        {"_id": {"$in": user_ids}},
        {"name": 1}
    ).to_list(None)

    user_map = {
        str(user["_id"]): user["name"]
        for user in users
    }

    for review in reviews:
        review["customerName"] = user_map.get(
            review["userId"],
            "Unknown User"
        )

    return serializeList(reviews)
