"""
RakshaAI Scam Detector — Rule-Based + AI Analysis Engine
Provides instant scam detection for messages, links, and calls.
"""
import re
import math
from typing import Optional
from app.schemas.analysis import AnalysisResult


# ─────────────────────────────────────────────
# Scam Pattern Database
# ─────────────────────────────────────────────

URGENT_PHRASES = [
    r'\burgent\b', r'\bimmediately\b', r'\btoday only\b', r'\blast chance\b',
    r'\bexpire[sd]?\b', r'\bblocked?\b', r'\bsuspended?\b', r'\bfrozen?\b',
    r'\bverif(y|ication)\b', r'\bkyc\b', r'\baccount (will be|is) closed\b',
    r'\blimited time\b', r'\bdo not delay\b', r'\bact now\b', r'\bwithin 24 hours?\b',
    r'\bwithin \d+ hours?\b', r'\bdeadline\b', r'\boverdue\b', r'\bpending action\b',
]

FINANCIAL_PHRASES = [
    r'\bsend money\b', r'\btransfer\b', r'\bpay (?:now|immediately|online)\b',
    r'\bcash (reward|prize|back)\b', r'\bwon\b', r'\blottery\b', r'\bprize\b',
    r'\bgift card\b', r'\bitunes\b', r'\bgoogle play\b', r'\bamazon gift\b',
    r'\breward\b', r'\brefund\b', r'\btax refund\b', r'\bclaim your\b',
    r'\bfree (money|cash|iphone|laptop|gift)\b', r'\bwire transfer\b',
    r'\bcryptocurr\b', r'\bbitcoin\b', r'\bupi\b', r'\bneft\b', r'\brtgs\b',
]

IMPERSONATION_PHRASES = [
    r'\bsbi\b', r'\bicici\b', r'\bhdfc\b', r'\baxis bank\b', r'\bpnb\b',
    r'\bincome tax\b', r'\bincome-tax\b', r'\bnarc(otics)?\b', r'\bcbi\b',
    r'\bcbi officer\b', r'\bpolice\b', r'\btelecom\b', r'\btrai\b',
    r'\bairtel\b', r'\bjio\b', r'\bbsnl\b', r'\bvi \b', r'\bpostman\b',
    r'\bcustoms\b', r'\bcourier\b', r'\bfedex\b', r'\bdhl\b', r'\bamazon delivery\b',
    r'\bpm (modi|office)\b', r'\bgovernment of india\b',
    r'\bsupreme court\b', r'\bedi\b', r'\breserve bank\b', r'\brbi\b',
]

THREAT_PHRASES = [
    r'\barrest\b', r'\bjail\b', r'\bimprison\b', r'\bfir\b', r'\bcriminal\b',
    r'\bwarrant\b', r'\bcase (filed|registered)\b', r'\blegal action\b',
    r'\bcyber crime\b', r'\bfraud alert\b', r'\bsus(p)?ect\b',
    r'\bblacklist\b', r'\bpenalty\b', r'\bfine\b', r'\bsurrender\b',
    r'\bdetain\b', r'\bdetained\b',
]

OTP_PHRASES = [
    r'\botp\b', r'\bone.time.pass\b', r'\bpin\b', r'\bpassword\b',
    r'\bcvv\b', r'\bcard number\b', r'\baccount number\b', r'\baadhaar\b',
    r'\bpan (card|number)\b', r'\bnetbanking\b', r'\bbank details\b',
]

REMOTE_ACCESS_PHRASES = [
    r'\banydesk\b', r'\bteamviewer\b', r'\bquickassist\b', r'\bsupport app\b',
    r'\bscreen share\b', r'\bremote (access|control)\b', r'\binstall this app\b',
    r'\bdownload and install\b',
]

