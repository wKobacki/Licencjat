import React, { createContext, useState, useEffect } from 'react';
import i18n from '../i18n';
import polandFlag from '../../assets/images/Poland.png';
import ukFlag from '../../assets/images/UK.png';

export const LanguageContext = createContext();

const languageMap = {
    pl: polandFlag,
    en: ukFlag,
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(i18n.language || 'pl');

    const changeLanguage = (lng) => {
        setLang(lng);
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        const onLangChanged = (lng) => setLang(lng);
        i18n.on('languageChanged', onLangChanged);
        return () => i18n.off('languageChanged', onLangChanged);
    }, []);

    const flag = languageMap[lang];

    return (
        <LanguageContext.Provider value={{ lang, flag, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
