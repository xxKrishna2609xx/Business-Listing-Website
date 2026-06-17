from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from datetime import datetime
from typing import List

from ..database import get_db
from ..auth.dependencies import get_admin_user

router = APIRouter(prefix="/categories", tags=["Categories"])


class CategoryCreate(BaseModel):
    name: str
    icon: str
    color: str


class SubcategoryCreate(BaseModel):
    name: str
    categoryId: str


def _fmt(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id", ""))
    return d


@router.get("")
async def list_categories():
    db = get_db()
    cursor = db.categories.find({})
    docs = await cursor.to_list(length=200)
    return [_fmt(d) for d in docs]


@router.get("/subcategories/all")
async def list_all_subcategories():
    db = get_db()
    cursor = db.subcategories.find({})
    docs = await cursor.to_list(length=1000)
    return [_fmt(d) for d in docs]


@router.get("/{slug}/subcategories")
async def get_subcategories(slug: str):
    db = get_db()
    cat = await db.categories.find_one({"slug": slug})
    if not cat:
        return []

    cursor = db.subcategories.find({"categoryId": cat["_id"]})
    docs = await cursor.to_list(length=200)
    return [_fmt(d) for d in docs]


@router.post("", dependencies=[Depends(get_admin_user)])
async def create_category(data: CategoryCreate):
    db = get_db()
    slug = data.name.lower().strip().replace(" ", "-").replace("/", "-")
    existing = await db.categories.find_one({"slug": slug})
    if existing:
        raise HTTPException(status_code=400, detail="Category already exists.")
    
    cat_id = f"cat-{int(datetime.utcnow().timestamp())}"
    doc = {
        "_id": cat_id,
        "name": data.name,
        "icon": data.icon,
        "color": data.color,
        "slug": slug,
        "count": 0
    }
    await db.categories.insert_one(doc)
    return _fmt(doc)


@router.put("/{cat_id}", dependencies=[Depends(get_admin_user)])
async def update_category(cat_id: str, data: CategoryCreate):
    db = get_db()
    slug = data.name.lower().strip().replace(" ", "-").replace("/", "-")
    
    cat = await db.categories.find_one({"_id": cat_id})
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found.")
        
    update_data = {
        "name": data.name,
        "icon": data.icon,
        "color": data.color,
        "slug": slug
    }
    await db.categories.update_one({"_id": cat_id}, {"$set": update_data})
    
    updated = await db.categories.find_one({"_id": cat_id})
    return _fmt(updated)


@router.delete("/{cat_id}", dependencies=[Depends(get_admin_user)])
async def delete_category(cat_id: str):
    db = get_db()
    res = await db.categories.delete_one({"_id": cat_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found.")
    
    await db.subcategories.delete_many({"categoryId": cat_id})
    return {"message": "Category and all subcategories deleted successfully."}


@router.post("/subcategories/new", dependencies=[Depends(get_admin_user)])
async def create_subcategory(data: SubcategoryCreate):
    db = get_db()
    parent = await db.categories.find_one({"_id": data.categoryId})
    if not parent:
        raise HTTPException(status_code=404, detail="Parent category not found.")
        
    slug = data.name.lower().strip().replace(" ", "-").replace("/", "-")
    existing = await db.subcategories.find_one({"categoryId": data.categoryId, "slug": slug})
    if existing:
        raise HTTPException(status_code=400, detail="Subcategory already exists under this category.")
        
    sub_id = f"sub-{int(datetime.utcnow().timestamp())}"
    doc = {
        "_id": sub_id,
        "categoryId": data.categoryId,
        "name": data.name,
        "slug": slug
    }
    await db.subcategories.insert_one(doc)
    return _fmt(doc)


@router.delete("/subcategories/{sub_id}", dependencies=[Depends(get_admin_user)])
async def delete_subcategory(sub_id: str):
    db = get_db()
    res = await db.subcategories.delete_one({"_id": sub_id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Subcategory not found.")
    return {"message": "Subcategory deleted successfully."}
