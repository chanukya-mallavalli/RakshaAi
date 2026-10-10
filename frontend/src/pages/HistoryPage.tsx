import { History, Trash2 } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface HistoryPageProps {
  currentLang: SupportedLanguage;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
            {t.nav.history}
          </h1>
          <p className="font-serif italic text-[#64748b] text-sm sm:text-base mt-1">
            Privacy Protected: We only record timestamps and risk scores. Private message content is never stored permanently.
          </p>
        </div>
        <button
          onClick={() => alert('No past checks recorded currently.')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#d6cbba] text-[#57534e] text-sm font-serif font-bold hover:bg-[#faf5ec] transition-colors w-fit cursor-pointer"
        >
          <Trash2 className="w-4 h-4 text-[#78716c]" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="bg-[#ffffff] rounded-3xl border-2 border-[#e8dfcf] p-10 text-center space-y-4 shadow-md">
        <div className="w-16 h-16 rounded-2xl bg-[#fdf8f0] text-[#b45309] border border-[#e5d5be] flex items-center justify-center mx-auto">
          <History className="w-8 h-8" />
        </div>
        <h3 className="font-serif text-2xl font-bold text-[#0f172a]">No Prior Inspections Recorded</h3>
        <p className="text-[#64748b] text-sm max-w-md mx-auto font-serif italic">
          When you perform a safety verification on a message, link or QR code, its privacy-safe result summary will be recorded here for your reference.
        </p>
      </div>
    </div>
  );
};
