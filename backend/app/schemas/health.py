from pydantic import BaseModel
from typing import Dict, Any

class HealthResponse(BaseModel):
    status: str
    app_name: str
    tagline: str
    version: str
    environment: str
    ai_provider: str
    database: str
    details: Dict[str, Any] = {}
