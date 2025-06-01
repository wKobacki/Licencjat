import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './HomePage.module.css';

const HomePage = ({ onLogout }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const userBranch = localStorage.getItem('userBranch');
    const branches = Array.isArray(userBranch) ? userBranch : [userBranch];

    return (
        <div className={styles.wrapper}>
            <main className={styles.main}>
                <h2>{t('Choose stock idea')}</h2>
                <div className={styles.branchButtons}>
                    <button onClick={() => navigate('/IdeasExchange')}>
                        {t('General stock')}
                    </button>
                    {branches.map(branch => (
                        <button key={branch} onClick={() => navigate(`/myIdeas`)}>
                            {branch}
                        </button>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default HomePage;
