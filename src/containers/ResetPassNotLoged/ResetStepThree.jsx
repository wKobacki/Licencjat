import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../api/AuthApi/passwordResetApi';
import styles from './ResetPassword.module.css';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ResetStepThree = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const code = location.state?.code;
    const { t } = useTranslation();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const checks = {
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password),
        match: password === confirmPassword && password.length > 0
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!Object.values(checks).every(Boolean)) {
            setError(t('Password does not meet requirements or does not match.'));
            return;
        }

        try {
            const res = await resetPassword(email, code, password);
            if (res.message?.includes('zresetowane')) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 500);
            } else {
                setError(res.message || t('Error while resetting password.'));
            }
        } catch (err) {
            console.error(err);
            setError(t('Server error.'));
        }
    };

    const renderIcon = (valid) =>
        valid ? <CheckCircle className={styles.validIcon} /> : <Cancel className={styles.invalidIcon} />;

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>{t('Set new password')}</h2>
                <input
                    type="password"
                    placeholder={t('New password')}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder={t('Confirm password')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <ul className={styles.hintList}>
                    <li>{renderIcon(checks.length)} {t('Min. 8 characters')}</li>
                    <li>{renderIcon(checks.upper)} {t('One uppercase letter')}</li>
                    <li>{renderIcon(checks.lower)} {t('One lowercase letter')}</li>
                    <li>{renderIcon(checks.digit)} {t('One digit')}</li>
                    <li>{renderIcon(checks.special)} {t('One special character')}</li>
                    <li>{renderIcon(checks.match)} {t('Passwords match')}</li>
                </ul>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{t('Password successfully changed!')}</p>}

                <button type="submit">{t('Change password')}</button>
            </form>
        </div>
    );
};

export default ResetStepThree;