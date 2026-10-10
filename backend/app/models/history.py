from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime, timezone
from app.core.database import Base


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), index=True)
    analysis_type = Column(String(50), nullable=False)   # message, link, screenshot, qr, call
    content_preview = Column(String(300), nullable=True)  # sanitized, truncated preview
    risk_level = Column(String(50), nullable=False)       # SAFE, SUSPICIOUS, DANGEROUS
    risk_score = Column(Integer, nullable=False)           # 0 - 100
    scam_type = Column(String(100), nullable=False)
    confidence = Column(Integer, default=50)
    summary = Column(Text, nullable=True)
    reasons = Column(Text, nullable=True)                  # newline-separated
    recommended_actions = Column(Text, nullable=True)      # newline-separated
    ai_provider = Column(String(100), nullable=True)
