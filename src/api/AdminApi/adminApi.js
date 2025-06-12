const API_URL = process.env.REACT_APP_API_URL;

export const fetchAllComments = async () => {
    try {
        const res = await fetch(`${API_URL}/admin/comments`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            throw new Error('Błąd podczas pobierania komentarzy');
        }

        return await res.json(); 
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

export const deleteComment = async (commentId) => {
    try {
        const res = await fetch(`${API_URL}/admin/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': localStorage.getItem('userEmail')
            }
        });

        if (!res.ok) {
            throw new Error('Błąd podczas usuwania komentarza');
        }

        return await res.json();
    } catch (error) {
        console.error(error.message);
        return { success: false, message: error.message };
    }
};

export const getAllIdeasAndProblems = async (archived = false) => {
    try {
        const res = await fetch(`${API_URL}/admin/ideas?archived=${archived}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': localStorage.getItem('userEmail')
            }
        });

        if (!res.ok) {
            throw new Error('Błąd podczas pobierania pomysłów i problemów');
        }

        return await res.json();
    } catch (error) {
        console.error(error.message);
        return [];
    }
};

export const deleteIdea = async (ideaId) => {
    try {
        const res = await fetch(`${API_URL}/admin/ideas/${ideaId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': localStorage.getItem('userEmail')
            }
        });

        if (!res.ok) {
            throw new Error('Błąd podczas usuwania pomysłu');
        }

        return await res.json();
    } catch (error) {
        console.error(error.message);
        return { success: false, message: error.message };
    }
};

export const deleteProblem = async (problemId) => {
    try {
        const res = await fetch(`${API_URL}/admin/problems/${problemId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': localStorage.getItem('userEmail')
            }
        });

        if (!res.ok) {
            throw new Error('Błąd podczas usuwania problemu');
        }

        return await res.json();
    } catch (error) {
        console.error(error.message);
        return { success: false, message: error.message };
    }
};

export const archiveIdea = async (ideaId, archived) => {
    try {
        const res = await fetch(`${API_URL}/admin/ideas/${ideaId}/archive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': localStorage.getItem('userEmail')
            },
            body: JSON.stringify({ archived })
        });
        if (!res.ok) throw new Error('Błąd archiwizacji');
        return await res.json();
    } catch (error) {
        console.error(error.message);
    }
};

export const archiveProblem = async (problemId, archived) => {
    try {
        const res = await fetch(`${API_URL}/admin/problems/${problemId}/archive`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': localStorage.getItem('userEmail')
            },
            body: JSON.stringify({ archived })
        });
        if (!res.ok) throw new Error('Błąd archiwizacji');
        return await res.json();
    } catch (error) {
        console.error(error.message);
    }
};

export const updateIdeaStatus = async (ideaId, status, type) => {
    try {
        const res = await fetch(`${API_URL}/admin/${type}s/${ideaId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-user-email': localStorage.getItem('userEmail'),
            },
            body: JSON.stringify({ status })
        });

        if (!res.ok) {
            throw new Error('Błąd podczas zmiany statusu pomysłu');
        }

        return await res.json();
    } catch (error) {
        console.error(error.message);
        return { success: false, message: error.message };
    }
};


