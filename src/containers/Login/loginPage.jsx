import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/AuthApi/authApi';
import styles from './loginPage.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(email, password);
            console.log('Login response:', data);

            if (data) {
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userBranch', data.user.branch);
                console.log(data.user.role);
                navigate('/homePage');
                window.location.reload();
            } else {
                setError('Nieprawidłowy e-mail lub hasło');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Wystąpił błąd logowania');
        }
    };

    return (
        <div className={styles.loginContainer}>
            <h2>Zaloguj się</h2>
            <form onSubmit={handleSubmit} className={styles.loginForm}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className={styles.errorText}>{error}</p>}
                <button type="submit">Zaloguj</button>
            </form>
            <p className={styles.linkText}>
                Nie masz konta? <span onClick={() => navigate('/register')}>Zarejestruj się</span>
            </p>
            <p className={styles.linkText}>
                Zapomniałeś hasła? <span onClick={() => navigate('/reset-password')}>Przywróć je</span>
            </p>
        </div>
    );
};

export default Login;
