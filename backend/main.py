"""
FastAPI application initialization with production-ready infrastructure.
Includes middleware, exception handling, database connectivity, and logging.
"""
import logging
import uvicorn

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
import app.core.database as database
from app.core.redis import init_redis, close_redis
from app.exceptions import setup_exception_handlers
from app.middleware.request_id import RequestIDMiddleware
from app.middleware.logging import RequestLoggingMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from starlette.middleware.trustedhost import TrustedHostMiddleware
from app.middleware.logging_config import setup_logging
from app.middleware.rate_limit import setup_rate_limiting

from indexes import create_indexes
from app.routers import (
    stats_router,
    category_router,
    upload_router,
    review_router,
    auth_router,
    bookmark_router,
    lead_router,
    business_router,
    application_router,
    admin_router,
)

# Initialize logging system
setup_logging()
logger = logging.getLogger("main")

# Create FastAPI application
app = FastAPI(
    title="Business Listing API",
    description="Production-ready API with comprehensive infrastructure",
    version="1.0.0"
)

setup_rate_limiting(app)

# Register exception handlers
setup_exception_handlers(app)

# Add middleware stack in reverse order (first added = last executed)
# RequestID must be first to be available to other middleware
app.add_middleware(RequestIDMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.TRUSTED_HOSTS,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=settings.CORS_CREDENTIALS,
    allow_methods=settings.CORS_METHODS,
    allow_headers=["*"],
)
from app.routers.user import router as user_router

# Include routers

# Public routers
app.include_router(stats_router)
app.include_router(category_router)
app.include_router(upload_router)

# Authentication router
app.include_router(auth_router)

# User routers
app.include_router(bookmark_router)
app.include_router(review_router)
app.include_router(lead_router)
app.include_router(application_router)
app.include_router(user_router)

# Business router
app.include_router(business_router)

# Admin router
app.include_router(admin_router)


@app.on_event("startup")
async def startup_event():
    """
    Application startup event handler.
    Initializes database connection, Redis client, and indexes.
    """
    try:
        # Connect to MongoDB
        await database.connect_to_mongo()
        
        # Initialize Redis client
        await init_redis()
        
        # Create database indexes
        await create_indexes(database.db)
        
        logger.info(f"Application started in {settings.ENVIRONMENT} mode")
        logger.info(f"Server running on {settings.HOST}:{settings.PORT}")
        
    except Exception as exc:
        logger.error(f"Startup error: {exc}", exc_info=True)
        raise


@app.on_event("shutdown")
async def shutdown_event():
    """
    Application shutdown event handler.
    Closes database connection and Redis client.
    """
    try:
        logger.info("Shutting down application...")
        
        # Disconnect from MongoDB
        await database.disconnect_from_mongo()
        
        # Close Redis client
        await close_redis()
        
        logger.info("Application stopped")
        
    except Exception as exc:
        logger.error(f"Shutdown error: {exc}", exc_info=True)


@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    Returns application status and environment information.
    """
    return {
        "status": "healthy",
        "environment": settings.ENVIRONMENT,
        "version": "1.0.0"
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        log_config=None  # Use custom logging configuration
    )

