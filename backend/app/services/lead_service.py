from datetime import datetime
from bson import ObjectId

import app.core.database as database
from app.utils.serializer import serializeList


async def create_lead(lead_data, current_user: dict) -> dict:
    """Create a new lead from a user."""
    lead_data_dict = {
        **lead_data.dict(),
        "customerName": current_user["name"],
        "email": current_user["email"],
        "createdAt": datetime.utcnow().isoformat()
    }

    result = await database.db.leads.insert_one(lead_data_dict)

    return {
        "success": True,
        "leadId": str(result.inserted_id)
    }

 
async def get_all_leads() -> list:
    """Get all leads."""
    leads = await database.db.leads.find().to_list(1000)
    return serializeList(leads)


async def get_user_leads(current_user: dict):
    leads = await database.db.leads.find({
        "email": current_user["email"]
    }).to_list(1000)

    return serializeList(leads)

async def delete_lead(lead_id: str) -> dict:
    """Delete a lead."""
    await database.db.leads.delete_one(
        {"_id": ObjectId(lead_id)}
    )

    return {"success": True}
