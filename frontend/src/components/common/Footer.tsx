import React from 'react';
import { ShieldCheck, PhoneCall, Lock, Heart, Award } from 'lucide-react';
import type { SupportedLanguage } from '../../types';
import { getTranslation } from '../../i18n';

interface FooterProps {
  currentLang: SupportedLanguage;
}

export const Footer: React.FC<FooterProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);

  return (
    <footer className="bg-[#0b1329] text-slate-300 mt-24 border-t-2 border-[#d4af37]/40 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Classical Brand & Purpose */}
          <div>
            <div className="flex items-center gap-3 mb-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1e293b] to-[#0f172a] border border-[#d4af37]/40 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-6 h-6 text-[#e2b740]" />
              </div>
              <span className="font-serif text-2xl font-bold text-[#fef9ed] tracking-tight">{t.appName}</span>
            </div>
            <p className="font-serif text-sm text-slate-400 mb-5 leading-relaxed italic">
              "{t.heroSubtitle}"
            </p>
            <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-[#162038] p-3.5 rounded-2xl border border-[#d4af37]/20">
              <Lock className="w-4 h-4 text-[#e2b740] shrink-0" />
              <span className="font-sans">Privacy Principle: We strictly do not store passwords, OTPs, PINs, or financial credentials.</span>
            </div>
          </div>

          {/* Emergency Safety Helplines */}
          <div className="bg-[#131d36] p-6 rounded-3xl border border-[#d4af37]/25 shadow-lg">
            <h4 className="font-serif text-base font-bold text-[#fef9ed] mb-2 flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#e2b740]" />
              Need Urgent Help?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 mb-4 font-sans">
              If you suspect you have fallen victim to financial fraud, act without delay:
            </p>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between bg-[#0b1329] px-4 py-3 rounded-xl border border-slate-700/80">
                <span className="text-xs font-serif text-slate-300">National Cybercrime Helpline</span>
                <span className="font-serif text-lg font-extrabold text-[#e2b740]">1930</span>
              </div>
              <div className="flex items-center justify-between bg-[#0b1329] px-4 py-3 rounded-xl border border-slate-700/80">
                <span className="text-xs font-serif text-slate-300">Official Portal</span>
                <span className="text-xs font-bold text-sky-400">cybercrime.gov.in</span>
              </div>
            </div>
          </div>

          {/* Reassurance & Golden Safety Rule */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-bold text-[#fef9ed] flex items-center gap-2">
              <Award className="w-4 h-4 text-[#e2b740]" />
              The Golden Safety Rule
            </h4>
            <div className="bg-[#1a2542] border border-[#d4af37]/30 p-5 rounded-3xl">
              <p className="font-serif text-sm text-[#fef3c7] font-medium leading-relaxed italic">
                "No genuine bank, police officer, or government official will ever ask you to share an OTP or make urgent payments to prevent an account freeze."
              </p>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 pt-1 font-serif">
              Built with <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" /> for family dignity & elderly security.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 text-center font-serif text-xs text-slate-500 tracking-wide">
          © 2026 RakshaAI. All rights reserved. Pause. Check. Stay Safe.
        </div>
      </div>
    </footer>
  );
};
