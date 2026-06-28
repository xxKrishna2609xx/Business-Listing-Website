"""
Global exception handlers for the application.
Centralizes error handling and response formatting.
"""
import logging
from typing import Union

from fastapi import FastAPI, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pymongo.errors import PyMongoError
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


async def http_exception_handler(request, exc: StarletteHTTPException):
    """Handle HTTP exceptions."""
    logger.warning(
        f"HTTP Exception: {exc.status_code} - {exc.detail}",
        extra={"path": request.url.path, "method": request.method}
    )
    
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )


async def validation_exception_handler(request, exc: RequestValidationError):
    """Handle Pydantic validation errors."""
    errors = []
    for error in exc.errors():
        error_detail = {
            "field": ".".join(str(x) for x in error["loc"][1:]),
            "message": error["msg"],
            "type": error["type"]
        }
        errors.append(error_detail)

    logger.warning(
        f"Validation Error: {len(errors)} validation errors",
        extra={"path": request.url.path, "errors": errors}
    )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": "Validation failed",
            "details": errors
        }
    )


async def pymongo_exception_handler(request, exc: PyMongoError):
    """Handle MongoDB exceptions."""
    logger.error(
        f"Database Error: {str(exc)}",
        extra={"path": request.url.path, "method": request.method},
        exc_info=True
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "Database operation failed",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
        }
    )


async def general_exception_handler(request, exc: Exception):
    """Handle all other exceptions."""
    logger.error(
        f"Unexpected Error: {str(exc)}",
        extra={"path": request.url.path, "method": request.method},
        exc_info=True
    )

    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": "An unexpected error occurred",
            "status_code": status.HTTP_500_INTERNAL_SERVER_ERROR
        }
    )


def setup_exception_handlers(app: FastAPI) -> None:
    """Register all exception handlers with the app."""
    app.add_exception_handler(StarletteHTTPException, http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(PyMongoError, pymongo_exception_handler)
    app.add_exception_handler(Exception, general_exception_handler)
