from fastapi import APIRouter
from ..database import get_db

router = APIRouter(prefix="/quick-services", tags=["Quick Services"])


def _fmt(doc: dict) -> dict:
    d = dict(doc)
    d["id"] = str(d.pop("_id", ""))
    return d


@router.get("")
async def list_quick_services():
    db = get_db()
    cursor = db.quick_services.find({})
    docs = await cursor.to_list(length=100)
    return [_fmt(d) for d in docs]
