// src/components/MenuBar/MenuBar.jsx
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './MenuBar.module.css';
import logo from '../../assets/images/comingsoon.png';
import polandFlag from '../../assets/images/Poland.png';
import ukFlag from '../../assets/images/UK.png';
import ukraineFlag from '../../assets/images/UKR.jpg';
import { LanguageContext } from '../../i18n/contexts/LanguageContext';

const MenuBar = ({ userRole, onLogout }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { flag, changeLanguage } = useContext(LanguageContext);

    return (
        <div className={styles.headerWrapper}>
            <header className={styles.header}>
                <img src={logo} alt="Logo" className={styles.logo} />
                <div className={styles.languageSelector}>
                    <img src={flag} alt="Current Language" />
                    <div className={styles.languageDropdown}>
                        <img src={polandFlag} alt="PL" onClick={() => changeLanguage('pl')} />
                        <img src={ukFlag} alt="EN" onClick={() => changeLanguage('en')} />
                        <img src={ukraineFlag} alt="UA" onClick={() => changeLanguage('ua')} />
                    </div>
                </div>
            </header>

            <nav className={styles.nav}>
                <div className={styles.navLeft}>
                    <button onClick={() => navigate('/HomePage')}>{t('Department')}</button>
                    <button onClick={() => navigate('/improvementsChart')}>{t('Chart')}</button>
                    {(userRole === 'manager' || userRole ==='admin') && (
                        <button onClick={() => navigate('/admin/ideas')}>{t('Manage Ideas')}</button>
                    )}
                    {userRole === 'admin' && (
                        <button onClick={() => navigate('/admin/users')}>{t('Manage Users')}</button>
                    )}
                </div>
                <div className={styles.navRight}>
                    <button onClick={() => navigate('/changePas')}>{t('Change password')}</button>
                    <button onClick={onLogout}>{t('Logout')}</button>
                </div>
            </nav>
        </div>
    );
};

export default MenuBar;
