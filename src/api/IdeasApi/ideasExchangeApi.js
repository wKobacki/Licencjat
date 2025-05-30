const API_URL = process.env.REACT_APP_API_URL;

export const fetchIdeas = async (userEmail) => {
    const res = await fetch(
        `${API_URL}/ideas?status=in_voting,in_progress,completed&archived=false`,
        {
            headers: {
                'x-user-email': userEmail
            }
        }
    );

    if (!res.ok) {
        console.error('Błąd podczas pobierania pomysłów:', res.status);
        return [];
    }

    const data = await res.json();
    return data.ideas || [];
};

export const submitIdea = async (formData, userEmail) => {
    try {
        const res = await fetch(`${API_URL}/submitIdea`, {
            method: 'POST',
            headers: {
                'x-user-email': userEmail
            },
            body: formData,
        });

        if (!res.ok) {
            console.error('Błąd podczas dodawania pomysłu:', res.status);
            return { success: false, message: 'Błąd dodawania pomysłu' };
        }

        return await res.json();
    } catch (error) {
        console.error('Błąd połączenia:', error.message);
        return { success: false, message: 'Błąd połączenia z serwerem' };
    }
};

export const voteForIdea = async (ideaId, userEmail) => {
    try {
        const res = await fetch(`${API_URL}/ideas/${ideaId}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': userEmail,
            },
        });

        if (!res.ok) {
            console.error('Błąd podczas głosowania:', res.status);
            return { success: false, message: 'Błąd podczas głosowania' };
        }

        return await res.json();
    } catch (error) {
        console.error('Błąd połączenia:', error.message);
        return { success: false, message: 'Błąd połączenia z serwerem' };
    }
};

export const fetchUserBlockStatus = async (userEmail) => {
    try {
        const res = await fetch(`${API_URL}/admin/users/status`, {
            method: 'GET',
            headers: { 'x-user-email': userEmail },
        });

        if (!res.ok) {
            console.error('Błąd podczas pobierania statusu użytkownika:', res.status);
            return { blocked: false, message: 'Błąd pobierania statusu' };
        }

        return await res.json();
    } catch (error) {
        console.error('Błąd połączenia:', error.message);
        return { blocked: false, message: 'Błąd połączenia z serwerem' };
    }
};

