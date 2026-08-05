import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from '../public/locales/es/translation.json';
import en from '../public/locales/en/translation.json';
import pt from '../public/locales/pt/translation.json';
import fr from '../public/locales/fr/translation.json';
import de from '../public/locales/de/translation.json';
import zh from '../public/locales/zh/translation.json';
import ja from '../public/locales/ja/translation.json';

const resources = {
  es: { translation: es },
  en: { translation: en },
  pt: { translation: pt },
  fr: { translation: fr },
  de: { translation: de },
  zh: { translation: zh },
  ja: { translation: ja }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'pt', 'fr', 'de', 'zh', 'ja'],
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
