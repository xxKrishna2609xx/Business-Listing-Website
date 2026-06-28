from datetime import datetime

import app.core.database as database
from app.utils.serializer import serializeList


async def submit_business_application(application_data, current_user: dict) -> dict:
    """Submit a business listing application."""
    result = await database.db.applications.insert_one({
        **application_data.dict(),
        "userId": str(current_user["_id"]),
        "ownerName": current_user["name"],
        "ownerEmail": current_user["email"],
        "status": "PENDING",
        "createdAt": datetime.utcnow().isoformat()
    })

    return {
        "success": True,
        "applicationId": str(result.inserted_id)
    }


async def get_user_applications(current_user: dict) -> list:
    """Get applications of the logged-in user."""

    applications = await database.db.applications.find(
        {
            "userId": str(current_user["_id"]),
            "status": {
                "$in": ["PENDING", "REJECTED"]
            }
        }
    ).to_list(1000)

    return serializeList(applications)
