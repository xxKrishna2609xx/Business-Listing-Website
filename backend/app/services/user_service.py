from bson import ObjectId

import app.core.database as database
from app.utils.serializer import serializeList

from fastapi import HTTPException
from bson.errors import InvalidId

async def update_user_profile(user_id: str, profile_data, current_user) -> dict:
    """Update user profile information."""
    try:
        object_id = ObjectId(user_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid user id")
    
    if (str(current_user["_id"]) != user_id and current_user.get("role") != "admin"):
        raise HTTPException(
            status_code=403,
            detail="Forbidden"
        )
    await database.db.users.update_one(
        {"_id": object_id},
        {
            "$set": {
                "name": profile_data.name,
                "phone": profile_data.phone
            }
        }
    )

    updated_user = await database.db.users.find_one(
        {"_id": object_id}
    )
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")

    return {
        "id": str(updated_user["_id"]),
        "name": updated_user["name"],
        "email": updated_user["email"],
        "phone": updated_user.get("phone", "")
    }


async def get_user_business_leads(email: str) -> list:
    """Get all leads for businesses owned by a user."""
    businesses = await database.db.businesses.find(
        {"email": email}
    ).to_list(1000)

    business_ids = []
    business_names = []
    for b in businesses:
        if "id" in b and b["id"]:
            business_ids.append(b["id"])
        business_ids.append(str(b["_id"]))
        if "businessName" in b and b["businessName"]:
            business_names.append(b["businessName"])

    leads = await database.db.leads.find(
        {
            "$or": [
                {"businessId": {"$in": business_ids}},
                {"businessName": {"$in": business_names}}
            ]
        }
    ).to_list(1000)

    return serializeList(leads)


async def get_current_user_info(current_user: dict) -> dict:
    """Get current user information."""
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"],
        "role": current_user.get("role", "user")
    }


