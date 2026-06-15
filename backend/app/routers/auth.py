import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status

from ..models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from ..auth.utils import hash_password, verify_password, create_access_token
from ..auth.dependencies import get_current_user
from ..database import get_db

router = APIRouter(prefix="/auth", tags=["Authentication"])


def _safe_user(doc: dict) -> dict:
    """Return user dict without sensitive fields."""
    u = dict(doc)
    u.pop("_id", None)
    u.pop("password", None)
    return u


@router.post("/signup", response_model=TokenResponse, status_code=201)
async def signup(data: UserCreate):
    db = get_db()

    # Check duplicate email or phone
    exists = await db.users.find_one(
        {"$or": [{"email": data.email}, {"phone": data.phone}]}
    )
    if exists:
        raise HTTPException(
            status_code=400,
            detail="An account with this email or phone number already exists.",
        )

    uid = "usr-" + uuid.uuid4().hex[:8]
    user_doc = {
        "_id": uid,
        "uid": uid,
        "name": data.name,
        "email": data.email,
        "phone": data.phone,
        "password": hash_password(data.password),
        "role": "user",
        "bookmarks": [],
        "createdAt": datetime.utcnow().isoformat() + "Z",
    }

    await db.users.insert_one(user_doc)

    token = create_access_token({"uid": uid, "role": "user"})
    return {"access_token": token, "token_type": "bearer", "user": _safe_user(user_doc)}


@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin):
    db = get_db()

    user = await db.users.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=401, detail="No account found with this email.")

    if not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Incorrect password.")

    token = create_access_token({"uid": user["uid"], "role": user["role"]})
    return {"access_token": token, "token_type": "bearer", "user": _safe_user(user)}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user


@router.patch("/me/bookmarks/{business_id}")
async def toggle_bookmark(
    business_id: str, current_user: dict = Depends(get_current_user)
):
    db = get_db()
    uid = current_user["uid"]
    bookmarks: list = current_user.get("bookmarks", [])

    if business_id in bookmarks:
        bookmarks.remove(business_id)
    else:
        bookmarks.append(business_id)

    await db.users.update_one({"uid": uid}, {"$set": {"bookmarks": bookmarks}})
    return {"bookmarks": bookmarks}
