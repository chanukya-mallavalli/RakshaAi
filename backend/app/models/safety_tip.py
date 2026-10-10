from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base

class SafetyTip(Base):
    __tablename__ = "safety_tips"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True)
    category = Column(String(100), nullable=False)
    title = Column(String(200), nullable=False)
    summary = Column(Text, nullable=False)
    what_it_looks_like = Column(Text, nullable=False)
    warning_signs_json = Column(Text, nullable=False)  # JSON array
    what_to_do_json = Column(Text, nullable=False)     # JSON array
    what_not_to_do_json = Column(Text, nullable=False) # JSON array
