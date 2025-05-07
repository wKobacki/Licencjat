import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { resetPassword } from '../../api/AuthApi/passwordResetApi';
import styles from './ResetPassword.module.css';
import { CheckCircle, Cancel } from '@mui/icons-material';

const ResetStepThree = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;
    const code = location.state?.code; 

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
            setError('Hasło nie spełnia wymagań lub nie pasuje.');
            return;
        }

        try {
            const res = await resetPassword(email, code, password);
            if (res.message?.includes('zresetowane')) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 500);
            } else {
                setError(res.message || 'Błąd podczas zmiany hasła');
            }
        } catch (err) {
            console.error(err);
            setError('Błąd serwera.');
        }
    };

    const renderIcon = (valid) => (
        valid ? <CheckCircle className={styles.validIcon} /> : <Cancel className={styles.invalidIcon} />
    );

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Ustaw nowe hasło</h2>
                <input
                    type="password"
                    placeholder="Nowe hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Potwierdź hasło"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <ul className={styles.hintList}>
                    <li>{renderIcon(checks.length)} Min. 8 znaków</li>
                    <li>{renderIcon(checks.upper)} Jedna duża litera</li>
                    <li>{renderIcon(checks.lower)} Jedna mała litera</li>
                    <li>{renderIcon(checks.digit)} Cyfra</li>
                    <li>{renderIcon(checks.special)} Znak specjalny</li>
                    <li>{renderIcon(checks.match)} Hasła są identyczne</li>
                </ul>

                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Hasło zmienione!</p>}

                <button type="submit">Zmień hasło</button>
            </form>
        </div>
    );
};

export default ResetStepThree;
