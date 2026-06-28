"""
Security headers middleware.
Adds security headers to all responses.
"""
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.core.config import settings


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Middleware to add security headers to responses."""

    async def dispatch(self, request: Request, call_next) -> Response:
        """Add security headers to response."""
        response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking attacks
        response.headers["X-Frame-Options"] = "DENY"

        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Protect against XSS attacks
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Content Security Policy
        response.headers["Content-Security-Policy"] = "default-src 'self'"

        # HSTS header (only in production)
        if settings.ENVIRONMENT == "production":
            hsts_value = f"max-age={settings.SECURE_HSTS_SECONDS}"
            if settings.SECURE_HSTS_INCLUDE_SUBDOMAINS:
                hsts_value += "; includeSubDomains"
            if settings.SECURE_HSTS_PRELOAD:
                hsts_value += "; preload"
            response.headers["Strict-Transport-Security"] = hsts_value

        return response
