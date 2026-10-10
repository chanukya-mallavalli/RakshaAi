import en from './en.json';
import hi from './hi.json';
import te from './te.json';
import type { SupportedLanguage } from '../types';

export const translations = { en, hi, te };

export function getTranslation(lang: SupportedLanguage) {
  return translations[lang] || translations.en;
}
