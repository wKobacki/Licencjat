import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetCode } from '../../api/AuthApi/passwordResetApi';
import styles from './ResetPassword.module.css';
import { useTranslation } from 'react-i18next';

const ResetStepTwo = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await verifyResetCode(email, code);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => {
                    navigate('/reset-password/step3', { state: { email, code } });
                }, 1000);
            } else {
                setError(res.message || t('Invalid code.'));
            }
        } catch (err) {
            setError(t('Server error.'));
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>{t('Code verification')}</h2>
                <p>
                    {t('Enter the code sent to address')} <strong>{email}</strong>
                </p>

                <input
                    type="text"
                    placeholder={t('Verification code')}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button type="submit">{t('Verify')}</button>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{t('Code correct. Redirecting...')}</p>}
            </form>
        </div>
    );
};

export default ResetStepTwo;