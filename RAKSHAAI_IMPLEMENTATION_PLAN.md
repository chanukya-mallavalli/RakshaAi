# RakshaAI — Implementation Plan & Architecture
**Tagline:** Pause. Check. Stay Safe.  
**Mission:** A caring, trustworthy digital safety companion designed for elders and families to identify scams, explain threats in simple language, and guide safe decisions without technical jargon.

---

## 1. Architecture Overview

RakshaAI is structured around an explainable, multi-layered decision and safety pipeline:

```text
               ┌──────────────────────────────┐
               │    Elderly User / Family     │
               └──────────────┬───────────────┘
                              │
                              ▼
               ┌──────────────────────────────┐
               │   RakshaAI Friendly UI       │
               │  React + Vite + TypeScript   │
               │  (Simple Mode + TTS + i18n)  │
               └──────────────┬───────────────┘
                              │ REST API
                              ▼
               ┌──────────────────────────────┐
               │       FastAPI Backend        │
               │  Pydantic V2 + Async Engines │
               └──────────────┬───────────────┘
                              │
     ┌────────────────────────┼────────────────────────┐
     ▼                        ▼                        ▼
Message Engine           OCR / Image              URL / QR Engine
(SMS, WA, Email)        (Extract Text)          (Domain & UPI checks)
     │                        │                        │
     └────────────────────────┼────────────────────────┘
                              ▼
               ┌──────────────────────────────┐
               │      Hybrid Risk Engine      │
               ├──────────────────────────────┤
               │ 1. Rule & Pattern Engine     │
               │ 2. AI / Semantic Intent      │
               │ 3. Threat Indicator Weighting│
               └──────────────┬───────────────┘
                              ▼
               ┌──────────────────────────────┐
               │ Transparent Scoring (0-100)  │
               │  Safe / Suspicious / Danger  │
               └──────────────┬───────────────┘
                              ▼
               ┌───────────────
               ───────────────┐
               │     Explainable Safety       │
               │ Simple Reasons + Safe Steps  │
               │ + Family Alert Option        │
               └──────────────────────────────┘
```

---

## 2. Technology Choices & Justifications

| Component | Choice | Reason |
| :--- | :--- | :--- |
| **Frontend Framework** | React 18 / 19 + TypeScript + Vite | Blazing fast development, high reactivity, strong typing |
| **Styling & UI** | Tailwind CSS + Lucide React | High-contrast, custom elderly-friendly tokens, accessible typography |
| **State & Routing** | React Router v6 | Seamless multi-page and unified check experience |
| **Audio / Speech** | Web Speech Synthesis API | Native browser text-to-speech for elderly audio read-aloud without extra heavy dependencies |
| **Backend Framework** | Python 3.14 + FastAPI + Uvicorn | High performance, auto OpenAPI documentation, clean async pipelines |
| **Data Validation** | Pydantic v2 | Strict schema enforcement for safety contracts |
| **Database** | SQLite + SQLAlchemy (Async/Sync) | Zero-overhead development storage, easily portable to PostgreSQL |
| **AI Provider Layer** | Dynamic Adapter (`RuleFallback`, `Gemini`, `OpenAI`, `Groq`) | Pluggable architecture: 100% functional offline/no-API-key via rule fallback |
| **OCR & QR** | EasyOCR/Tesseract fallback + PyZbar / OpenCV / PIL QR decoders | Robust offline image text & QR recognition |

---

## 3. Workspace Folder Structure

```text
d:\S-projject\RakshaAi\
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── v1/
│   │   │   │   ├── endpoints/
│   │   │   │   │   ├── analyze.py
│   │   │   │   │   ├── history.py
│   │   │   │   │   ├── contacts.py
│   │   │   │   │   └── safety.py
│   │   │   │   └── router.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── database.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── history.py
│   │   │   ├── contact.py
│   │   │   └── safety_tip.py
│   │   ├── schemas/
│   │   │   ├── analysis.py
│   │   │   ├── history.py
│   │   │   └── contact.py
│   │   ├── services/
│   │   │   ├── ai/
│   │   │   │   ├── base.py
│   │   │   │   ├── gemini.py
│   │   │   │   ├── openai_provider.py
│   │   │   │   └── fallback.py
│   │   │   ├── risk/
│   │   │   │   ├── rule_engine.py
│   │   │   │   └── scorer.py
│   │   │   ├── ocr/
│   │   │   │   └── extractor.py
│   │   │   ├── url/
│   │   │   │   └── analyzer.py
│   │   │   └── qr/
│   │   │       └── decoder.py
│   │   └── main.py
│   ├── tests/
│   │   ├── test_health.py
│   │   ├── test_rules.py
│   │   └── test_api.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/ (Navbar, Footer, ShieldBadge, SpeakButton)
│   │   │   ├── check/ (InputForm, ResultCard, ConfidenceMeter)
│   │   │   └── family/ (AlertModal, ContactCard)
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── CheckPage.tsx
│   │   │   ├── SafetyCenterPage.tsx
│   │   │   ├── HistoryPage.tsx
│   │   │   └── FamilyDashboardPage.tsx
│   │   ├── layouts/
│   │   │   └── MainLayout.tsx
│   │   ├── hooks/
│   │   │   ├── useSpeech.ts
│   │   │   └── useElderlyMode.ts
│   │   ├── i18n/
│   │   │   ├── en.json
│   │   │   ├── hi.json
│   │   │   └── te.json
│   │   ├── services/
│   │   │   └── api.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docs/
│   └── architecture.md
├── .env.example
├── .gitignore
├── README.md
└── RAKSHAAI_IMPLEMENTATION_PLAN.md
```

