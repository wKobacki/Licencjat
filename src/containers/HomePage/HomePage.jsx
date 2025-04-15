import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './HomePage.module.css';

const HomePage = ({ userEmail, userBranch, userRole, onLogout }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const branches = Array.isArray(userBranch) ? userBranch : [userBranch];

    const handleLogout = async () => {
        try {
            if (onLogout) await onLogout();
            navigate('/login');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    return (
        <div className={styles.wrapper}>
            <main className={styles.main}>
                <h2>{t('Choose idea exchange')}</h2>
                <div className={styles.branchButtons}>
                    <button onClick={() => navigate('/ideas-exchange')}>Ogólna giełda</button>
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
