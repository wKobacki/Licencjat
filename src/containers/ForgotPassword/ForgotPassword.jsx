import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { changePassword } from '../../api/AuthApi/passwordResetApi';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Cancel } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const { t } = useTranslation();

    const validatePassword = (password) => ({
        length: password.length >= 8,
        upper: /[A-Z]/.test(password),
        lower: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^A-Za-z0-9]/.test(password)
    });

    const checks = validatePassword(formData.newPassword);

    const renderIcon = (isValid) =>
        isValid ? <CheckCircle className={styles.valid} /> : <Cancel className={styles.invalid} />;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (formData.newPassword !== formData.confirmPassword) {
            return setError(t('Passwords do not match.'));
        }

        if (!Object.values(checks).every(Boolean)) {
            return setError(t('Password does not meet requirements.'));
        }

        try {
            const email = localStorage.getItem('userEmail');
            const response = await changePassword(email, formData.oldPassword, formData.newPassword);
            if (response.success) {
                setSuccess(t('Password changed successfully.'));
                setTimeout(() => navigate('/'), 200);
            } else {
                setError(response.message || t('Error changing password.'));
            }
        } catch (err) {
            console.error(err);
            setError(t('An error occurred while changing the password.'));
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2 className={styles.heading}>{t('Change password')}</h2>
                <input
                    type="password"
                    name="oldPassword"
                    placeholder={t('Old password')}
                    value={formData.oldPassword}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder={t('New password')}
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder={t('Confirm new password')}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />

                <ul className={styles.passwordRules}>
                    <li className={styles.ruleItem}>{renderIcon(checks.length)} <span className={styles.ruleText}>{t('At least 8 characters')}</span></li>
                    <li className={styles.ruleItem}>{renderIcon(checks.upper)} <span className={styles.ruleText}>{t('Uppercase letter')}</span></li>
                    <li className={styles.ruleItem}>{renderIcon(checks.lower)} <span className={styles.ruleText}>{t('Lowercase letter')}</span></li>
                    <li className={styles.ruleItem}>{renderIcon(checks.digit)} <span className={styles.ruleText}>{t('Digit')}</span></li>
                    <li className={styles.ruleItem}>{renderIcon(checks.special)} <span className={styles.ruleText}>{t('Special character')}</span></li>
                </ul>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                <button type="submit" className={styles.submitButton}>{t('Change')}</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
