from bson import ObjectId

import app.core.database as database
from app.utils.serializer import serializeList


async def get_all_categories() -> list:
    """Get all categories."""
    categories = await database.db.categories.find().to_list(1000)
    return serializeList(categories)


async def get_all_subcategories() -> list:
    """Get all subcategories."""
    subcategories = await database.db.subcategories.find().to_list(1000)
    return serializeList(subcategories)


async def create_category(category_data) -> dict:
    """Create a new category."""
    data = category_data.dict(exclude_none=True)
    result = await database.db.categories.insert_one(data)
    return {
        "success": True,
        "id": str(result.inserted_id)
    }


async def delete_category(category_id: str) -> dict:
    """Delete a category and its associated subcategories."""
    category = None
    try:
        category = await database.db.categories.find_one({"_id": ObjectId(category_id)})
    except Exception:
        pass

    if not category:
        category = await database.db.categories.find_one({"id": category_id})

    if category:
        cat_custom_id = category.get("id")
        cat_oid = str(category.get("_id"))

        # Delete the category
        await database.db.categories.delete_one({"_id": category["_id"]})

        # Cascade delete subcategories linked to this category
        query = []
        if cat_custom_id:
            query.append({"categoryId": cat_custom_id})
        if cat_oid:
            query.append({"categoryId": cat_oid})

        if query:
            await database.db.subcategories.delete_many({"$or": query})

    return {"success": True}


async def create_subcategory(subcategory_data) -> dict:
    """Create a new subcategory."""
    data = subcategory_data.dict(exclude_none=True)
    result = await database.db.subcategories.insert_one(data)
    return {
        "success": True,
        "id": str(result.inserted_id)
    }


async def delete_subcategory(subcategory_id: str) -> dict:
    """Delete a subcategory."""
    result = await database.db.subcategories.delete_one({"id": subcategory_id})
    if result.deleted_count == 0:
        try:
            await database.db.subcategories.delete_one({"_id": ObjectId(subcategory_id)})
        except Exception:
            pass

    return {"success": True}


async def update_category(category_id: str, category_data) -> dict:
    """Update a category."""
    update_data = {
        "$set": {
            "name": category_data.name,
            "color": category_data.color
        }
    }
    result = await database.db.categories.update_one({"id": category_id}, update_data)
    if result.matched_count == 0:
        try:
            await database.db.categories.update_one({"_id": ObjectId(category_id)}, update_data)
        except Exception:
            pass

    return {"success": True}