---

## 4. Controlled Development Phases

1. **Phase 1: Project Foundation & Base UI**
   - Backend setup (FastAPI, SQLite schema, config, health check endpoint).
   - Frontend setup (Vite + React + TS + Tailwind CSS + Lucide Icons + Navigation).
   - Base elderly-friendly design tokens (gentle colors, warm shields, high-legibility cards).
   - End-to-end connection check.
2. **Phase 2: Core Message Scam Engine & Transparent Scoring**
   - Rule engine for high-frequency scams (OTP, KYC, Bank, Courier, Lottery).
   - Pydantic analysis contract (`RiskLevel`, `RiskScore`, `Reasons`, `Actions`).
   - Unified Message Check UI with instant results.
3. **Phase 3: AI Layer with Dynamic Provider Fallback**
   - Provider abstraction: Groq / Gemini / OpenAI / Rule Fallback.
   - Structured JSON prompt template for intent and social engineering.
   - Resilient fallback ensuring zero downtime when offline.
4. **Phase 4: Image & Screenshot OCR Analysis**
   - Image upload pipeline with size & MIME validation.
   - Text extraction engine.
   - Extracted text display + scam analysis.
5. **Phase 5: Link & QR Decoder Engine**
   - Heuristic domain & lookalike URL inspection.
   - QR code reading (URL / UPI payment destination extraction without executing transactions).
6. **Phase 6: Phone Call & Transcript Threat Analyzer**
   - Impersonation & urgency detection for phone conversation transcripts.
7. **Phase 7: Elderly-First Accessibility & Multilingual Companion**
   - Simple Mode toggle (larger fonts, simplified terms, gentle animations).
   - Text-to-speech audio read-aloud (`useSpeech`).
   - Localization dictionaries (`English`, `Hindi`, `Telugu`).
8. **Phase 8: Family Protection & Trusted Contacts**
   - Add/manage trusted contacts (Son, Daughter, Caregiver).
   - "Alert Family" explicit user-triggered action.
   - Family protection summary view.
9. **Phase 9: Safety Center & Educational Knowledge Base**
   - Real-world scam guides (KYC, UPI refund, fake electricity officer, fake job).
   - "What it looks like", "Red flags", "Safe actions".
10. **Phase 10: Competition Polish & Deterministic Demo Scenarios**
    - 5 prebuilt deterministic competition scenarios.
    - Polish UI transitions, loading states, error boundaries.
    - Full documentation and automated test verification.

---

## 5. Standardized API Design

### Base Endpoints
- `GET /api/v1/health` → Status, runtime, provider info
- `POST /api/v1/analyze/message` → Analyze text message
- `POST /api/v1/analyze/link` → Analyze URL
- `POST /api/v1/analyze/screenshot` → Upload & inspect screenshot
- `POST /api/v1/analyze/qr` → Decode QR and check payload
- `POST /api/v1/analyze/call` → Analyze spoken/written call transcript
- `GET /api/v1/history` & `DELETE /api/v1/history` → Privacy-safe user history
- `GET /api/v1/contacts` & `POST /api/v1/contacts` → Trusted family contacts

### Standard Output Contract
```json
{
  "risk_score": 92,
  "risk_level": "DANGEROUS",
  "scam_type": "Bank Impersonation",
  "confidence": 0.95,
  "summary": "This message pretends to be your bank and urgently asks for an OTP to stop account blockage.",
  "reasons": [
    "Requests confidential OTP/PIN",
    "Creates artificial urgency ('account blocked today')",
    "Contains unverified link"
  ],
  "recommended_actions": [
    "Do not click on the link",
    "Never share OTP or PIN with anyone",
    "Visit your bank branch or call the number on the back of your debit card"
  ],
  "things_to_avoid": [
    "Do not reply or forward the message",
    "Do not transfer any verification fee"
  ]
}
```

---

## 6. Security, Ethics & Privacy Principles
- **No credential collection:** Promptly warn and strip potential passwords/credit cards before logging.
- **Privacy First:** History only stores metadata (score, category, timestamp) unless explicitly opted in.
- **Never trigger transactions:** QR engine only identifies receiver ID; never invokes payment gateways.
- **Explainability:** No black-box answers. Always provide clear, compassionate reasons.
- **Cautious advice:** If uncertain, flag as "UNABLE TO VERIFY" or "SUSPICIOUS" — never falsely reassure.
