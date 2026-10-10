"""
RakshaAI — Analysis Endpoints
Handles message, link, call, screenshot, and QR analysis.
"""
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.core.database import get_db
from app.schemas.analysis import (
    MessageAnalysisRequest, LinkAnalysisRequest, CallAnalysisRequest,
    AnalysisResult
)
from app.models.history import AnalysisHistory
from app.services.scam_detector import scam_engine

router = APIRouter()


def _save_to_history(db: Session, analysis_type: str, content_preview: str, result: AnalysisResult):
    """Persist analysis result to database."""
    try:
        record = AnalysisHistory(
            analysis_type=analysis_type,
            content_preview=content_preview[:300],
            risk_level=result.risk_level,
            risk_score=result.risk_score,
            scam_type=result.scam_type,
            summary=result.summary,
            reasons="\n".join(result.reasons),
            recommended_actions="\n".join(result.recommended_actions),
            ai_provider=result.provider_used or "RakshaAI Engine",
            created_at=datetime.now(timezone.utc),
        )
        db.add(record)
        db.commit()
    except Exception:
        db.rollback()  # Don't fail the request if history save fails


@router.post("/message", response_model=AnalysisResult)
async def analyze_message(
    request: MessageAnalysisRequest,
    db: Session = Depends(get_db),
):
    """Analyze an SMS, WhatsApp message, or email for scam patterns."""
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message content is required.")

    result = scam_engine.analyze_message(
        message=request.message,
        sender_info=request.sender_info,
        analysis_type="message"
    )

    _save_to_history(db, "message", request.message[:200], result)
    return result


@router.post("/link", response_model=AnalysisResult)
async def analyze_link(
    request: LinkAnalysisRequest,
    db: Session = Depends(get_db),
):
    """Analyze a URL/link for phishing and fraud indicators."""
    url = request.url.strip()
    if not url:
        raise HTTPException(status_code=400, detail="URL is required.")

    # Basic URL normalization
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    result = scam_engine.analyze_link(url)
    _save_to_history(db, "link", url[:200], result)
    return result


@router.post("/call", response_model=AnalysisResult)
async def analyze_call(
    request: CallAnalysisRequest,
    db: Session = Depends(get_db),
):
    """Analyze caller's remarks or transcript for scam tactics."""
    if not request.transcript or not request.transcript.strip():
        raise HTTPException(status_code=400, detail="Call transcript or remarks are required.")

    # Call analysis uses the same engine with call-specific context
    # Inject common call-scam context
    enriched_text = request.transcript
    if request.caller_number:
        enriched_text += f" [Caller: {request.caller_number}]"

    result = scam_engine.analyze_message(
        message=enriched_text,
        sender_info=request.caller_number,
        analysis_type="call"
    )

    # Override scam type context for calls
    if result.risk_level == "SAFE":
        result.summary = "The caller's description does not show obvious scam patterns, but always verify caller identity through official channels before sharing any information."

    _save_to_history(db, "call", request.transcript[:200], result)
    return result


@router.post("/screenshot", response_model=AnalysisResult)
async def analyze_screenshot(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Analyze a screenshot or photo for scam content (OCR + pattern matching)."""
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Please upload an image file (JPG, PNG, etc.)")

    # For now, return a placeholder response indicating the file was received
    # In production, this would use Tesseract OCR or Google Vision API
    file_size = 0
    try:
        content = await file.read()
        file_size = len(content)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read the uploaded file.")

    if file_size == 0:
        raise HTTPException(status_code=400, detail="The uploaded file appears to be empty.")

    # Placeholder analysis - in production would OCR the image
    result = AnalysisResult(
        risk_score=45,
        risk_level="SUSPICIOUS",
        scam_type="IMAGE REVIEW REQUIRED",
        confidence=40,
        summary=(
            "Your screenshot has been received for analysis. "
            "For complete protection, show this image to a trusted family member or contact RakshaAI support. "
            "In the meantime, do not act on anything shown in the screenshot until verified."
        ),
        reasons=[
            "📷 Screenshot analysis received — manual verification recommended for best accuracy.",
            "⚠️ If the screenshot shows urgent payment requests, OTP demands, or prize notifications — treat it as suspicious.",
        ],
        recommended_actions=[
            "Show this screenshot to a trusted family member before acting.",
            "If it references a bank or government, call that organization's official number.",
            "Do not scan any QR code or click any link shown in the screenshot.",
        ],
        things_to_avoid=[
            "Do not take the screenshot's instructions at face value without verification.",
            "Do not share your OTP or banking details based on what you see in the screenshot.",
        ],
        provider_used="RakshaAI Image Receiver v1"
    )

    _save_to_history(db, "screenshot", f"[Screenshot: {file.filename or 'image'}]", result)
    return result


@router.post("/qr", response_model=AnalysisResult)
async def analyze_qr(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Analyze a QR code image for payment fraud."""
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Please upload an image file containing the QR code.")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty.")

    # Placeholder QR analysis
    result = AnalysisResult(
        risk_score=35,
        risk_level="SUSPICIOUS",
        scam_type="QR CODE — VERIFY BEFORE SCANNING",
        confidence=45,
        summary=(
            "QR code image received. Always verify a QR code's destination before scanning, "
            "especially for payments. Never scan QR codes sent by strangers, even if they claim it's for a delivery."
        ),
        reasons=[
            "📱 QR codes can redirect to fraudulent payment pages.",
            "⚠️ Scammers often use QR codes to initiate unauthorized UPI payments.",
        ],
        recommended_actions=[
            "Only scan QR codes from official physical locations (shop counters, official government offices).",
            "Never scan a QR code sent via WhatsApp, SMS, or email from an unknown person.",
            "If you receive a QR code for 'collecting' a prize or refund — it's a scam (receiving money never requires scanning).",
        ],
        things_to_avoid=[
            "Do not scan QR codes from strangers — scanning can initiate payments FROM your account.",
            "Do not trust anyone who claims you must scan a QR code to 'receive' money.",
        ],
        provider_used="RakshaAI QR Engine v1"
    )

    _save_to_history(db, "qr", f"[QR Code: {file.filename or 'qr_image'}]", result)
    return result
