import React from 'react';
import { UserPlus, HeartHandshake, BellRing } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface FamilyDashboardPageProps {
  currentLang: SupportedLanguage;
}

export const FamilyDashboardPage: React.FC<FamilyDashboardPageProps> = ({
  currentLang,
}) => {
  const t = getTranslation(currentLang);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#f5f8ff] sm:text-4xl">
            {t.nav.family}
          </h1>

          <p className="mt-1 font-serif text-sm italic leading-relaxed text-[#a9b9d4] sm:text-base">
            Connect trusted loved ones (son, daughter, caregiver) so you can
            seek their advice or alert them with 1 tap if danger is detected.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            alert('Add Trusted Contact modal will activate in Phase 8.')
          }
          className="flex w-fit cursor-pointer items-center gap-2.5 rounded-xl border border-amber-400/30 bg-gradient-to-r from-[#0b1c36] to-[#142b4a] px-6 py-3 font-serif text-sm font-bold text-white shadow-md transition-colors hover:from-[#142b4a] hover:to-[#1d3a5e]"
        >
          <UserPlus className="h-4 w-4 text-amber-300" />
          <span>Add Trusted Loved One</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-3.5 rounded-3xl border border-white/10 bg-[#0b1c36] p-7 shadow-lg shadow-black/20">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
            <HeartHandshake className="h-7 w-7" />
          </div>

          <h3 className="font-serif text-xl font-bold leading-snug text-white">
            Never Face Scammers Alone
          </h3>

          <p className="font-sans text-sm leading-relaxed text-[#c1cee2]">
            Whenever high scam danger is detected, RakshaAI prepares a clear,
            respectful summary message ready to be sent to your family circle.
          </p>
        </div>

        <div className="space-y-3.5 rounded-3xl border border-white/10 bg-[#0b1c36] p-7 shadow-lg shadow-black/20">
          <div className="flex h-13 w-13 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
            <BellRing className="h-7 w-7" />
          </div>

          <h3 className="font-serif text-xl font-bold leading-snug text-white">
            Strict Consent &amp; Privacy
          </h3>

          <p className="font-sans text-sm leading-relaxed text-[#c1cee2]">
            RakshaAI never notifies anyone automatically without your deliberate
            consent. You always retain total decision-making dignity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FamilyDashboardPage;