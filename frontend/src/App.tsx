import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout';
import { HomePage } from './pages/HomePage';
import { CheckPage } from './pages/CheckPage';
import { SafetyCenterPage } from './pages/SafetyCenterPage';
import { HistoryPage } from './pages/HistoryPage';
import { FamilyDashboardPage } from './pages/FamilyDashboardPage';
import type { SupportedLanguage } from './types';
import { fetchHealth } from './services/api';

export function App() {
  const [currentLang, setCurrentLang] = useState<SupportedLanguage>(() => {
    return (localStorage.getItem('raksha_lang') as SupportedLanguage) || 'en';
  });

  const [elderlyMode, setElderlyMode] = useState<boolean>(() => {
    return localStorage.getItem('raksha_elderly_mode') === 'true';
  });

  const [backendOnline, setBackendOnline] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem('raksha_lang', currentLang);
  }, [currentLang]);

  useEffect(() => {
    localStorage.setItem('raksha_elderly_mode', String(elderlyMode));
  }, [elderlyMode]);

  // Check backend health periodically
  useEffect(() => {
    let isMounted = true;
    const checkStatus = async () => {
      try {
        const res = await fetchHealth();
        if (isMounted) setBackendOnline(res.status === 'healthy');
      } catch {
        if (isMounted) setBackendOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <MainLayout
              currentLang={currentLang}
              setLang={setCurrentLang}
              elderlyMode={elderlyMode}
              setElderlyMode={setElderlyMode}
              backendOnline={backendOnline}
            />
          }
        >
          <Route path="/" element={<HomePage currentLang={currentLang} />} />
          <Route path="/check" element={<CheckPage currentLang={currentLang} />} />
          <Route path="/safety-tips" element={<SafetyCenterPage currentLang={currentLang} />} />
          <Route path="/history" element={<HistoryPage currentLang={currentLang} />} />
          <Route path="/family" element={<FamilyDashboardPage currentLang={currentLang} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
