import React, { useState } from 'react';
import styles from './ResetPassword.module.css';
import { sendResetCode } from '../../api/AuthApi/passwordResetApi';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResetStepOne = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await sendResetCode(email);
            if (res.message?.includes('został wysłany')) {
                navigate('/reset-password/step2', { state: { email } });
            } else {
                setError(res.message || t('Failed to send reset code.'));
            }
        } catch (err) {
            console.error(err);
            setError(t('Error while sending reset code.'));
        }
    };    

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>{t('Reset password')}</h2>
                <input
                    type="email"
                    placeholder={t('Enter email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit">{t('Send code')}</button>
            </form>
        </div>
    );
};

export default ResetStepOne;
