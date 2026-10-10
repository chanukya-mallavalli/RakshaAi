import re
from typing import Dict, Any

# Common regex patterns to detect and redact sensitive credentials before any logging or storage
SENSITIVE_PATTERNS = [
    (r'\b(?:\d[ -]*?){13,16}\b', '[REDACTED_CARD_NUMBER]'),
    (r'\b\d{3,4}\b(?=\s*(?:cvv|cvc|security code))\b', '[REDACTED_CVV]'),
    (r'(?i)\b(?:otp|one[- ]time[- ]password|pin|code)\s*(?:is|:)?\s*([0-9]{4,8})\b', r'OTP [REDACTED_CREDENTIAL]'),
    (r'(?i)\b(?:password|passwd|pwd)\s*[:=]\s*\S+', 'password: [REDACTED_PASSWORD]'),
]

def sanitize_user_input(text: str) -> str:
    """
    Strips potential real credit cards, CVVs, and raw OTP codes from saved logs/previews
    to protect user privacy.
    """
    if not text:
        return ""
    sanitized = text
    for pattern, replacement in SENSITIVE_PATTERNS:
        sanitized = re.sub(pattern, replacement, sanitized, flags=re.IGNORECASE)
    return sanitized.strip()
