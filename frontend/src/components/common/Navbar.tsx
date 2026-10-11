
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  HeartHandshake,
  Globe,
  Activity,
  
} from 'lucide-react';
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

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/check') {
      return (
        location.pathname === '/check' ||
        location.pathname.startsWith('/check/')
      );
    }
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#07111F]/95 text-[#F7FAFF] shadow-lg backdrop-blur-xl">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {/* Main header */}
        <div className="flex min-h-[82px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#42E8F5]"
            aria-label="RakshaAI home"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#42E8F5]/30 bg-gradient-to-br from-[#123047] to-[#111b35] shadow-[0_0_24px_rgba(66,232,245,0.08)] transition-transform duration-300 group-hover:scale-105">
              <ShieldCheck
                className="h-7 w-7 text-[#42E8F5]"
                strokeWidth={2}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                  {t.appName}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold sm:text-xs ${
                    backendOnline
                      ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
                      : 'border-amber-400/25 bg-amber-400/10 text-amber-300'
                  }`}
                  role="status"
                  aria-label={
                    backendOnline
                      ? 'Backend connection active'
                      : 'Backend connection on standby'
                  }
                >
                  <Activity
                    className={`h-3.5 w-3.5 ${
                      backendOnline ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                    aria-hidden="true"
                  />
                  {backendOnline ? 'Active' : 'Standby'}
                </span>
              </div>

              <p className="mt-0.5 text-xs text-[#9EADC5] sm:text-sm">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => {
              const active = isActive(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  aria-current={active ? 'page' : undefined}
                  className={`whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                    active
                      ? 'border border-[#42E8F5]/20 bg-[#42E8F5]/10 text-[#42E8F5]'
                      : 'border border-transparent text-[#C2CDE0] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User controls */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setElderlyMode(!elderlyMode)}
              aria-pressed={elderlyMode}
              aria-label="Toggle senior-friendly reading mode"
              title="Toggle senior-friendly reading mode"
              className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#42E8F5] ${
                elderlyMode
                  ? 'border-[#42E8F5]/40 bg-[#42E8F5]/15 text-[#42E8F5]'
                  : 'border-white/10 bg-white/[0.04] text-[#DCE6F5] hover:bg-white/[0.08]'
              }`}
            >
              <HeartHandshake
                className="h-5 w-5 shrink-0"
                aria-hidden="true"
              />
              <span className="hidden 2xl:inline">Senior Mode</span>
              {elderlyMode && (
                <span className="rounded bg-[#42E8F5]/15 px-1.5 py-0.5 text-xs">
                  ON
                </span>
              )}
            </button>

            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 focus-within:ring-2 focus-within:ring-[#42E8F5]">
              <Globe
                className="h-4 w-4 shrink-0 text-[#42E8F5]"
                aria-hidden="true"
              />
              <span className="sr-only">Select language</span>
              <select
                value={currentLang}
                onChange={(event) =>
                  setLang(event.target.value as SupportedLanguage)
                }
                aria-label="Select language"
                className="max-w-[95px] cursor-pointer bg-transparent py-1 text-sm text-white outline-none sm:max-w-[120px]"
              >
                <option className="bg-[#07111F] text-white" value="en">
                  English
                </option>
                <option className="bg-[#07111F] text-white" value="hi">
                  हिंदी
                </option>
                <option className="bg-[#07111F] text-white" value="te">
                  తెలుగు
                </option>
              </select>
            </label>
          </div>
        </div>

        {/* Tablet navigation: shown only between desktop and mobile layouts */}
        <nav
          className="hidden items-center gap-2 overflow-x-auto border-t border-white/[0.08] py-2 md:flex xl:hidden"
          aria-label="Main navigation"
        >
          {navLinks.map((link) => {
            const active = isActive(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? 'bg-[#42E8F5]/10 text-[#42E8F5]'
                    : 'text-[#C2CDE0] hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile navigation: one horizontally scrollable row */}
        <nav
          className="flex items-center gap-2 overflow-x-auto border-t border-white/[0.08] py-2 md:hidden"
          aria-label="Mobile navigation"
        >
          {navLinks.map((link) => {
            const active = isActive(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                aria-current={active ? 'page' : undefined}
                className={`min-h-10 shrink-0 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-[#42E8F5]/10 text-[#42E8F5]'
                    : 'text-[#C2CDE0] hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
