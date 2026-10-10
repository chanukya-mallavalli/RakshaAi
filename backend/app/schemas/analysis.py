from pydantic import BaseModel, Field
from typing import List, Optional


class AnalysisResult(BaseModel):
    risk_score: int = Field(..., ge=0, le=100, description="RakshaAI Risk Score (0-100)")
    risk_level: str = Field(..., description="SAFE, SUSPICIOUS, DANGEROUS, or UNABLE TO VERIFY")
    scam_type: str = Field(..., description="Identified scam category or Genuine Communication")
    confidence: int = Field(..., ge=0, le=100, description="Confidence percentage (0-100)")
    summary: str = Field(..., description="Elderly-friendly plain explanation")
    reasons: List[str] = Field(default_factory=list, description="Specific red flags or safety indicators identified")
    recommended_actions: List[str] = Field(default_factory=list, description="Clear, immediate steps the user should take")
    things_to_avoid: List[str] = Field(default_factory=list, description="High-risk actions to refrain from")

    # Optional metadata
    extracted_text: Optional[str] = None
    analyzed_target: Optional[str] = None
    provider_used: Optional[str] = None


class MessageAnalysisRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Message text (SMS, WhatsApp, email, chat)")
    sender_info: Optional[str] = Field(None, description="Optional phone number, sender name or email")


class LinkAnalysisRequest(BaseModel):
    url: str = Field(..., min_length=3, description="Web address or URL to verify")


class CallAnalysisRequest(BaseModel):
    transcript: str = Field(..., min_length=1, description="Transcript of the call or caller remarks")
    caller_number: Optional[str] = Field(None, description="Caller's phone number if known")
    caller_claimed_identity: Optional[str] = Field(None, description="Who the caller claimed to be")
