from fastapi import APIRouter
from app.api.v1.endpoints import health, analyze, history

api_router = APIRouter()
api_router.include_router(health.router, tags=["System Health"])
api_router.include_router(analyze.router, prefix="/analyze", tags=["Scam Analysis"])
api_router.include_router(history.router, prefix="/history", tags=["Analysis History"])
