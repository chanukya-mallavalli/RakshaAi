import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Globe, Activity } from 'lucide-react';
import type { SupportedLanguage } from '../../types';
import { getTranslation } from '../../i18n';

interface NavbarProps {
  currentLang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  elderlyMode: boolean;
  setElderlyMode: (val: boolean) => void;
  backendOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLang,
  setLang,
  elderlyMode,
  setElderlyMode,
  backendOnline,
}) => {
  const t = getTranslation(currentLang);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: t.nav.home },
    { to: '/check', label: t.nav.check },
    { to: '/safety-tips', label: t.nav.tips },
    { to: '/history', label: t.nav.history },
    { to: '/family', label: t.nav.family },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fffdfa]/95 backdrop-blur-md border-b border-[#e8e0d2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-22">
          {/* Classical Stately Brand Logo */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-[#b8860b] rounded-2xl p-1.5">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#334155] border border-[#d4af37]/40 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-7 h-7 text-[#e2b740] stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight text-[#0f172a]">
                  {t.appName}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${
                  backendOnline 
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <Activity className="w-3 h-3 mr-1 animate-pulse text-emerald-600" />
                  {backendOnline ? 'Active' : 'Standby'}
                </span>
              </div>
              <p className="text-xs font-serif italic text-[#64748b] tracking-wide">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Navigation Links with Classical Typography */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-xl text-base transition-all ${
                    isActive
                      ? 'bg-[#f4ebe1] text-[#78350f] font-bold shadow-xs border border-[#e5d5c0]'
                      : 'text-[#475569] hover:text-[#0f172a] hover:bg-[#faf4ed]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Controls: Language & Senior-friendly Mode Toggle */}
          <div className="flex items-center gap-3">
            {/* Senior Friendly Mode Button */}
            <button
              onClick={() => setElderlyMode(!elderlyMode)}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all border ${
                elderlyMode
                  ? 'bg-[#fef3c7] text-[#92400e] border-[#f59e0b] shadow-xs'
                  : 'bg-[#faf6ee] text-[#57534e] border-[#e7dec8] hover:bg-[#f5ede0]'
              }`}
              title="Toggle Large Classical Fonts & Easy Reading"
              aria-label="Senior Citizen Easy Reading Mode"
            >
              <HeartHandshake className="w-4 h-4 text-[#dc2626]" />
              <span className="hidden sm:inline font-serif">Senior Mode</span>
              {elderlyMode && <span className="text-xs bg-[#fde68a] text-[#78350f] px-1.5 py-0.5 rounded-md font-extrabold">ON</span>}
            </button>

            {/* Language Selector */}
            <div className="relative flex items-center bg-[#faf6ee] border border-[#e7dec8] rounded-xl px-2.5 py-1.5">
              <Globe className="w-4 h-4 text-[#854d0e] mr-1.5" />
              <select
                value={currentLang}
                onChange={(e) => setLang(e.target.value as SupportedLanguage)}
                className="bg-transparent text-sm font-semibold text-[#1c1917] py-0.5 pr-1 outline-none cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#ede5d8]">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm py-1.5 px-2.5 font-serif rounded-lg ${
                  isActive ? 'text-[#78350f] font-bold bg-[#f4ebe1]' : 'text-[#64748b]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
};
