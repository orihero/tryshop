import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import enTranslations from '@/locales/en.json';
import uzTranslations from '@/locales/uz.json';
import ruTranslations from '@/locales/ru.json';

export type Language = 'en' | 'uz' | 'ru';

// Load translations
const translations: Record<Language, Record<string, string>> = {
  en: enTranslations,
  uz: uzTranslations,
  ru: ruTranslations,
};

interface TranslationState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Get initial language from localStorage or browser
const getInitialLanguage = (): Language => {
  const saved = localStorage.getItem('language') as Language;
  if (saved && ['en', 'uz', 'ru'].includes(saved)) {
    return saved;
  }
  // Default to Russian
  return 'ru';
};

export const useTranslationStore = create<TranslationState>()(
  persist(
    (set, get) => ({
      language: getInitialLanguage(),
      setLanguage: (lang: Language) => {
        set({ language: lang });
      },
      t: (key: string) => {
        const { language } = get();
        return translations[language]?.[key] || key;
      },
    }),
    {
      name: 'translation-storage',
      partialize: (state) => ({ language: state.language }),
    }
  )
);
