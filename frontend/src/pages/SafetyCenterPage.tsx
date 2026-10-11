import React from 'react';
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import type { SupportedLanguage } from '../types';
import { getTranslation } from '../i18n';

interface SafetyCenterPageProps {
  currentLang: SupportedLanguage;
}

export const SafetyCenterPage: React.FC<SafetyCenterPageProps> = ({
  currentLang,
}) => {
  const t = getTranslation(currentLang);

  const guides = [
    {
      title: 'Fake KYC & Bank Account Freeze Warnings',
      category: 'Bank Impersonation',
      redFlags: [
        'Threats of immediate account blockage',
        'Demands to share OTP over phone call or SMS link',
        'Unofficial SMS shortcodes',
      ],
      dos: [
        'Visit your physical bank branch in person',
        'Call the official customer care number printed on your debit card',
      ],
      donts: [
        'Never click links inside SMS regarding KYC verification',
        'Never install any screen-sharing application like AnyDesk or TeamViewer',
      ],
    },
    {
      title: 'Electricity & Utility Disconnection Threats',
      category: 'Utility Scam',
      redFlags: [
        'Claims electricity will be cut off tonight',
        'Instructs to call a personal 10-digit mobile number',
        'Demands a small immediate bill verification payment',
      ],
      dos: [
        'Check your official electricity bill or official portal',
        'Pay only through official authorized payment counters',
      ],
      donts: [
        'Never call the personal phone number received in the text',
        'Do not make urgent transfers to personal UPI IDs',
      ],
    },
    {
      title: 'Lottery, Rewards & Unsolicited Prizes',
      category: 'Lottery Scheme',
      redFlags: [
        'Claims you won a lucky draw you never participated in',
        'Demands processing fees or custom clearance charges upfront',
      ],
      dos: [
        'Immediately delete and disregard such messages',
        'Discuss with trusted children or family members',
      ],
      donts: [
        'Never pay money to claim a prize or award',
        'Never forward copies of Aadhaar, PAN card, or bank passbooks',
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-6">
      <div className="space-y-2 text-center">
        <h1 className="font-serif text-3xl font-bold tracking-tight text-[#f5f8ff] sm:text-4xl">
          {t.nav.tips}
        </h1>
        <p className="font-serif text-base italic text-[#a9b9d4] sm:text-lg">
          Clear, honorable advice on recognizing scam traps and preserving financial peace of mind.
        </p>
      </div>

      <div className="space-y-6">
        {guides.map((guide, idx) => (
          <div
            key={idx}
            className="space-y-5 rounded-3xl border border-white/10 bg-[#0b1c36] p-7 shadow-lg shadow-black/20 sm:p-9"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-1.5 font-serif text-xs font-bold uppercase tracking-wider text-amber-300">
                {guide.category}
              </span>
              <BookOpen className="h-5 w-5 text-amber-400" />
            </div>

            <h3 className="font-serif text-xl font-bold leading-snug text-white sm:text-2xl">
              {guide.title}
            </h3>

            <div className="grid grid-cols-1 gap-5 pt-2 md:grid-cols-2">
              <div className="space-y-2.5 rounded-2xl border border-rose-400/30 bg-rose-500/10 p-5">
                <h4 className="flex items-center gap-2 font-serif text-sm font-bold text-rose-300">
                  <XCircle className="h-4 w-4 text-rose-400" />
                  Scam Red Flags to Watch For
                </h4>

                <ul className="list-inside list-disc space-y-2 font-sans text-xs leading-relaxed text-rose-100 sm:text-sm">
                  {guide.redFlags.map((rf, rIdx) => (
                    <li key={rIdx}>{rf}</li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2.5 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-5">
                <h4 className="flex items-center gap-2 font-serif text-sm font-bold text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  What You Should Do
                </h4>

                <ul className="list-inside list-disc space-y-2 font-sans text-xs leading-relaxed text-emerald-100 sm:text-sm">
                  {guide.dos.map((item, dIdx) => (
                    <li key={dIdx}>{item}</li>
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

export default SafetyCenterPage;