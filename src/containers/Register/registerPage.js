import React, { useState } from 'react';
import './registerPage.css';
import { Link, useNavigate } from 'react-router-dom';

function RegisterPage() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Hasła nie są identyczne!");
            return;
        }
        console.log("Rejestracja:", formData);
    };

    return (
        <div className="register-page">
            <h2 className="register-page__title">Rejestracja</h2>
            <form className="register-page__form" onSubmit={handleSubmit}>
                <label className="register-page__label">Imię:</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="register-page__input"/>

                <label className="register-page__label">Nazwisko:</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="register-page__input"/>

                <label className="register-page__label">Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="register-page__input"/>

                <label className="register-page__label">Hasło:</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required className="register-page__input"/>

                <label className="register-page__label">Potwierdź hasło:</label>
                <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="register-page__input"/>

                <button type="submit" className="register-page__button">Zarejestruj się</button>
            </form>

            <button type="button" className="register-page__cancel" onClick={() => navigate("/")}>
                Anuluj
            </button>
        </div>
    );
}

export default RegisterPage;
