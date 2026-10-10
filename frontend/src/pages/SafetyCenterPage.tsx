import React from 'react';
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface SafetyCenterPageProps {
  currentLang: SupportedLanguage;
}

export const SafetyCenterPage: React.FC<SafetyCenterPageProps> = ({ currentLang }) => {
  const t = getTranslation(currentLang);

  const guides = [
    {
      title: 'Fake KYC & Bank Account Freeze Warnings',
      category: 'Bank Impersonation',
      redFlags: ['Threats of immediate account blockage', 'Demands to share OTP over phone call or SMS link', 'Unofficial SMS shortcodes'],
      dos: ['Visit your physical bank branch in person', 'Call the official customer care number printed on your debit card'],
      donts: ['Never click links inside SMS regarding KYC verification', 'Never install any screen-sharing application like AnyDesk or TeamViewer'],
    },
    {
      title: 'Electricity & Utility Disconnection Threats',
      category: 'Utility Scam',
      redFlags: ['Claims electricity will be cut off tonight', 'Instructs to call a personal 10-digit mobile number', 'Demands a small immediate bill verification payment'],
      dos: ['Check your official electricity bill or official portal', 'Pay only through official authorized payment counters'],
      donts: ['Never call the personal phone number received in the text', 'Do not make urgent transfers to personal UPI IDs'],
    },
    {
      title: 'Lottery, Rewards & Unsolicited Prizes',
      category: 'Lottery Scheme',
      redFlags: ['Claims you won a lucky draw you never participated in', 'Demands processing fees or custom clearance charges upfront'],
      dos: ['Immediately delete and disregard such messages', 'Discuss with trusted children or family members'],
      donts: ['Never pay money to claim a prize or award', 'Never forward copies of Aadhaar, PAN card, or bank passbooks'],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f172a] tracking-tight">
          {t.nav.tips}
        </h1>
        <p className="font-serif italic text-[#64748b] text-base sm:text-lg">
          Clear, honorable advice on recognizing scam traps and preserving financial peace of mind.
        </p>
      </div>

      <div className="space-y-6">
        {guides.map((guide, idx) => (
          <div key={idx} className="bg-[#ffffff] rounded-3xl border-2 border-[#e8dfcf] p-7 sm:p-9 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-[#f3eee5] pb-4">
              <span className="font-serif text-xs font-bold uppercase tracking-wider text-[#78350f] bg-[#fbf5eb] px-3.5 py-1.5 rounded-full border border-[#eddcc7]">
                {guide.category}
              </span>
              <BookOpen className="w-5 h-5 text-[#b45309]" />
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0f172a]">{guide.title}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              <div className="bg-[#fff1f2] border border-[#fecdd3] p-5 rounded-2xl space-y-2.5">
                <h4 className="font-serif text-sm font-bold text-[#881337] flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-[#e11d48]" />
                  Scam Red Flags to Watch For
                </h4>
                <ul className="text-xs sm:text-sm text-[#4c0519] space-y-2 list-disc list-inside font-sans">
                  {guide.redFlags.map((rf, rIdx) => (
                    <li key={rIdx}>{rf}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-5 rounded-2xl space-y-2.5">
                <h4 className="font-serif text-sm font-bold text-[#14532d] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                  What You Should Do
                </h4>
                <ul className="text-xs sm:text-sm text-[#052e16] space-y-2 list-disc list-inside font-sans">
                  {guide.dos.map((d, dIdx) => (
                    <li key={dIdx}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
