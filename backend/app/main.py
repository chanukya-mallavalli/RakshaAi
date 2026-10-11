from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db
from app.api.v1.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize SQLite database tables
    init_db()
    yield
    # Shutdown logic if needed

app = FastAPI(
    title=f"{settings.APP_NAME} API",
    description=f"{settings.APP_TAGLINE} — AI-Powered Digital Safety Companion for Elders and Families.",
    version=settings.APP_VERSION,
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
    origin.strip()
    for origin in settings.CORS_ORIGINS.split(",")
    if origin.strip()
],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def root():
    return {
        "app": settings.APP_NAME,
        "tagline": settings.APP_TAGLINE,
        "version": settings.APP_VERSION,
        "status": "online",
        "documentation": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
