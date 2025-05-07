import React, { useState } from 'react';
import styles from './ForgotPassword.module.css';
import { changePassword } from '../../api/AuthApi/passwordResetApi';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Cancel } from '@mui/icons-material';

const ForgotPassword = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

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
            return setError('Hasła nie są takie same.');
        }

        if (!Object.values(checks).every(Boolean)) {
            return setError('Hasło nie spełnia wszystkich wymagań.');
        }

        try {
            const email = localStorage.getItem('userEmail');
            const response = await changePassword(email, formData.oldPassword, formData.newPassword);
            if (response.success) {
                setSuccess('Hasło zostało zmienione.');
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(response.message || 'Błąd przy zmianie hasła.');
            }
        } catch (err) {
            console.error(err);
            setError('Wystąpił błąd podczas zmiany hasła.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Zmiana hasła</h2>
                <input
                    type="password"
                    name="oldPassword"
                    placeholder="Stare hasło"
                    value={formData.oldPassword}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="newPassword"
                    placeholder="Nowe hasło"
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Potwierdź nowe hasło"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />

                <ul className={styles.passwordRules}>
                    <li>{renderIcon(checks.length)} Min. 8 znaków</li>
                    <li>{renderIcon(checks.upper)} Duża litera</li>
                    <li>{renderIcon(checks.lower)} Mała litera</li>
                    <li>{renderIcon(checks.digit)} Cyfra</li>
                    <li>{renderIcon(checks.special)} Znak specjalny</li>
                </ul>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                <button type="submit">Zmień hasło</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
