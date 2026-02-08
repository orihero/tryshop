import { useTranslationStore } from '@/stores/translationStore';

export const useTranslation = () => {
  const language = useTranslationStore((state) => state.language);
  const setLanguage = useTranslationStore((state) => state.setLanguage);
  const t = useTranslationStore((state) => state.t);

  return {
    language,
    setLanguage,
    t,
  };
};
