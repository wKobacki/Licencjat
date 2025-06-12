import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pl from './locales/pl.json';
import en from './locales/en.json';

const resources = {
    pl: { translation: pl },
    en: { translation: en },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: localStorage.getItem('i18nextLng') || 'pl', 
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