SUSPICIOUS_LINK_PATTERNS = [
    r'bit\.ly', r'tinyurl\.com', r'goo\.gl', r't\.co', r'rb\.gy',
    r'ow\.ly', r'is\.gd', r'buff\.ly', r'short\.link',
    r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}',  # raw IP
    r'http://',  # non-HTTPS
    r'[a-z0-9-]+-(?:kyc|bank|update|verify|secure|login|sbi|icici|hdfc|gov)-[a-z0-9-]+\.',
    r'(?:update|verify|secure|login|renew)\.[a-z]',
    r'\.(xyz|tk|ml|ga|cf|pw|top|click|download|info|online|live|site)/',
    r'free\-(?:prize|gift|reward|iphone)',
]

SAFE_DOMAINS = {
    'sbi.co.in', 'onlinesbi.sbi', 'hdfcbank.com', 'icicibank.com',
    'axisbank.com', 'kotak.com', 'pnbindia.in', 'bankofbaroda.in',
    'google.com', 'gmail.com', 'youtube.com', 'amazon.in', 'flipkart.com',
    'paytm.com', 'phonepe.com', 'bhimupi.org.in', 'npci.org.in',
    'incometax.gov.in', 'uidai.gov.in', 'india.gov.in', 'mca.gov.in',
    'irctc.co.in', 'digilocker.gov.in', 'cowin.gov.in',
    'whatsapp.com', 'facebook.com', 'instagram.com', 'twitter.com',
    'linkedin.com', 'microsoft.com', 'apple.com', 'netflix.com',
}


def _count_pattern_hits(text: str, patterns: list[str]) -> int:
    text_lower = text.lower()
    return sum(1 for p in patterns if re.search(p, text_lower))


def _extract_urls(text: str) -> list[str]:
    url_pattern = r'https?://[^\s<>"\']+'
    return re.findall(url_pattern, text, re.IGNORECASE)


def _get_domain(url: str) -> str:
    match = re.search(r'https?://(?:www\.)?([^/\s?]+)', url, re.IGNORECASE)
    return match.group(1).lower() if match else ''


def _is_url_suspicious(url: str) -> tuple[bool, list[str]]:
    reasons = []
    domain = _get_domain(url)

    for pattern in SUSPICIOUS_LINK_PATTERNS:
        if re.search(pattern, url, re.IGNORECASE):
            reasons.append(f'Suspicious URL pattern detected: uses known fraud link format.')
            break

    if domain and domain not in SAFE_DOMAINS:
        # Check for look-alike domains
        official_banks = ['sbi', 'hdfc', 'icici', 'axis', 'pnb', 'kotak']
        for bank in official_banks:
            if bank in domain and not domain.endswith('.co.in') and not domain.endswith('.com'):
                reasons.append(f'Domain "{domain}" impersonates a bank but is not the official website.')
                break

        if re.search(r'(secure|update|verify|kyc|login)-', domain):
            reasons.append(f'Domain "{domain}" uses suspicious keywords to appear legitimate.')

    return len(reasons) > 0, reasons


