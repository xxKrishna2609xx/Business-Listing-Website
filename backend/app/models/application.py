from pydantic import BaseModel, EmailStr
from typing import Optional, List


class ApplicationCreate(BaseModel):
    businessName: str
    ownerName: str
    email: EmailStr
    phone: str
    categoryId: str
    subcategoryId: Optional[str] = ""
    address: str
    city: str
    state: str
    website: Optional[str] = ""
    description: str
    services: Optional[List[str]] = []


class ApplicationResponse(BaseModel):
    id: str
    businessName: str
    ownerName: str
    email: str
    phone: str
    categoryId: str
    subcategoryId: Optional[str] = ""
    address: str
    city: str
    state: str
    website: Optional[str] = ""
    description: str
    services: List[str] = []
    status: str
    createdAt: str


class ApplicationUpdate(BaseModel):
    status: str  # "APPROVED" or "REJECTED"
