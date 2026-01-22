import { createContext, useContext, useState, ReactNode } from 'react';
import enTranslations from '@/locales/en.json';
import uzTranslations from '@/locales/uz.json';
import ruTranslations from '@/locales/ru.json';

type Language = 'en' | 'uz' | 'ru';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

// Load translations
const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  uz: uzTranslations,
  ru: ruTranslations,
};

export const TranslationProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage, default to browser language or 'en'
    const saved = localStorage.getItem('language') as Language;
    if (saved && ['en', 'uz', 'ru'].includes(saved)) {
      return saved;
    }
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'ru') return 'ru';
    if (browserLang === 'uz') return 'uz';
    return 'en';
  });

  const t = (key: string): string => {
    return translations[language]?.[key] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within TranslationProvider');
  }
  return context;
};
