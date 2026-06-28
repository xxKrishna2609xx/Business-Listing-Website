from pydantic import BaseModel

class ReviewCreate(BaseModel):
    businessId: str
    rating: float
    comment: str