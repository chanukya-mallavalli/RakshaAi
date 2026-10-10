import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquareText,
  Link2,
  Camera,
  QrCode,
  PhoneCall,
  ShieldCheck,
  ArrowRight,
  Lock,
  Award,
} from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface HomePageProps {
  currentLang: SupportedLanguage;
}

export const HomePage: React.FC<HomePageProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);
  const navigate = useNavigate();

  const actionCards = [
    {
      id: 'message',
      title: t.actions.checkMessage,
      desc: 'Verify suspicious SMS, WhatsApp messages, or emails claiming urgent issues.',
      icon: MessageSquareText,
      accent: 'border-[#3b82f6]/30',
      iconBg: 'from-[#1e3a8a] to-[#172554]',
      badge: 'Frequently Used',
    },
    {
      id: 'link',
      title: t.actions.checkLink,
      desc: 'Paste any website address to inspect authenticity before you click.',
      icon: Link2,
      accent: 'border-[#6366f1]/30',
      iconBg: 'from-[#312e81] to-[#1e1b4b]',
      badge: 'Instant Verification',
    },
    {
      id: 'screenshot',
      title: t.actions.checkScreenshot,
      desc: 'Upload a picture of any suspicious phone screen or message letter.',
      icon: Camera,
      accent: 'border-[#7c3aed]/30',
      iconBg: 'from-[#4c1d95] to-[#2e1065]',
      badge: 'Photo Reader',
    },
    {
      id: 'qr',
      title: t.actions.checkQr,
      desc: 'Inspect payment or website QR codes safely before scanning with UPI.',
      icon: QrCode,
      accent: 'border-[#d97706]/30',
      iconBg: 'from-[#78350f] to-[#451a03]',
      badge: 'UPI & Payment Guard',
    },
    {
      id: 'call',
      title: t.actions.checkCall,
      desc: 'Analyze conversations with callers claiming to be police, bank, or delivery staff.',
      icon: PhoneCall,
      accent: 'border-[#059669]/30',
      iconBg: 'from-[#064e3b] to-[#022c22]',
      badge: 'Caller Safety',
    },
  ];

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section with Classical Stately Typography */}
      <section className="text-center max-w-4xl mx-auto space-y-7 pt-4 pb-2">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#fbf4e8] text-[#854d0e] text-xs sm:text-sm font-semibold border border-[#e5d5be] shadow-xs">
          <Award className="w-4 h-4 text-[#b45309]" />
          <span className="font-serif tracking-wide">{t.tagline}</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-[#0f172a] tracking-tight leading-[1.18]">
          {t.heroTitle}
        </h1>

        <p className="font-serif text-lg sm:text-xl text-[#475569] max-w-2xl mx-auto leading-relaxed italic">
          "{t.heroSubtitle}"
        </p>

        {/* Dignified Safety Seal Notice */}
        <div className="bg-[#fffcf7] border-2 border-[#e7dac7] rounded-3xl p-5 sm:p-6 max-w-2xl mx-auto flex items-center gap-4 text-[#78350f] text-left shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-[#fef3c7] flex items-center justify-center shrink-0 border border-[#f59e0b]/30">
            <Lock className="w-6 h-6 text-[#b45309]" />
          </div>
          <div>
            <span className="text-xs font-serif font-bold tracking-wider text-[#92400e] uppercase">
              Our Safety Promise
            </span>
            <p className="text-sm sm:text-base font-serif font-semibold text-[#451a03] leading-snug mt-0.5">
              {t.elderlyFriendlyNotice}
            </p>
          </div>
        </div>
      </section>

      {/* Main Classical Action Grid */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f172a]">
            Choose a Safety Check Below
          </h2>
          <p className="text-[#64748b] text-base font-serif italic mt-1">
            Tap the card that matches what you received. We explain everything in simple, clear words.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {actionCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => navigate(`/check?type=${card.id}`)}
                className={`group relative flex flex-col items-start p-7 bg-[#ffffff] rounded-3xl border-2 border-[#e8dfcf] hover:border-[#b8860b] hover:shadow-xl transition-all duration-300 text-left cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#d4af37]/40`}
              >
                <div className="w-full flex items-center justify-between mb-5">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center text-[#e2b740] shadow-md group-hover:scale-105 transition-transform border border-[#d4af37]/30`}
                  >
                    <Icon className="w-7 h-7 stroke-[2.2]" />
                  </div>
                  <span className="text-xs font-serif font-semibold px-3 py-1 bg-[#fbf5eb] text-[#854d0e] rounded-full border border-[#eddcc7]">
                    {card.badge}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#0f172a] mb-2 group-hover:text-[#92400e] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[#64748b] text-sm leading-relaxed mb-6 font-sans">
                  {card.desc}
                </p>

                <div className="mt-auto flex items-center text-[#92400e] font-serif font-bold text-sm group-hover:translate-x-1 transition-transform">
                  <span>Open Check</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Classical Reassurance Charter: Detection + Explanation + Action */}
      <section className="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white rounded-3xl p-8 sm:p-12 max-w-6xl mx-auto border-2 border-[#d4af37]/40 shadow-2xl">
        <div className="max-w-3xl mb-8">
          <div className="flex items-center gap-2 text-[#e2b740] font-serif font-bold text-xs tracking-widest uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Digital Protection Charter</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#fef9ed] mt-1.5">
            How RakshaAI Guarantees Peace of Mind
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#ffffff]/5 backdrop-blur-md rounded-2xl p-6 border border-[#e2b740]/20 hover:border-[#e2b740]/40 transition-colors">
            <div className="font-serif text-3xl font-black text-[#e2b740] mb-2">I. Check</div>
            <h4 className="font-serif text-lg font-bold text-white mb-2">Is this safe?</h4>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              We cross-check for high-pressure deadlines, impersonation claims, and known financial fraud signals.
            </p>
          </div>

          <div className="bg-[#ffffff]/5 backdrop-blur-md rounded-2xl p-6 border border-[#e2b740]/20 hover:border-[#e2b740]/40 transition-colors">
            <div className="font-serif text-3xl font-black text-[#fde047] mb-2">II. Explain</div>
            <h4 className="font-serif text-lg font-bold text-white mb-2">Why is it suspicious?</h4>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              No technical cyber jargon. We explain in plain, caring language why someone might be tricking you.
            </p>
          </div>

          <div className="bg-[#ffffff]/5 backdrop-blur-md rounded-2xl p-6 border border-[#e2b740]/20 hover:border-[#e2b740]/40 transition-colors">
            <div className="font-serif text-3xl font-black text-[#6ee7b7] mb-2">III. Guide</div>
            <h4 className="font-serif text-lg font-bold text-white mb-2">What should I do?</h4>
            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              Get immediate, stress-free actions so you and your family can handle it with total confidence.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
