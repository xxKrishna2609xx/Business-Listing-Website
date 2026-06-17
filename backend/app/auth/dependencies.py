from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from .utils import decode_token
from ..database import get_db

security = HTTPBearer()


def _fmt_user(user: dict) -> dict:
    """Strip _id / password and return a clean user dict."""
    u = dict(user)
    u.pop("_id", None)
    u.pop("password", None)
    return u


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """
    FastAPI dependency — extracts the Bearer token, decodes it, and
    fetches the corresponding user from MongoDB.
    Raises 401 if the token is missing, invalid, or the user no longer exists.
    """
    token = credentials.credentials
    payload = decode_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    uid = payload.get("uid")
    db = get_db()
    user = await db.users.find_one({"uid": uid})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return _fmt_user(user)


async def get_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Extends get_current_user — additionally requires role == 'admin'."""
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required.",
        )
    return current_user
