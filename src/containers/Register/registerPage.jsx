import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/AuthApi/registerApi';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const RegisterPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        surname: '',
        branch: 'Warszawa',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const validatePassword = (password) => ({
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
    });

    const passwordChecks = validatePassword(formData.password);
    const passwordsMatch =
        formData.password === formData.confirmPassword &&
        formData.password !== '' &&
        formData.confirmPassword !== '';

    const renderCheck = (valid) =>
        valid ? <CheckCircle className={styles.validIcon} /> : <Cancel className={styles.invalidIcon} />;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allValid = Object.values(passwordChecks).every(Boolean);

        if (!allValid || !passwordsMatch) {
            setError(t('Password does not meet requirements or does not match.'));
            return;
        }

        try {
            const res = await registerUser(formData);
            if (res.message?.includes('Rejestracja zakończona')) {
                navigate('/verify-email', { state: { email: formData.email } });
            } else {
                setError(res.message || t('Registration failed.'));
            }
        } catch (err) {
            console.error('Błąd rejestracji:', err);
            setError(t('An error occurred during registration.'));
        }
    };

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <h2>{t('Register')}</h2>

                <input
                    type="email"
                    name="email"
                    placeholder={t('Email')}
                    required
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="name"
                    placeholder={t('First name')}
                    required
                    value={formData.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="surname"
                    placeholder={t('Last name')}
                    required
                    value={formData.surname}
                    onChange={handleChange}
                />

                <select name="branch" value={formData.branch} onChange={handleChange}>
                    <option value="Warszawa">{t('Warsaw')}</option>
                    <option value="Łódź">{t('Łódź')}</option>
                    <option value="Kraków">{t('Kraków')}</option>
                    <option value="Gdańsk">{t('Gdańsk')}</option>
                </select>

                <input
                    type="password"
                    name="password"
                    placeholder={t('Password')}
                    required
                    value={formData.password}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder={t('Confirm password')}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                />

                <ul className={styles.passwordHints}>
                    <li>{renderCheck(passwordChecks.length)} {t('Min. 8 characters')}</li>
                    <li>{renderCheck(passwordChecks.upper)} {t('One uppercase letter')}</li>
                    <li>{renderCheck(passwordChecks.lower)} {t('One lowercase letter')}</li>
                    <li>{renderCheck(passwordChecks.digit)} {t('One digit')}</li>
                    <li>{renderCheck(passwordChecks.special)} {t('One special character')}</li>
                    <li>{renderCheck(passwordsMatch)} {t('Passwords match')}</li>
                </ul>

                {error && <p className={styles.errorText}>{error}</p>}

                <button type="submit">{t('Register')}</button>

                <p className={styles.linkText}>
                    {t('Already have an account?')}{' '}
                    <span onClick={() => navigate('/')}>{t('Log in')}</span>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
