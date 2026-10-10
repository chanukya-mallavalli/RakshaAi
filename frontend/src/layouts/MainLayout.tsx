import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import type { SupportedLanguage } from '../types';

interface MainLayoutProps {
  currentLang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
  elderlyMode: boolean;
  setElderlyMode: (val: boolean) => void;
  backendOnline: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  currentLang,
  setLang,
  elderlyMode,
  setElderlyMode,
  backendOnline,
}) => {
  return (
    <div className={`min-h-screen flex flex-col bg-[#fcfaf6] text-[#1c1917] ${elderlyMode ? 'elderly-mode' : ''}`}>
      <Navbar
        currentLang={currentLang}
        setLang={setLang}
        elderlyMode={elderlyMode}
        setElderlyMode={setElderlyMode}
        backendOnline={backendOnline}
      />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <Footer currentLang={currentLang} />
    </div>
  );
};
