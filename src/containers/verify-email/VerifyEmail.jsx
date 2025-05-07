import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyEmailCode } from '../../api/AuthApi/registerApi';
import styles from './VerifyEmail.module.css';

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || '';

    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !code) {
            setError('Wprowadź kod i upewnij się, że e-mail został przekazany.');
            return;
        }

        try {
            const res = await verifyEmailCode(email, code);
            if (res.message?.includes('zweryfikowany')) {
                setSuccess(true);
                setTimeout(() => navigate('/'), 2000);
            } else {
                setError(res.message || 'Nieprawidłowy kod weryfikacyjny.');
            }
        } catch (err) {
            console.error('Błąd weryfikacji:', err);
            setError('Wystąpił błąd podczas weryfikacji.');
        }
    };

    return (
        <div className={styles.verifyContainer}>
            <form onSubmit={handleSubmit} className={styles.verifyForm}>
                <h2>Weryfikacja e-maila</h2>
                <p>Wpisz kod, który został wysłany na adres <strong>{email}</strong></p>

                <input
                    type="text"
                    placeholder="Kod weryfikacyjny"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button type="submit">Zweryfikuj</button>

                {error && <p className={styles.errorText}>{error}</p>}
                {success && <p className={styles.successText}>Konto zostało zweryfikowane!</p>}
            </form>
        </div>
    );
};

export default VerifyEmail;
