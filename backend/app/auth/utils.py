import bcrypt
from datetime import datetime, timedelta
from jose import jwt, JWTError
from ..config import settings


# ──────────────────────────────────────────────
# Password hashing helpers (raw bcrypt, no passlib)
# ──────────────────────────────────────────────

def hash_password(plain: str) -> str:
    """Return a bcrypt hash of the plain-text password."""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(plain.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    """Compare a plain password against a stored bcrypt hash."""
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))


# ──────────────────────────────────────────────
# JWT helpers
# ──────────────────────────────────────────────

ALGORITHM = "HS256"


def create_access_token(data: dict) -> str:
    """Create a signed JWT containing `data` and an expiry timestamp."""
    payload = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
    payload.update({"exp": expire})
    return jwt.encode(payload, settings.JWT_SECRET, algorithm=ALGORITHM)


def decode_token(token: str) -> dict | None:
    """
    Decode and verify a JWT.
    Returns the payload dict on success, or None if the token is invalid/expired.
    """
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[ALGORITHM])
    except JWTError:
        return None
