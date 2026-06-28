from datetime import datetime
from bson import ObjectId
from fastapi import HTTPException
from passlib.context import CryptContext

import app.core.database as database
from app.core.auth import (
    create_access_token,
    create_refresh_token,
    refresh_access_token
)

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],
    deprecated="auto"
)


async def register_user(user_data) -> dict:
    """Register a new user with email and password."""
    existing = await database.db.users.find_one(
        {"email": user_data.email}
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    hashed_password = pwd_context.hash(user_data.password)

    result = await database.db.users.insert_one({
        "name": user_data.name,
        "email": user_data.email,
        "phone": user_data.phone,
        "password": hashed_password,
        "role": "user",
        "createdAt": datetime.utcnow().isoformat()
    })

    return {
        "success": True,
        "userId": str(result.inserted_id)
    }


async def login_user(user_data) -> dict:
    """Authenticate user and return access/refresh tokens."""
    db_user = await database.db.users.find_one(
        {"email": user_data.email}
    )

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    if not pwd_context.verify(
        user_data.password,
        db_user["password"]
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials"
        )

    access_token = create_access_token(db_user)
    refresh_token = create_refresh_token(db_user)

    await database.db.users.update_one(
        {"_id": db_user["_id"]},
        {
            "$set": {
                "refreshToken": refresh_token
            }
        }
    )

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": str(db_user["_id"]),
            "name": db_user["name"],
            "email": db_user["email"],
            "phone": db_user.get("phone", ""),
            "role": db_user.get("role", "user"),
            "createdAt": db_user.get("createdAt")
        }
    }


async def refresh_token_service(body):
    """Refresh access token using refresh token."""
    return await refresh_access_token(body, database.db)
