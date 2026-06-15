from pydantic import BaseModel
from typing import Optional


class LeadCreate(BaseModel):
    businessId: str
    businessName: str
    customerName: str
    phone: str
    email: str
    serviceRequired: Optional[str] = "General Consultation"
    message: Optional[str] = ""


class LeadResponse(BaseModel):
    id: str
    businessId: str
    businessName: str
    customerName: str
    phone: str
    email: str
    serviceRequired: Optional[str] = ""
    message: Optional[str] = ""
    createdAt: str
