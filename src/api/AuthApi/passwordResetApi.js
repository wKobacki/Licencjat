const API_URL = process.env.REACT_APP_API_URL;

export const verifyResetCode = async (email, code) => {
    const res = await fetch(`${API_URL}/verify-reset-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
    });
    return res.json();
};

export const sendResetCode = async (email) => {
    const res = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });
    return res.json();
};

export const resetPassword = async (email, code, newPassword) => {
    const res = await fetch(`${API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }) 
    });
    return res.json();
};


export const changePassword = async (userEmail, oldPassword, newPassword) => {
    const res = await fetch(`${API_URL}/changePassword`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
    });
    return res.json();
};



