import app.core.database as database
from app.utils.serializer import serializeList


async def add_bookmark(bookmark_data, current_user: dict) -> dict:
    """Add a bookmark for a user."""
    existing = await database.db.bookmarks.find_one({
        "userId": str(current_user["_id"]),
        "businessId": bookmark_data.businessId
    })

    if existing:
        return {"success": True}

    await database.db.bookmarks.insert_one({
        "userId": str(current_user["_id"]),
        "businessId": bookmark_data.businessId
    })

    return {"success": True}


async def get_user_bookmarks(user_id: str) -> list:
    """Get all bookmarks for a user."""
    bookmarks = await database.db.bookmarks.find({
        "userId": user_id
    }).to_list(1000)

    return serializeList(bookmarks)


async def remove_bookmark(user_id: str, business_id: str) -> dict:
    """Remove a bookmark."""
    await database.db.bookmarks.delete_one({
        "userId": user_id,
        "businessId": business_id
    })

    return {"success": True}
