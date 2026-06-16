from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import connect_db, close_db, get_db
from .routers import auth, businesses, categories, applications, leads, admin, banners, quick_services, public_stats


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Connect to MongoDB and seed initial data on startup; disconnect on shutdown."""
    await connect_db()

    # Auto-seed if collections are empty
    from .seed import seed_data
    await seed_data(get_db())

    yield  # Server is running

    await close_db()


app = FastAPI(
    title="Right Ads Digital API",
    description="Business Directory Backend API — FastAPI + MongoDB",
    version="1.0.0",
    lifespan=lifespan,
)

# ─────────────────────────────────────────────────────────
# CORS — allow the Vite dev server and local origins
# ─────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────────────────
# Mount all routers under /api/v1
# ─────────────────────────────────────────────────────────
PREFIX = "/api/v1"

app.include_router(auth.router,           prefix=PREFIX)
app.include_router(businesses.router,     prefix=PREFIX)
app.include_router(categories.router,     prefix=PREFIX)
app.include_router(applications.router,   prefix=PREFIX)
app.include_router(leads.router,          prefix=PREFIX)
app.include_router(admin.router,          prefix=PREFIX)
app.include_router(banners.router,        prefix=PREFIX)
app.include_router(quick_services.router, prefix=PREFIX)
app.include_router(public_stats.router,   prefix=PREFIX)


@app.get("/")
async def root():
    return {
        "status": "ok",
        "service": "Right Ads Digital API",
        "docs": "/docs",
        "version": "1.0.0",
    }
