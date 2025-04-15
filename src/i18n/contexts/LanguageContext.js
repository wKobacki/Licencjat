// src/contexts/LanguageContext.js
import React, { createContext, useState } from 'react';
import i18n from '../i18n';
import polandFlag from '../../assets/images/Poland.png';
import ukFlag from '../../assets/images/UK.png';
import ukraineFlag from '../../assets/images/UKR.jpg';

export const LanguageContext = createContext();

const languageMap = {
    pl: polandFlag,
    en: ukFlag,
    ua: ukraineFlag
};

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('pl');

    const changeLanguage = (lng) => {
        setLang(lng);
        i18n.changeLanguage(lng);
    };

    const flag = languageMap[lang];

    return (
        <LanguageContext.Provider value={{ lang, flag, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};
