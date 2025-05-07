import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verifyResetCode } from '../../api/AuthApi/passwordResetApi';
import styles from './ResetPassword.module.css';

const ResetStepTwo = () => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('Dane do weryfikacji:', { email, code }); 

        try {
            const res = await verifyResetCode(email, code);
            if (res.success) {
                setSuccess(true);
                setTimeout(() => {
                    console.log('Przekazuję do Step3:', { email, code }); 
                    navigate('/reset-password/step3', { state: { email, code } });
                }, 1000);
            } else {
                setError(res.message || 'Nieprawidłowy kod.');
            }
        } catch (err) {
            setError('Błąd serwera.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Weryfikacja kodu</h2>
                <p>Wpisz kod wysłany na adres <strong>{email}</strong></p>

                <input
                    type="text"
                    placeholder="Kod weryfikacyjny"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />

                <button type="submit">Zweryfikuj</button>
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>Kod poprawny. Przekierowanie...</p>}
            </form>
        </div>
    );
};

export default ResetStepTwo;
