"""
History endpoints — retrieval of past analyses.
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.core.database import get_db
from app.models.history import AnalysisHistory
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

router = APIRouter()


class HistoryItemResponse(BaseModel):
    id: int
    created_at: datetime
    analysis_type: str
    content_preview: str
    risk_level: str
    risk_score: int
    scam_type: str
    summary: Optional[str] = None

    model_config = {"from_attributes": True}


@router.get("/", response_model=List[HistoryItemResponse])
def get_history(
    limit: int = Query(default=20, le=100),
    offset: int = Query(default=0, ge=0),
    db: Session = Depends(get_db),
):
    """Retrieve the last N analysis history records."""
    records = (
        db.query(AnalysisHistory)
        .order_by(desc(AnalysisHistory.created_at))
        .offset(offset)
        .limit(limit)
        .all()
    )
    return records


@router.delete("/{item_id}")
def delete_history_item(item_id: int, db: Session = Depends(get_db)):
    """Delete a specific history record."""
    record = db.query(AnalysisHistory).filter(AnalysisHistory.id == item_id).first()
    if not record:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Record not found.")
    db.delete(record)
    db.commit()
    return {"message": "Record deleted successfully."}


@router.delete("/")
def clear_all_history(db: Session = Depends(get_db)):
    """Clear all history records."""
    db.query(AnalysisHistory).delete()
    db.commit()
    return {"message": "All history cleared."}
