"""
Configuration management for FastAPI application.
Centralized environment variable management.
"""
import os
from functools import lru_cache
from typing import Optional
from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings and configuration."""

    # Application
    APP_NAME: str = "Business Listing API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = os.getenv("DEBUG", "false").lower() == "true"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")

    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", 8000))

    # Database
    MONGO_URI: str = os.getenv("MONGO_URI")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "nearlly_db")

    # JWT
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    REFRESH_SECRET_KEY: str = os.getenv("REFRESH_SECRET_KEY")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
    REFRESH_TOKEN_EXPIRE_DAYS: int = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

    # Cloudflare R2
    R2_ACCOUNT_ID: str = os.getenv("R2_ACCOUNT_ID")
    R2_ACCESS_KEY_ID: str = os.getenv("R2_ACCESS_KEY_ID")
    R2_SECRET_ACCESS_KEY: str = os.getenv("R2_SECRET_ACCESS_KEY")
    R2_BUCKET_NAME: str = os.getenv("R2_BUCKET_NAME")
    R2_PUBLIC_URL: str = os.getenv("R2_PUBLIC_URL")

    # Redis
    REDIS_URL: Optional[str] = os.getenv("REDIS_URL")

    # =========================
    # Rate Limiting
    # =========================

    USE_RATE_LIMITING: bool = (
        os.getenv("USE_RATE_LIMITING", "true").lower() == "true"
    )

    DEFAULT_RATE_LIMIT: str = os.getenv(
        "DEFAULT_RATE_LIMIT",
        "100/minute"
    )

    AUTH_RATE_LIMIT: str = os.getenv(
        "AUTH_RATE_LIMIT",
        "5/minute"
    )

    SEARCH_RATE_LIMIT: str = os.getenv(
        "SEARCH_RATE_LIMIT",
        "60/minute"
    )

    UPLOAD_RATE_LIMIT: str = os.getenv(
        "UPLOAD_RATE_LIMIT",
        "10/minute"
    )

    REVIEW_RATE_LIMIT: str = os.getenv(
        "REVIEW_RATE_LIMIT",
        "5/hour"
    )

    LEAD_RATE_LIMIT: str = os.getenv(
        "LEAD_RATE_LIMIT",
        "10/hour"
    )

    ADMIN_RATE_LIMIT: str = os.getenv(
        "ADMIN_RATE_LIMIT",
        "30/minute"
    )

    # CORS
    CORS_ORIGINS: list = os.getenv("CORS_ORIGINS", "*").split(",") if os.getenv("CORS_ORIGINS") else ["*"]
    CORS_CREDENTIALS: bool = os.getenv("CORS_CREDENTIALS", "true").lower() == "true"
    CORS_METHODS: list = os.getenv("CORS_METHODS", "*").split(",") if os.getenv("CORS_METHODS") else ["*"]
    CORS_HEADERS: list = os.getenv("CORS_HEADERS", "*").split(",") if os.getenv("CORS_HEADERS") else ["*"]

    # Trusted Hosts
    TRUSTED_HOSTS: list = os.getenv("TRUSTED_HOSTS", "localhost,127.0.0.1").split(",")

    # Logging
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    LOG_DIR: str = os.getenv("LOG_DIR", "app/logs")
    LOG_FILE: str = os.getenv("LOG_FILE", "app.log")
    LOG_MAX_BYTES: int = int(os.getenv("LOG_MAX_BYTES", 10485760))  # 10MB
    LOG_BACKUP_COUNT: int = int(os.getenv("LOG_BACKUP_COUNT", 5))

    # Security
    SECURE_HSTS_SECONDS: int = int(os.getenv("SECURE_HSTS_SECONDS", 31536000))  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS: bool = os.getenv("SECURE_HSTS_INCLUDE_SUBDOMAINS", "true").lower() == "true"
    SECURE_HSTS_PRELOAD: bool = os.getenv("SECURE_HSTS_PRELOAD", "true").lower() == "true"
    # =========================
    # Upload
    # =========================

    MAX_UPLOAD_SIZE = int(
        os.getenv(
            "MAX_UPLOAD_SIZE",
            5 * 1024 * 1024
        )
    )

    ALLOWED_IMAGE_TYPES = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ]
        # =========================
    # Search
    # =========================

    MAX_SEARCH_QUERY_LENGTH = int(
        os.getenv(
            "MAX_SEARCH_QUERY_LENGTH",
            100
        )
    )
    # =========================
    # Password
    # =========================

    MIN_PASSWORD_LENGTH = int(
        os.getenv(
            "MIN_PASSWORD_LENGTH",
            8
        )
    )

    MAX_PASSWORD_LENGTH = int(
        os.getenv(
            "MAX_PASSWORD_LENGTH",
            128
        )
    )
    # Pagination
    DEFAULT_PAGE_SIZE: int = int(os.getenv("DEFAULT_PAGE_SIZE", 10))
    MAX_PAGE_SIZE: int = int(os.getenv("MAX_PAGE_SIZE", 100))

    def __init__(self):
        """Validate required settings."""
        required_fields = [
            "MONGO_URI",
            "SECRET_KEY",
            "REFRESH_SECRET_KEY",
            "R2_ACCOUNT_ID",
            "R2_ACCESS_KEY_ID",
            "R2_SECRET_ACCESS_KEY",
            "R2_BUCKET_NAME",
            "R2_PUBLIC_URL",
        ]

        missing = [field for field in required_fields if not getattr(self, field)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")


    @property
    def IS_DEV(self):
        return self.ENVIRONMENT.lower() == "development"

    @property
    def IS_PROD(self):
        return self.ENVIRONMENT.lower() == "production"
    
@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Export settings instance
settings = get_settings()
