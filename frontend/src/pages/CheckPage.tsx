import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  MessageSquareText, Link2, Camera, QrCode, PhoneCall,
  ShieldCheck, RotateCcw, Upload, AlertTriangle, CheckCircle2,
  XCircle, Info, Phone, ExternalLink, Loader2, ChevronDown, ChevronUp,
} from 'lucide-react';
import type { SupportedLanguage, AnalysisType, AnalysisResult } from '../types';
import { getTranslation } from '../i18n';
import { analyzeMessage, analyzeLink, analyzeCall, analyzeFile } from '../services/api';

interface CheckPageProps { currentLang: SupportedLanguage; }

const DEMO_SCENARIOS: Record<AnalysisType, { label: string; content: string; extra?: string }> = {
  message: {
    label: 'Demo: Bank KYC Scam',
    content: 'Dear valued customer, your SBI account will be BLOCKED today due to incomplete KYC verification. Click http://sbi-kyc-secure.xyz/login or call 9876543210 IMMEDIATELY to avoid disruption.',
    extra: '9876543210',
  },
  link: {
    label: 'Demo: Phishing URL',
    content: 'http://hdfc-bank-secure-update.xyz/login',
  },
  call: {
    label: 'Demo: Police Impersonation',
    content: 'I am calling from CBI. Your Aadhaar card is involved in a money laundering case. You will be arrested within 2 hours unless you pay Rs. 50,000 immediately via Google Pay. Do not tell anyone.',
    extra: '9999999999',
  },
  screenshot: { label: 'Upload Screenshot', content: '' },
  qr: { label: 'Upload QR Code', content: '' },
};

type RiskLevel = 'SAFE' | 'SUSPICIOUS' | 'DANGEROUS' | 'UNABLE TO VERIFY';

function RiskBadge({ level, score }: { level: RiskLevel; score: number }) {
  const config = {
    SAFE: { bg: 'bg-[#f0fdf4]', border: 'border-[#86efac]', text: 'text-[#14532d]', icon: CheckCircle2, label: 'SAFE', dot: 'bg-[#16a34a]' },
    SUSPICIOUS: { bg: 'bg-[#fffbeb]', border: 'border-[#fde68a]', text: 'text-[#78350f]', icon: AlertTriangle, label: 'SUSPICIOUS', dot: 'bg-[#d97706]' },
    DANGEROUS: { bg: 'bg-[#fff1f2]', border: 'border-[#fecdd3]', text: 'text-[#881337]', icon: XCircle, label: 'DANGEROUS', dot: 'bg-[#e11d48]' },
    'UNABLE TO VERIFY': { bg: 'bg-[#f8fafc]', border: 'border-[#cbd5e1]', text: 'text-[#475569]', icon: Info, label: 'UNVERIFIED', dot: 'bg-[#94a3b8]' },
  };
  const c = config[level] || config['UNABLE TO VERIFY'];
  const Icon = c.icon;
  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${c.bg} border ${c.border}`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} animate-pulse`} />
      <Icon className={`w-4 h-4 ${c.text}`} />
      <span className={`font-serif font-bold text-sm ${c.text}`}>{c.label}</span>
      <span className={`font-sans text-xs font-bold ${c.text} opacity-70`}>({score}/100)</span>
    </div>
  );
}

