import React from 'react';
import { History, Trash2 } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface HistoryPageProps {
  currentLang: SupportedLanguage;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  currentLang,
}) => {
  const t = getTranslation(currentLang);

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#f5f8ff] sm:text-4xl">
            {t.nav.history}
          </h1>

          <p className="mt-1 font-serif text-sm italic leading-relaxed text-[#a9b9d4] sm:text-base">
            Privacy Protected: We only record timestamps and risk scores.
            Private message content is never stored permanently.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            alert('History clearing is not connected yet.')
          }
          className="flex w-fit cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-[#0b1c36] px-5 py-2.5 font-serif text-sm font-bold text-[#f5f8ff] transition-colors hover:bg-[#142b4a]"
        >
          <Trash2 className="h-4 w-4 text-rose-300" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="space-y-4 rounded-3xl border border-white/10 bg-[#0b1c36] p-8 text-center shadow-lg shadow-black/20 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
          <History className="h-8 w-8" />
        </div>

        <h3 className="font-serif text-xl font-bold text-white sm:text-2xl">
          No Prior Inspections Recorded
        </h3>

        <p className="mx-auto max-w-md font-serif text-sm italic leading-relaxed text-[#a9b9d4]">
          When you perform a safety verification on a message, link or QR code,
          its privacy-safe result summary can appear here once history saving
          is connected.
        </p>
      </div>
    </div>
  );
};

export default HistoryPage;