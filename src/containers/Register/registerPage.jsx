import React, { useState } from 'react';
import styles from './Register.module.css';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../api/AuthApi/registerApi';
import { CheckCircle, Cancel } from '@mui/icons-material';

const RegisterPage = () => {
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

    const validatePassword = (password) => {
        return {
            length: password.length >= 8,
            upper: /[A-Z]/.test(password),
            lower: /[a-z]/.test(password),
            digit: /\d/.test(password),
            special: /[^A-Za-z0-9]/.test(password),
        };
    };

    const passwordChecks = validatePassword(formData.password);
    const passwordsMatch = formData.password === formData.confirmPassword;

    const renderCheck = (valid) => (
        valid ? <CheckCircle className={styles.validIcon} /> : <Cancel className={styles.invalidIcon} />
    );

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const allValid = Object.values(passwordChecks).every(Boolean);

        if (!allValid || !passwordsMatch) {
            setError('Hasło nie spełnia wymagań lub hasła nie są identyczne.');
            return;
        }

        try {
            const res = await registerUser(formData);
            if (res.message?.includes('Rejestracja zakończona')) {
                navigate('/verify-email', { state: { email: formData.email } });
            } else {
                setError(res.message || 'Rejestracja nieudana.');
            }
        } catch (err) {
            console.error('Błąd rejestracji:', err);
            setError('Wystąpił błąd podczas rejestracji.');
        }
    };

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={handleSubmit} className={styles.registerForm}>
                <h2>Zarejestruj się</h2>
                <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleChange} />
                <input type="text" name="name" placeholder="Imię" required value={formData.name} onChange={handleChange} />
                <input type="text" name="surname" placeholder="Nazwisko" required value={formData.surname} onChange={handleChange} />

                <select name="branch" value={formData.branch} onChange={handleChange}>
                    <option value="Warszawa">Warszawa</option>
                    <option value="Łódź">Łódź</option>
                    <option value="Kraków">Kraków</option>
                    <option value="Gdańsk">Gdańsk</option>
                </select>

                <input type="password" name="password" placeholder="Hasło" required value={formData.password} onChange={handleChange} />
                <input type="password" name="confirmPassword" placeholder="Potwierdź hasło" required value={formData.confirmPassword} onChange={handleChange} />

                <ul className={styles.passwordHints}>
                    <li>{renderCheck(passwordChecks.length)} Min. 8 znaków</li>
                    <li>{renderCheck(passwordChecks.upper)} Jedna duża litera</li>
                    <li>{renderCheck(passwordChecks.lower)} Jedna mała litera</li>
                    <li>{renderCheck(passwordChecks.digit)} Cyfra</li>
                    <li>{renderCheck(passwordChecks.special)} Znak specjalny</li>
                    <li>{renderCheck(passwordsMatch)} Hasła są identyczne</li>
                </ul>

                {error && <p className={styles.errorText}>{error}</p>}
                <button type="submit">Zarejestruj</button>

                <p className={styles.linkText}>
                    Masz konto? <span onClick={() => navigate('/')}>Zaloguj się</span>
                </p>
            </form>
        </div>
    );
};

export default RegisterPage;
