const API_URL = process.env.REACT_APP_API_URL;

export const fetchIdeas = async (branch, userEmail) => {
    const res = await fetch(
        `${API_URL}/ideas?status=in_voting,in_progress,completed&archived=false&branch=${branch}`,
        {
            headers: { 'x-user-email': userEmail },
        }
    );
    return res.json();
};

export const submitIdea = async (formData, userEmail) => {
    const res = await fetch(`${API_URL}/submitIdea`, {
        method: 'POST',
        headers: { 'x-user-email': userEmail },
        body: formData,
    });
    return res.json();
};

export const voteForIdea = async (ideaId, userEmail) => {
    const res = await fetch(`${API_URL}/ideas/${ideaId}/vote`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail,
        },
    });
    return res.json();
};

export const fetchUserBlockStatus = async (userEmail) => {
    const res = await fetch(`${API_URL}/admin/users/status`, {
        method: 'GET',
        headers: { 'x-user-email': userEmail },
    });
    return res.json();
};
