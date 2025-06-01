import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmailCode } from '../../api/AuthApi/registerApi';
import styles from './VerifyEmail.module.css';
import { useTranslation } from 'react-i18next';

const VerifyEmail = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !code) {
            setError(t('Enter the code and make sure the email is provided.'));
            return;
        }

        try {
            const res = await verifyEmailCode(email, code);
            if (res.message?.includes('zweryfikowany')) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(res.message || t('Invalid verification code.'));
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError(t('An error occurred during verification.'));
        }
    };

    return (
        <div className={styles.verifyContainer}>
            <form onSubmit={handleSubmit} className={styles.verifyForm}>
                <h2>{t('Email verification')}</h2>
                <p>{t('Enter the code sent to address')} <strong>{email}</strong></p>

                <input
                    type="text"
                    placeholder={t('Verification code')}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button type="submit">{t('Verify')}</button>

                {error && <p className={styles.errorText}>{error}</p>}
                {success && <p className={styles.successText}>{t('Your account has been verified!')}</p>}
            </form>
        </div>
    );
};

export default VerifyEmail;