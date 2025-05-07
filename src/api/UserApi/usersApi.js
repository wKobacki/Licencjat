const API_URL = process.env.REACT_APP_API_URL;

export const getUsers = async (userEmail) => {
    const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'x-user-email': userEmail },
    });
    return res.json();
};

export const deleteUser = async (id, userEmail) => {
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-user-email': userEmail },
    });
    return res.json();
};

export const updateUserRole = async (id, newRole, userEmail) => {
    return fetch(`${API_URL}/admin/users/${id}/role`, {
        method: 'PUT',
        headers: {
            'x-user-email': userEmail,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
    });
};

export const toggleUserBlock = async (id, isBlocked, userEmail) => {
    return fetch(`${API_URL}/admin/users/${id}/block`, {
        method: 'PUT',
        headers: {
            'x-user-email': userEmail,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isBlocked: !isBlocked }),
    });
};

export const updateUserBranch = async (id, newBranch, userEmail) => {
    return fetch(`${API_URL}/admin/users/${id}/branch`, {
        method: 'PUT',
        headers: {
            'x-user-email': userEmail,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ branch: newBranch }),
    });
};
