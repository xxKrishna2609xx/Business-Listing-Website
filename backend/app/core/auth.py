import traceback

from bson import ObjectId
from jose import jwt, JWTError
from datetime import datetime, timedelta

from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.core.config import settings
import app.core.database as database

import logging

logger = logging.getLogger("app.core.auth")

security = HTTPBearer()

# get user via tokens-----
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(
        security
    )
):

    try:

        token = credentials.credentials

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload["user_id"]

        user = await database.db.users.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            logger.warning(f"User not found for token user_id: {user_id}")
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        return user

    except HTTPException:
        raise
    except JWTError as exc:
        logger.warning(f"JWT decode error: {exc}")
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )
    except Exception as exc:
        logger.error(f"Authentication error: {exc}", exc_info=True)
        raise

# Admin Middleware---------*-------------------
async def get_admin_user(
    current_user=Depends(
        get_current_user
    )
):

    if (
        current_user.get("role")
        != "admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )

    return current_user


def create_access_token(user):

    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user.get("role", "user"),
        "exp": datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    }

    return jwt.encode(
        payload,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


def create_refresh_token(user):

    payload = {
        "user_id": str(user["_id"]),
        "exp": datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    }

    return jwt.encode(
        payload,
        settings.REFRESH_SECRET_KEY,
        algorithm=settings.ALGORITHM
    )


async def refresh_access_token(body, db):

    try:

        payload = jwt.decode(
            body.refresh_token,
            settings.REFRESH_SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = payload["user_id"]

        user = await db.users.find_one(
            {
                "_id": ObjectId(user_id)
            }
        )

        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )

        if (
            user.get("refreshToken")
            != body.refresh_token
        ):
            raise HTTPException(
                status_code=401,
                detail="Invalid refresh token"
            )

        new_access_token = (
            create_access_token(user)
        )

        return {
            "access_token":
                new_access_token
        }

    except jwt.ExpiredSignatureError:

        raise HTTPException(
            status_code=401,
            detail="Refresh token expired"
        )

    except Exception:

        raise HTTPException(
            status_code=401,
            detail="Invalid refresh token"
        )
