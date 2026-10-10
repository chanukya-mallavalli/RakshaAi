import { UserPlus, HeartHandshake, BellRing } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface FamilyDashboardPageProps {
  currentLang: SupportedLanguage;
}

export const FamilyDashboardPage: React.FC<FamilyDashboardPageProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
            {t.nav.family}
          </h1>
          <p className="font-serif italic text-[#64748b] text-sm sm:text-base mt-1">
            Connect trusted loved ones (son, daughter, caregiver) so you can seek their advice or alert them with 1 tap if danger is detected.
          </p>
        </div>
        <button
          onClick={() => alert('Add Trusted Contact modal will activate in Phase 8.')}
          className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#0f172a] to-[#1e293b] hover:from-[#1e293b] hover:to-[#334155] text-[#fef9ed] border border-[#d4af37]/40 text-sm font-serif font-bold shadow-md w-fit cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#e2b740]" />
          <span>Add Trusted Loved One</span>
        </button>
      </div>

      {/* Classical Reassurance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#ffffff] rounded-3xl border-2 border-[#e8dfcf] p-7 shadow-md space-y-3.5">
          <div className="w-13 h-13 rounded-2xl bg-[#fdf8f0] border border-[#eddcc7] text-[#b45309] flex items-center justify-center">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#0f172a]">Never Face Scammers Alone</h3>
          <p className="text-sm text-[#57534e] leading-relaxed font-sans">
            Whenever high scam danger is detected, RakshaAI prepares a clear, respectful summary message ready to be sent to your family circle.
          </p>
        </div>

        <div className="bg-[#ffffff] rounded-3xl border-2 border-[#e8dfcf] p-7 shadow-md space-y-3.5">
          <div className="w-13 h-13 rounded-2xl bg-[#f0fdf4] border border-[#bbf7d0] text-[#15803d] flex items-center justify-center">
            <BellRing className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#0f172a]">Strict Consent & Privacy</h3>
          <p className="text-sm text-[#57534e] leading-relaxed font-sans">
            RakshaAI never notifies anyone automatically without your deliberate consent. You always retain total decision-making dignity.
          </p>
        </div>
      </div>
    </div>
  );
};
