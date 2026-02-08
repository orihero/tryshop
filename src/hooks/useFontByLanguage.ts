import { useEffect } from 'react';
import { useTranslationStore } from '@/stores/translationStore';

/**
 * Hook that applies the appropriate font class to the document based on current language
 * Uses gothic font for Latin languages (en, uz) and gothic-cyrillic for Cyrillic (ru)
 */
export const useFontByLanguage = () => {
  const language = useTranslationStore((state) => state.language);

  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Remove previous language classes
    htmlElement.classList.remove('lang-en', 'lang-uz', 'lang-ru');
    
    // Add current language class
    htmlElement.classList.add(`lang-${language}`);
  }, [language]);
};
