from datetime import datetime
from bson import ObjectId

import app.core.database as database
from app.utils.serializer import serializeList


async def get_all_applications() -> list:
    """Get all applications for admin review."""
    applications = await database.db.applications.find().to_list(1000)
    return serializeList(applications)


async def approve_application(application_id: str) -> dict:
    """Approve a business application and create business listing."""
    application = await database.db.applications.find_one(
        {"_id": ObjectId(application_id)}
    )

    if not application:
        raise Exception("Application not found")

    await database.db.businesses.insert_one({
        "id": f"biz-{str(ObjectId())[:8]}",
        "businessName": application["businessName"],
        "ownerName": application["ownerName"],
        "userId": application["userId"], # added <---------------
        "email": application["email"],
        "phone": application["phone"],
        "categoryId": application["categoryId"],
        "subcategoryId": application["subcategoryId"],
        "categoryName": application["categoryName"],
        "subcategoryName": application["subcategoryName"],
        "address": application["address"],
        "city": application["city"], 
        "state": application["state"],
        "website": application.get("website", ""),
        "description": application.get("description", ""),
        "logoUrl": application.get("logoUrl", ""),
        "socialMediaLinks": application.get("socialMediaLinks", {}),
        "galleryImages": application.get("galleryImages", []),
        "services": application.get("services", []),
        "verified": False,
        "featured": False,
        "status": "APPROVED",
        "rating": 0,
        "reviewCount": 0,
        "createdAt": datetime.utcnow().isoformat()
    })

    await database.db.applications.delete_one(
        {"_id": ObjectId(application_id)}
    )

    return {"success": True}


async def reject_application(application_id: str, reason: str) -> dict:
    """Reject a business application."""
    await database.db.applications.update_one(
        {"_id": ObjectId(application_id)},
        {
            "$set": {
                "status": "REJECTED",
                "rejectReason": reason
            }
        }
    )
    return {"success": True}


async def delete_application(application_id: str) -> dict:
    """Delete an application."""
    result = await database.db.applications.delete_one(
        {"_id": ObjectId(application_id)}
    )

    if result.deleted_count == 0:
        raise Exception("Application not found")

    return {"success": True}


async def delete_business(business_id: str) -> dict:
    """Delete a business."""
    await database.db.businesses.delete_one(
        {"_id": ObjectId(business_id)}
    )

    return {"success": True}


async def toggle_business_verification(business_id: str) -> dict:
    """Toggle business verification status."""
    business = await database.db.businesses.find_one(
        {"_id": ObjectId(business_id)}
    )

    await database.db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {
            "$set": {
                "verified": not business.get("verified", False)
            }
        }
    )

    return {"success": True}


async def toggle_business_featured(business_id: str) -> dict:
    """Toggle business featured status."""
    business = await database.db.businesses.find_one(
        {"_id": ObjectId(business_id)}
    )

    await database.db.businesses.update_one(
        {"_id": ObjectId(business_id)},
        {
            "$set": {
                "featured": not business.get("featured", False)
            }
        }
    )

    return {"success": True}
