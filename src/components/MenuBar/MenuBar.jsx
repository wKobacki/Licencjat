import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './MenuBar.module.css';
import polandFlag from '../../assets/images/Poland.png';
import ukFlag from '../../assets/images/UK.png';
import { LanguageContext } from '../../i18n/contexts/LanguageContext';

const MenuBar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { flag, changeLanguage } = useContext(LanguageContext);

    const userRole = localStorage.getItem('userRole');
    const isLoggedIn = !!userRole;

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <div className={styles.headerWrapper}>
            <header className={styles.header}>
                <div className={styles.title}>IDEAS STOCK</div>

                <div className={styles.languageContainer}>
                    <div className={styles.languageWrapper}>
                        <button className={styles.languageButton} tabIndex={0}>
                            <img src={flag} alt="Current Language" />
                        </button>
                        <div className={styles.languageDropdown}>
                            <img src={polandFlag} alt="PL" onClick={() => changeLanguage('pl')} />
                            <img src={ukFlag} alt="EN" onClick={() => changeLanguage('en')} />
                        </div>
                    </div>
                </div>
            </header>

            {isLoggedIn && (
                <nav className={styles.nav}>
                    <div className={styles.navLeft}>
                        <button onClick={() => navigate('/HomePage')}>
                            {t('Departments')}
                        </button>

                        {(userRole === 'manager' || userRole === 'admin') && (
                            <button onClick={() => navigate('/admin/ideas-management')}>
                                {t('Manage Ideas')}
                            </button>
                        )}

                        {userRole === 'admin' && (
                            <button onClick={() => navigate('/admin/users')}>
                                {t('Manage Users')}
                            </button>
                        )}
                    </div>

                    <div className={styles.navRight}>
                        <button onClick={() => navigate('/ForgotPassword')}>
                            {t('Change password')}
                        </button>
                        <button onClick={handleLogout}>
                            {t('Logout')}
                        </button>
                    </div>
                </nav>
            )}
        </div>
    );
};

export default MenuBar;