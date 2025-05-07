import React, { useState } from 'react';
import styles from './ResetPassword.module.css';
import { sendResetCode } from '../../api/AuthApi/passwordResetApi';
import { useNavigate } from 'react-router-dom';

const ResetStepOne = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await sendResetCode(email);
            if (res.message?.includes('został wysłany')) {
                navigate('/reset-password/step2', { state: { email } });
            } else {
                setError(res.message || 'Nie udało się wysłać kodu resetującego.');
            }
        } catch (err) {
            console.log(err);
            setError('Błąd podczas próby wysłania kodu.');
        }
    };    

    return (
        <div className={styles.container}>
            <form onSubmit={handleSubmit} className={styles.form}>
                <h2>Resetuj hasło</h2>
                <input type="email" placeholder="Wpisz email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                {error && <p className={styles.error}>{error}</p>}
                <button type="submit">Wyślij kod</button>
            </form>
        </div>
    );
};

export default ResetStepOne;