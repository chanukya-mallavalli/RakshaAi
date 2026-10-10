import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ThemeSettings, BackgroundThemeType, PlainVariant } from '../types';

const DEFAULT_THEME: ThemeSettings = {
  bgTheme: 'gradient',
  plainVariant: 'navy',
  animationsEnabled: true,
  threeDEnabled: true,
  bgIntensity: 0.85,
  animationSpeed: 1.0,
  particleDensity: 50,
  bgDimming: 0.55,
  isDark: true,
};

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  resetDefaults: () => void;
  isCustomizerOpen: boolean;
  setIsCustomizerOpen: (isOpen: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('raksha_theme_settings');
      if (saved) {
        return { ...DEFAULT_THEME, ...JSON.parse(saved) };
      }
    } catch {
      // fallback to default
    }

    // Auto-detect reduced-motion
    const prefersReducedMotion = typeof window !== 'undefined' 
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    return {
      ...DEFAULT_THEME,
      animationsEnabled: !prefersReducedMotion,
      threeDEnabled: !prefersReducedMotion,
    };
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('raksha_theme_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (partial: Partial<ThemeSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const resetDefaults = () => {
    setSettings(DEFAULT_THEME);
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        updateSettings,
        resetDefaults,
        isCustomizerOpen,
        setIsCustomizerOpen,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
