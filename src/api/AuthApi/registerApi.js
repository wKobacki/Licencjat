const API_URL = process.env.REACT_APP_API_URL;

export const registerUser = async (formData) => {
    const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    });
    return res.json();
};


export const verifyEmailCode = async (email, code) => {
    const res = await fetch(`${API_URL}/verify-email`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code }),
    });

    return res.json();
};
