from pydantic import BaseModel
from typing import Optional, List, Dict, Any


class BusinessResponse(BaseModel):
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
    logoUrl: Optional[str] = ""
    galleryImages: List[str] = []
    verified: bool = False
    featured: bool = False
    status: str = "APPROVED"
    categoryName: Optional[str] = ""
    subcategoryName: Optional[str] = ""
    rating: float = 0.0
    reviewCount: int = 0
    socialMediaLinks: Dict[str, Any] = {}
    services: List[str] = []
    brands: List[str] = []
    createdAt: str


class BusinessUpdate(BaseModel):
    featured: Optional[bool] = None
    verified: Optional[bool] = None
    status: Optional[str] = None
    businessName: Optional[str] = None
