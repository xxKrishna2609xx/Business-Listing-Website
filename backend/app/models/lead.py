from pydantic import BaseModel

class LeadCreate(BaseModel):
    businessId: str
    businessName: str
    customerName: str
    phone: str
    email: str = ""
    serviceRequired: str = ""
    message: str = ""