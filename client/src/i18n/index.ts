import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ja from './locales/ja.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ja: { translation: ja },
      en: { translation: en },
    },
    // Language detection order: browser navigator language → fallback
    detection: {
      order: ['navigator', 'htmlTag'],
      caches: [],
    },
    fallbackLng: 'en',
    supportedLngs: ['ja', 'en'],
    interpolation: {
      escapeValue: false, // React already escapes
    },
  });

export default i18n;
