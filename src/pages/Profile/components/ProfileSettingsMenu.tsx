import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  IoPersonOutline,
  IoLanguageOutline,
  IoNotificationsOutline,
  IoChevronForward,
} from 'react-icons/io5';
import { useTranslation } from '@/hooks/useTranslation';
import type { Language } from '@/stores/translationStore';

const NOTIFICATIONS_STORAGE_KEY = 'profile-notifications-enabled';

function getNotificationsEnabled(): boolean {
  try {
    const val = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    return val === 'true';
  } catch {
    return true;
  }
}

function setNotificationsEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, String(enabled));
  } catch {
    // ignore
  }
}

interface ProfileSettingsMenuProps {
  onProfileSettingsClick?: () => void;
}

const ProfileSettingsMenu = ({ onProfileSettingsClick }: ProfileSettingsMenuProps) => {
  const { t, language, setLanguage } = useTranslation();
  const [notificationsEnabled, setNotificationsEnabledState] = useState(
    getNotificationsEnabled
  );
  const [languagePickerOpen, setLanguagePickerOpen] = useState(false);

  const handleNotificationsToggle = () => {
    const next = !notificationsEnabled;
    setNotificationsEnabledState(next);
    setNotificationsEnabled(next);
  };

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang);
    setLanguagePickerOpen(false);
  };

  const languageLabels: Record<Language, string> = {
    en: 'English',
    uz: "O'zbekcha",
    ru: 'Русский',
  };

  const menuItemClass = 'rounded-xl bg-white/90 shadow-sm overflow-hidden';

  return (
    <div className="space-y-3">
      {/* Profile settings */}
      <div className={menuItemClass}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={onProfileSettingsClick}
          className="w-full flex items-center justify-between px-4 py-3.5 gap-3"
        >
          <div className="flex items-center gap-3">
            <IoPersonOutline className="text-xl text-gray-600" />
            <span className="text-gray-800 font-medium">
              {t('profileSettings')}
            </span>
          </div>
          <IoChevronForward className="text-gray-400" />
        </motion.button>
      </div>

      {/* Language settings */}
      <div className={menuItemClass}>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setLanguagePickerOpen(!languagePickerOpen)}
          className="w-full flex items-center justify-between px-4 py-3.5 gap-3"
        >
          <div className="flex items-center gap-3">
            <IoLanguageOutline className="text-xl text-gray-600" />
            <span className="text-gray-800 font-medium">
              {t('languageSettings')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">{languageLabels[language]}</span>
            <IoChevronForward
              className={`text-gray-400 transition-transform ${
                languagePickerOpen ? 'rotate-90' : ''
              }`}
            />
          </div>
        </motion.button>
        {languagePickerOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-gray-200/50 px-4 py-2 space-y-1"
          >
            {(['en', 'uz', 'ru'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageSelect(lang)}
                className={`w-full text-left py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  language === lang
                    ? 'bg-blue-500/20 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Notification settings (bottom) */}
      <div className={menuItemClass}>
        <div className="flex items-center justify-between px-4 py-3.5 w-full gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <IoNotificationsOutline className="text-xl text-gray-600 flex-shrink-0" />
            <span className="text-gray-800 font-medium">
              {t('notificationSettings')}
            </span>
          </div>
          <button
            role="switch"
            aria-checked={notificationsEnabled}
            onClick={handleNotificationsToggle}
            className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ml-2 ${
              notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <motion.span
              layout
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-5 h-5 rounded-full bg-white shadow"
              style={{ left: notificationsEnabled ? 26 : 4 }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettingsMenu;