function RiskMeter({ score, level }: { score: number; level: RiskLevel }) {
  const color =
    level === 'SAFE' ? '#16a34a' :
    level === 'SUSPICIOUS' ? '#d97706' : '#e11d48';

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-serif text-xs font-bold text-[#475569] uppercase tracking-wider">Risk Score</span>
        <span className="font-serif text-xl font-black" style={{ color }}>{score}/100</span>
      </div>
      <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden border border-[#e2e8f0]">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}aa, ${color})` }}
        />
      </div>
      <div className="flex justify-between text-xs text-[#94a3b8] font-sans">
        <span>0 — Safe</span><span>50 — Suspicious</span><span>100 — Dangerous</span>
      </div>
    </div>
  );
}

function ResultCard({ result }: { result: AnalysisResult }) {
  const [showDetails, setShowDetails] = useState(false);
  const isDANGEROUS = result.risk_level === 'DANGEROUS';
  const isSAFE = result.risk_level === 'SAFE';

  return (
    <div className={`rounded-3xl border-2 overflow-hidden shadow-xl transition-all ${
      isDANGEROUS ? 'border-[#fecdd3] bg-gradient-to-br from-[#fff1f2] to-[#fff5f7]' :
      isSAFE ? 'border-[#86efac] bg-gradient-to-br from-[#f0fdf4] to-[#f7fef9]' :
      'border-[#fde68a] bg-gradient-to-br from-[#fffbeb] to-[#fffdf5]'
    }`}>

      {/* Header Band */}
      <div className={`px-7 py-5 border-b-2 ${
        isDANGEROUS ? 'bg-[#fff1f2] border-[#fecdd3]' :
        isSAFE ? 'bg-[#f0fdf4] border-[#86efac]' :
        'bg-[#fffbeb] border-[#fde68a]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="font-serif text-xs font-bold uppercase tracking-widest text-[#64748b]">Analysis Complete · {result.provider_used}</p>
            <h2 className="font-serif text-2xl font-bold text-[#0f172a]">{result.scam_type}</h2>
          </div>
          <RiskBadge level={result.risk_level as RiskLevel} score={result.risk_score} />
        </div>
      </div>

      {/* Body */}
      <div className="p-7 space-y-6">
        {/* Risk Meter */}
        <RiskMeter score={result.risk_score} level={result.risk_level as RiskLevel} />

        {/* Summary */}
        <div className={`p-5 rounded-2xl border ${
          isDANGEROUS ? 'bg-[#fff1f2] border-[#fecdd3]' :
          isSAFE ? 'bg-[#f0fdf4] border-[#bbf7d0]' :
          'bg-[#fffbeb] border-[#fde68a]'
        }`}>
          <p className="font-serif text-base font-semibold text-[#0f172a] leading-relaxed">{result.summary}</p>
        </div>

        {/* Recommended Actions */}
        <div className="space-y-3">
          <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#475569] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> What To Do Now
          </h3>
          <ul className="space-y-2">
            {result.recommended_actions.map((action, i) => (
              <li key={i} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#e2e8f0] shadow-xs">
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isDANGEROUS ? 'bg-[#fecdd3] text-[#881337]' :
                  isSAFE ? 'bg-[#bbf7d0] text-[#14532d]' : 'bg-[#fde68a] text-[#78350f]'
                }`}>{i + 1}</span>
                <span className="font-sans text-sm text-[#1e293b] leading-relaxed">{action}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-4 bg-white rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors cursor-pointer"
        >
          <span className="font-serif text-sm font-bold text-[#475569]">
            {showDetails ? 'Hide' : 'Show'} Why We Flagged This ({result.reasons.length} signal{result.reasons.length !== 1 ? 's' : ''} found)
          </span>
          {showDetails ? <ChevronUp className="w-4 h-4 text-[#94a3b8]" /> : <ChevronDown className="w-4 h-4 text-[#94a3b8]" />}
        </button>

        {showDetails && (
          <div className="space-y-2 animate-[fadeIn_0.3s_ease-out]">
            {result.reasons.map((reason, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 bg-white rounded-xl border border-[#e2e8f0]">
                <span className="text-base shrink-0 mt-0.5">⚠️</span>
                <p className="font-sans text-sm text-[#334155] leading-relaxed">{reason}</p>
              </div>
            ))}

            {result.things_to_avoid.length > 0 && (
              <div className="mt-4 p-4 bg-[#fff1f2] rounded-xl border border-[#fecdd3]">
                <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-[#881337] mb-3 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Things To Avoid
                </h4>
                <ul className="space-y-1.5">
                  {result.things_to_avoid.map((item, i) => (
                    <li key={i} className="font-sans text-sm text-[#4c0519] flex items-start gap-2">
                      <span className="shrink-0 mt-0.5">❌</span> {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Emergency Contact */}
        {isDANGEROUS && (
          <div className="p-5 bg-[#0f172a] rounded-2xl text-white space-y-3">
            <p className="font-serif text-sm font-bold text-[#e2b740] uppercase tracking-wider">🆘 Emergency Cyber Crime Helpline</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="tel:1930"
                className="flex items-center gap-2 bg-[#e11d48] text-white font-serif font-bold px-4 py-2.5 rounded-xl hover:bg-[#be123c] transition-colors"
              >
                <Phone className="w-4 h-4" /> Call 1930
              </a>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#1e3a5f] text-[#93c5fd] font-serif font-bold px-4 py-2.5 rounded-xl hover:bg-[#1e40af] transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> cybercrime.gov.in
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const CheckPage: React.FC<CheckPageProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialType = (searchParams.get('type') as AnalysisType) || 'message';

  const [activeType, setActiveType] = useState<AnalysisType>(initialType);
  const [inputText, setInputText] = useState('');
  const [senderInfo, setSenderInfo] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const typeParam = searchParams.get('type') as AnalysisType;
    if (typeParam && ['message', 'link', 'screenshot', 'qr', 'call'].includes(typeParam)) {
      setActiveType(typeParam);
    }
  }, [searchParams]);

  const handleTabChange = (type: AnalysisType) => {
    setActiveType(type);
    setSearchParams({ type });
    setResult(null);
    setError(null);
    setInputText('');
    setSenderInfo('');
    setUploadedFile(null);
  };

  const handleAnalyze = async () => {
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      let analysisResult: AnalysisResult;

      if (activeType === 'message') {
        analysisResult = await analyzeMessage(inputText, senderInfo || undefined);
      } else if (activeType === 'link') {
        analysisResult = await analyzeLink(inputText);
      } else if (activeType === 'call') {
        analysisResult = await analyzeCall(inputText, senderInfo || undefined);
      } else if (activeType === 'screenshot' || activeType === 'qr') {
        if (!uploadedFile) throw new Error('Please upload a file first.');
        analysisResult = await analyzeFile(uploadedFile, activeType);
      } else {
        throw new Error('Unknown analysis type.');
      }

      setResult(analysisResult);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadDemo = () => {
    const demo = DEMO_SCENARIOS[activeType];
    setInputText(demo.content);
    if (demo.extra) setSenderInfo(demo.extra);
    setResult(null);
    setError(null);
  };

  const tabs: { id: AnalysisType; label: string; icon: React.ElementType }[] = [
    { id: 'message', label: t.actions.checkMessage, icon: MessageSquareText },
    { id: 'link', label: t.actions.checkLink, icon: Link2 },
    { id: 'screenshot', label: t.actions.checkScreenshot, icon: Camera },
    { id: 'qr', label: t.actions.checkQr, icon: QrCode },
    { id: 'call', label: t.actions.checkCall, icon: PhoneCall },
  ];

  const isFileType = activeType === 'screenshot' || activeType === 'qr';
  const canAnalyze = isFileType ? !!uploadedFile : !!inputText.trim();

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Header */}
     {/* Header */}
<div className="space-y-2 text-center">
  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#f5f8ff] tracking-tight">
    RakshaAI Safety Inspection
  </h1>

  <p className="font-serif italic text-[#a9b9d4] text-base sm:text-lg">
    Paste what you received below. We will inspect it for scam red flags immediately.
  </p>
</div>

      {/* Tab Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#f4ece1] rounded-2xl border border-[#e2d5c3]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl font-serif text-sm sm:text-base transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-[#78350f] font-bold shadow-md border border-[#d4af37]/50 scale-[1.02]'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#fbf7f0]'
              }`}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#b45309]' : 'text-[#78716c]'}`} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Container */}
      <div className="bg-white rounded-3xl border-2 border-[#e8dfcf] p-6 sm:p-9 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-[#f0e8dc] pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-[#0f172a]">
              {activeType === 'message' && 'Paste SMS, WhatsApp Message, or Email'}
              {activeType === 'link' && 'Enter Web Address (URL)'}
              {activeType === 'screenshot' && 'Upload Screenshot / Photo'}
              {activeType === 'qr' && 'Upload QR Code Image'}
              {activeType === 'call' && 'Describe Caller or Paste Transcript'}
            </h2>
            <p className="text-xs text-[#78716c] mt-0.5 font-sans">
              Everything is processed privately. We never store personal or banking details.
            </p>
          </div>

          {/* Demo Button */}
          {!isFileType && (
            <button
              onClick={loadDemo}
              className="text-xs font-serif font-bold text-[#854d0e] bg-[#fef3c7] px-3 py-1.5 rounded-full border border-[#fde68a] hover:bg-[#fde68a] transition-colors cursor-pointer whitespace-nowrap"
            >
              Try Demo
            </button>
          )}
        </div>

        {/* File Upload Area */}
        {isFileType ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${
              uploadedFile
                ? 'border-[#86efac] bg-[#f0fdf4]'
                : 'border-[#d6cbba] bg-[#fdfaf7] hover:border-[#b8860b] hover:bg-[#fef9f0]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) { setUploadedFile(f); setResult(null); setError(null); }
              }}
            />
            {uploadedFile ? (
              <div className="space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#16a34a] mx-auto" />
                <p className="font-serif font-bold text-[#14532d]">{uploadedFile.name}</p>
                <p className="text-xs text-[#64748b]">{(uploadedFile.size / 1024).toFixed(1)} KB · Click to change</p>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="w-10 h-10 text-[#b45309] mx-auto" />
                <p className="font-serif font-bold text-[#1e293b]">
                  {activeType === 'qr' ? 'Tap to Upload QR Code Image' : 'Tap to Upload Screenshot'}
                </p>
                <p className="text-xs text-[#64748b]">JPG, PNG, WEBP supported · Max 10MB</p>
              </div>
            )}
          </div>
        ) : (
          /* Text Area */
          <div className="space-y-4">
            <div>
              <label htmlFor="content-input" className="block font-serif text-sm font-bold text-[#1e293b] mb-2">
                {activeType === 'link' ? 'Website URL:' : activeType === 'call' ? 'Caller description or transcript:' : 'Content to verify:'}
              </label>
              <textarea
                id="content-input"
                rows={5}
                value={inputText}
                onChange={(e) => { setInputText(e.target.value); setResult(null); setError(null); }}
                placeholder={
                  activeType === 'message'
                    ? 'e.g. "Dear customer, your bank account will be blocked today due to incomplete KYC. Verify immediately using this link..."'
                    : activeType === 'link'
                    ? 'e.g. https://sbi-kyc-secure.xyz/login'
                    : activeType === 'call'
                    ? 'e.g. "I am calling from CBI. Your Aadhaar is involved in money laundering. Pay Rs. 50,000 to avoid arrest."'
                    : 'Paste or type details here...'
                }
                className="w-full p-4 rounded-2xl border-2 border-[#e8dfcf] focus:border-[#b8860b] focus:ring-4 focus:ring-[#fef3c7] text-[#1e293b] text-base resize-y transition-all outline-none bg-[#fdfbf9] font-sans"
              />
            </div>

            {/* Sender/Caller Info */}
            {(activeType === 'message' || activeType === 'call') && (
              <div>
                <label htmlFor="sender-input" className="block font-serif text-sm font-bold text-[#1e293b] mb-2">
                  {activeType === 'call' ? 'Caller\'s Phone Number (optional):' : 'Sender / Phone Number (optional):'}
                </label>
                <input
                  id="sender-input"
                  type="text"
                  value={senderInfo}
                  onChange={(e) => setSenderInfo(e.target.value)}
                  placeholder={activeType === 'call' ? 'e.g. 9999999999' : 'e.g. VM-SBIBNK or 9876543210'}
                  className="w-full p-3.5 rounded-xl border-2 border-[#e8dfcf] focus:border-[#b8860b] focus:ring-4 focus:ring-[#fef3c7] text-[#1e293b] text-sm outline-none bg-[#fdfbf9] font-sans"
                />
              </div>
            )}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start gap-3 p-4 bg-[#fff1f2] border border-[#fecdd3] rounded-xl">
            <AlertTriangle className="w-5 h-5 text-[#e11d48] shrink-0 mt-0.5" />
            <p className="font-sans text-sm text-[#881337]">{error}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            onClick={() => { setInputText(''); setSenderInfo(''); setUploadedFile(null); setResult(null); setError(null); }}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-[#d6cbba] text-[#57534e] font-serif font-semibold hover:bg-[#faf5ec] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4 text-[#78716c]" />
            <span>{t.actions.clear}</span>
          </button>

          <button
            onClick={handleAnalyze}
            disabled={!canAnalyze || isLoading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-serif font-bold text-base flex items-center justify-center gap-2.5 shadow-md transition-all cursor-pointer ${
              canAnalyze && !isLoading
                ? 'bg-gradient-to-r from-[#0f172a] to-[#1e293b] hover:from-[#1e293b] hover:to-[#334155] text-[#fef9ed] border border-[#d4af37]/40 hover:shadow-lg'
                : 'bg-[#e2d9cd] text-[#a8a29e] cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analysing...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5 text-[#e2b740]" />
                <span>{t.actions.analyzeNow}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results */}
      {result && (
        <div ref={resultRef}>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  );
};
