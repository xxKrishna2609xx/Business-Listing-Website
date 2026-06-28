"""
Request logging middleware.
Logs incoming requests and outgoing responses with request/response details.
"""
import time
import logging
from typing import Callable

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

logger = logging.getLogger("app.middleware")


class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Middleware to log HTTP requests and responses."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """Log request and response details."""
        # Get request info
        request_id = request.headers.get("X-Request-ID", "unknown")
        method = request.method
        path = request.url.path
        client_host = request.client.host if request.client else "unknown"

        # Log incoming request
        logger.info(
            f"Incoming request",
            extra={
                "request_id": request_id,
                "method": method,
                "path": path,
                "client": client_host,
                "query_params": str(request.query_params)
            }
        )

        # Record start time
        start_time = time.time()

        try:
            # Process request
            response = await call_next(request)
            
            # Calculate response time
            process_time = time.time() - start_time
            
            # Log response
            logger.info(
                f"Request completed",
                extra={
                    "request_id": request_id,
                    "method": method,
                    "path": path,
                    "status_code": response.status_code,
                    "process_time": f"{process_time:.3f}s",
                    "client": client_host
                }
            )
            
            return response

        except Exception as exc:
            # Calculate error time
            process_time = time.time() - start_time
            
            # Log error
            logger.error(
                f"Request failed with exception",
                extra={
                    "request_id": request_id,
                    "method": method,
                    "path": path,
                    "process_time": f"{process_time:.3f}s",
                    "client": client_host,
                    "error": str(exc)
                },
                exc_info=True
            )
            
            raise
