from fastapi import APIRouter

from ..database import get_db

router = APIRouter(prefix="/categories", tags=["Categories"])


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


@router.get("/{slug}/subcategories")
async def get_subcategories(slug: str):
    db = get_db()
    cat = await db.categories.find_one({"slug": slug})
    if not cat:
        return []

    cursor = db.subcategories.find({"categoryId": cat["_id"]})
    docs = await cursor.to_list(length=200)
    return [_fmt(d) for d in docs]
