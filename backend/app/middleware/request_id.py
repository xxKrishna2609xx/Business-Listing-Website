"""
Request ID middleware.
Generates unique request IDs and attaches them to all requests and responses.
"""
import uuid
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


class RequestIDMiddleware(BaseHTTPMiddleware):
    """Middleware to attach unique request IDs to requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Generate request ID and attach to request and response."""
        # Get or generate request ID
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())

        # Attach to request state for use in handlers/services
        request.state.request_id = request_id

        # Process request
        response = await call_next(request)

        # Attach request ID to response header
        response.headers["X-Request-ID"] = request_id

        return response