class ScamAnalysisEngine:
    """Core rule-based scam analysis engine for RakshaAI."""

    def analyze_message(
        self,
        message: str,
        sender_info: Optional[str] = None,
        analysis_type: str = 'message'
    ) -> AnalysisResult:
        text = message.strip()
        reasons = []
        risk_score = 0
        scam_type = "UNKNOWN"

        # ── Pattern scoring ──
        urgency_hits = _count_pattern_hits(text, URGENT_PHRASES)
        financial_hits = _count_pattern_hits(text, FINANCIAL_PHRASES)
        impersonation_hits = _count_pattern_hits(text, IMPERSONATION_PHRASES)
        threat_hits = _count_pattern_hits(text, THREAT_PHRASES)
        otp_hits = _count_pattern_hits(text, OTP_PHRASES)
        remote_hits = _count_pattern_hits(text, REMOTE_ACCESS_PHRASES)

        # ── Urgency scoring ──
        if urgency_hits >= 3:
            risk_score += 25
            reasons.append("🚨 Creates extreme urgency — real institutions never demand action within hours.")
        elif urgency_hits >= 1:
            risk_score += 12
            reasons.append("⚠️ Uses urgency language to pressure you into acting without thinking.")

        # ── Financial request scoring ──
        if financial_hits >= 2:
            risk_score += 30
            reasons.append("💰 Demands money or payment — a major red flag in any digital communication.")
        elif financial_hits >= 1:
            risk_score += 15
            reasons.append("💸 References money, prizes, or financial rewards — common scam bait.")

        # ── Impersonation scoring ──
        if impersonation_hits >= 1:
            risk_score += 20
            reasons.append("🏛️ Claims to be from a bank, government, or courier — scammers often impersonate trusted organizations.")
            scam_type = "IMPERSONATION"

        # ── Threat scoring ──
        if threat_hits >= 2:
            risk_score += 35
            reasons.append("👮 Contains legal threats (arrest, FIR, court) to cause fear — real police never contact this way.")
            scam_type = "LEGAL THREAT SCAM"
        elif threat_hits >= 1:
            risk_score += 18
            reasons.append("⚖️ Uses legal or criminal threat language to scare you into compliance.")

        # ── OTP / sensitive data ──
        if otp_hits >= 1:
            risk_score += 25
            reasons.append("🔐 Asks for OTP, password, or banking details — NEVER share these with anyone.")
            scam_type = "CREDENTIAL THEFT"

        # ── Remote access ──
        if remote_hits >= 1:
            risk_score += 40
            reasons.append("📱 Asks you to install apps like AnyDesk or TeamViewer — this gives criminals full control of your phone.")
            scam_type = "REMOTE ACCESS FRAUD"

        # ── URL analysis ──
        urls = _extract_urls(text)
        for url in urls[:3]:
            is_sus, url_reasons = _is_url_suspicious(url)
            if is_sus:
                risk_score += 20
                reasons.extend(url_reasons)
                scam_type = "PHISHING LINK"

        # ── Sender analysis ──
        if sender_info:
            sender_lower = sender_info.lower()
            if re.search(r'\d{10}', sender_info):  # private number
                risk_score += 10
                reasons.append("📞 Sent from a private mobile number — official organizations use registered short codes or IDs.")
            if any(word in sender_lower for word in ['unknown', 'private', 'hidden']):
                risk_score += 10
                reasons.append("❓ Sender identity is hidden or unknown — legitimate messages always show a verified sender ID.")

        # ── Determine scam type from context ──
        if scam_type == "UNKNOWN":
            if financial_hits >= 1 and impersonation_hits >= 1:
                scam_type = "BANKING FRAUD"
            elif financial_hits >= 2:
                scam_type = "FINANCIAL SCAM"
            elif urgency_hits >= 2:
                scam_type = "URGENCY SCAM"
            elif urls and risk_score > 20:
                scam_type = "PHISHING LINK"
            elif risk_score <= 10:
                scam_type = "APPEARS SAFE"

        # ── Cap risk score ──
        risk_score = min(risk_score, 98)

        # ── Determine risk level ──
        if risk_score >= 70:
            risk_level = "DANGEROUS"
        elif risk_score >= 40:
            risk_level = "SUSPICIOUS"
        elif risk_score >= 15:
            risk_level = "SUSPICIOUS"
        else:
            risk_level = "SAFE"
            if not reasons:
                reasons.append("✅ No known scam patterns detected in this message.")

        confidence = min(95, 60 + (len(reasons) * 5))

        # ── Generate contextual summary ──
        summary = self._generate_summary(risk_level, scam_type, urgency_hits, threat_hits, financial_hits, otp_hits)

        # ── Recommended actions ──
        recommended_actions = self._get_recommended_actions(risk_level, scam_type, otp_hits, remote_hits)

        # ── Things to avoid ──
        things_to_avoid = self._get_things_to_avoid(risk_level, otp_hits, remote_hits, financial_hits)

        return AnalysisResult(
            risk_score=max(0, risk_score),
            risk_level=risk_level,
            scam_type=scam_type,
            confidence=confidence,
            summary=summary,
            reasons=reasons if reasons else ["No suspicious patterns detected."],
            recommended_actions=recommended_actions,
            things_to_avoid=things_to_avoid,
            analyzed_target=text[:200],
            provider_used="RakshaAI Pattern Engine v1"
        )

    def analyze_link(self, url: str) -> AnalysisResult:
        reasons = []
        risk_score = 0
        scam_type = "LINK ANALYSIS"

        url = url.strip()
        domain = _get_domain(url)

        # Check if it's a known safe domain
        if domain in SAFE_DOMAINS:
            return AnalysisResult(
                risk_score=5,
                risk_level="SAFE",
                scam_type="VERIFIED WEBSITE",
                confidence=95,
                summary=f"This link belongs to '{domain}', which is a well-known and trusted website. It appears safe to visit.",
                reasons=[f"✅ Domain '{domain}' is a verified, official website."],
                recommended_actions=["You can visit this website safely.", "Always double-check the URL bar in your browser before logging in."],
                things_to_avoid=["Do not enter your password if you clicked from an SMS or email — type the website address manually instead."],
                analyzed_target=url,
                provider_used="RakshaAI Pattern Engine v1"
            )

        # Check suspicious patterns
        is_sus, url_reasons = _is_url_suspicious(url)
        if is_sus:
            risk_score += 50
            reasons.extend(url_reasons)
            scam_type = "PHISHING LINK"

        if not url.startswith('https://'):
            risk_score += 15
            reasons.append("🔓 This link does not use HTTPS (secure connection) — your information may not be protected.")

        # Check for IP address (not a real domain)
        if re.search(r'https?://\d{1,3}\.\d{1,3}', url):
            risk_score += 30
            reasons.append("🔢 Link uses a raw IP address instead of a proper website name — highly suspicious.")
            scam_type = "DIRECT IP ATTACK"

        # Check URL shorteners
        for shortener in ['bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'rb.gy', 'ow.ly']:
            if shortener in url:
                risk_score += 20
                reasons.append(f"🔗 This is a shortened URL (via {shortener}). The actual destination is hidden. Never click these from strangers.")
                scam_type = "HIDDEN REDIRECT LINK"
                break

        # Check suspicious TLDs
        if re.search(r'\.(xyz|tk|ml|ga|cf|pw|top|click|download|info)($|/)', domain):
            risk_score += 25
            reasons.append("🌐 Uses an unusual website extension (.xyz, .tk, etc.) commonly used for scam websites.")

        if risk_score == 0:
            reasons.append("⚠️ Unknown website. We couldn't verify it as safe. Proceed with caution.")
            risk_score = 20
            risk_level = "SUSPICIOUS"
        elif risk_score >= 60:
            risk_level = "DANGEROUS"
        elif risk_score >= 30:
            risk_level = "SUSPICIOUS"
        else:
            risk_level = "SAFE"

        risk_score = min(risk_score, 98)
        confidence = min(93, 55 + len(reasons) * 8)

        return AnalysisResult(
            risk_score=risk_score,
            risk_level=risk_level,
            scam_type=scam_type,
            confidence=confidence,
            summary=self._generate_link_summary(risk_level, domain, reasons),
            reasons=reasons,
            recommended_actions=self._get_recommended_actions(risk_level, scam_type, 0, 0),
            things_to_avoid=["Do not click this link if received from an unknown sender.", "Never enter your OTP, bank PIN, or Aadhaar number on this website."],
            analyzed_target=url,
            provider_used="RakshaAI Pattern Engine v1"
        )

    def _generate_summary(self, risk_level, scam_type, urgency, threat, financial, otp):
        if risk_level == "SAFE":
            return "This message appears to be safe. No significant scam indicators were found. You may respond or follow up through official channels if needed."
        elif risk_level == "SUSPICIOUS":
            if financial > 0:
                return "This message shows warning signs of a financial scam. It may be trying to trick you into sending money or revealing bank details. Do not act without verifying through an official source."
            elif urgency > 1:
                return "This message creates unnecessary urgency. Scammers use urgency to prevent you from thinking clearly. Take your time and verify independently before acting."
            else:
                return "Some elements of this message are suspicious. We recommend caution and verification before taking any action."
        else:  # DANGEROUS
            if otp > 0:
                return "⛔ DANGER: This message is trying to steal your banking credentials or OTP. No legitimate bank or government ever asks for your OTP. Block and report this sender immediately."
            elif threat > 1:
                return "⛔ DANGER: This message uses fake legal threats to frighten you. Police and courts NEVER contact through SMS or WhatsApp. This is almost certainly a scam. Do not respond."
            elif scam_type == "REMOTE ACCESS FRAUD":
                return "⛔ DANGER: This message wants you to install apps that will give criminals complete control of your phone and bank account. Do not install anything."
            else:
                return "⛔ DANGER: This message has multiple signs of a serious scam. Do not respond, click any links, or send any money. Contact your family and block this sender immediately."

    def _generate_link_summary(self, risk_level, domain, reasons):
        if risk_level == "SAFE":
            return f"This link appears to be safe and belongs to a legitimate website ({domain})."
        elif risk_level == "SUSPICIOUS":
            return f"This link has suspicious characteristics. The website '{domain}' could not be verified as safe. Do not enter any personal information."
        else:
            return f"⛔ This link is likely a scam website designed to steal your information or money. Do not open it. If you already opened it, do not enter any details."

    def _get_recommended_actions(self, risk_level, scam_type, otp_hits, remote_hits):
        if risk_level == "SAFE":
            return [
                "This appears safe, but always be cautious with personal information.",
                "If uncertain, call the official customer care number printed on the back of your bank card.",
            ]
        elif risk_level == "SUSPICIOUS":
            return [
                "Do NOT click any links in this message.",
                "Call the organization directly using their official website or phone number.",
                "Show this message to a trusted family member before taking any action.",
                "Search for the company's official number online — do not use the one in the message.",
            ]
        else:  # DANGEROUS
            actions = [
                "🚫 Do NOT respond, click, or call back.",
                "Block this sender or phone number immediately.",
                "Show this to your son, daughter, or a trusted family member right now.",
                "Report to Cyber Crime helpline: 1930 or cybercrime.gov.in",
            ]
            if otp_hits:
                actions.insert(0, "If you already shared your OTP, call your bank immediately to block your card: SBI: 1800-11-2211 | HDFC: 1800-258-3838 | ICICI: 1800-102-4242")
            if remote_hits:
                actions.insert(0, "If you already installed the app, uninstall it immediately and factory reset your phone.")
            return actions

    def _get_things_to_avoid(self, risk_level, otp_hits, remote_hits, financial_hits):
        avoid = []
        if risk_level != "SAFE":
            avoid.append("Do not share your OTP, password, or banking PIN with anyone over call or message.")
            avoid.append("Do not click unknown links, even if they look official.")
        if otp_hits:
            avoid.append("Never share your OTP — not even with someone claiming to be from your bank.")
        if remote_hits:
            avoid.append("Never install AnyDesk, TeamViewer, or any 'support app' suggested by a caller.")
        if financial_hits:
            avoid.append("Never transfer money urgently without confirming with your bank in person.")
            avoid.append("Never send money via gift cards — no legitimate organization asks for payment this way.")
        return avoid if avoid else ["Stay alert and verify all communications through official channels."]


# Singleton instance
scam_engine = ScamAnalysisEngine()
