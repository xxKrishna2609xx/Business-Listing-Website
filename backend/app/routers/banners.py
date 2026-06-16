from fastapi import APIRouter
from ..database import get_db

router = APIRouter(prefix="/banners", tags=["Banners"])


def _fmt(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id", ""))
    return d


@router.get("")
async def list_banners():
    db = get_db()
    cursor = db.banners.find({})
    docs = await cursor.to_list(length=100)
    return [_fmt(d) for d in docs]
