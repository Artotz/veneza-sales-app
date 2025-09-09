import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './languages/en';
import es from './languages/es';
import pt from './languages/pt';

const resources = {
  pt,
  // en,
  // es,
};

// Detecta idioma do sistema
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: (cb: (lang: string) => void) => {
    const locales = RNLocalize.getLocales();
    cb(locales[0]?.languageCode || 'en');
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    // compatibilityJSON: 'v3',
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
