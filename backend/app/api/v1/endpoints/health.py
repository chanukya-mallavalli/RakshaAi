from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.config import settings
from app.core.database import get_db
from app.schemas.health import HealthResponse

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def get_health(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"
        
    return HealthResponse(
        status="healthy",
        app_name=settings.APP_NAME,
        tagline=settings.APP_TAGLINE,
        version=settings.APP_VERSION,
        environment=settings.APP_ENV,
        ai_provider=settings.AI_PROVIDER,
        database=db_status,
        details={
            "debug": settings.DEBUG,
            "security_mode": "privacy-first",
            "offline_rule_engine": "active"
        }
    )
