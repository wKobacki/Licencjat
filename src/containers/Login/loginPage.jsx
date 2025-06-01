import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/AuthApi/authApi';
import styles from './loginPage.module.css';
import { useTranslation } from 'react-i18next';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            if (data) {
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userBranch', data.user.branch);
                navigate('/homePage');
                window.location.reload();
            } else {
                setError(t('Login failed'));
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(t('Login error'));
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2>{t('Log in')}</h2>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <input
                    type="email"
                    placeholder={t('Email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder={t('Password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className={styles.errorText}>{error}</p>}
                <button type="submit">{t('Log in')}</button>
            </form>
            <p className={styles.linkText}>
                {t("Don't have an account?")} <span onClick={() => navigate('/register')}>{t('Register')}</span>
            </p>
            <p className={styles.linkText}>
                {t('Forgot your password?')} <span onClick={() => navigate('/reset-password')}>{t('Restore it')}</span>
            </p>
        </div>
    );
};

export default Login;
