from pydantic import BaseModel

class BusinessApplication(BaseModel):
    ownerName: str
    email: str
    phone: str

    businessName: str

    categoryId: str
    subcategoryId: str

    categoryName: str
    subcategoryName: str

    address: str
    city: str
    state: str

    website: str = ""
    description: str = ""

    logoUrl: str = ""

    socialMediaLinks: dict = {}

    galleryImages: list = []

    services: list = []