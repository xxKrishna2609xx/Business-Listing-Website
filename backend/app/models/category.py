from typing import Optional
from pydantic import BaseModel

class CategoryCreate(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    color: str

class SubcategoryCreate(BaseModel):
    id: Optional[str] = None
    name: str
    slug: str
    categoryId: str

class CategoryUpdate(BaseModel):
    name: str
    color: str