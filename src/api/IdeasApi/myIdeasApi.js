const API_URL = process.env.REACT_APP_API_URL;

export const getProblemsByBranch = async (branch, userEmail) => {
    const response = await fetch(
        `${API_URL}/problems?status=in_voting,in_progress,completed,rejected&archived=false&branch=${branch}`,
        {
            headers: { 'x-user-email': userEmail }
        }
    );
    return await response.json();
};

export const submitProblem = async (formData, userEmail) => {
    const response = await fetch(`${API_URL}/submitProblem`, {
        method: 'POST',
        headers: {
            'x-user-email': userEmail
        },
        body: formData
    });

    return await response.json();
};

export const voteForProblem = async (problemId, userEmail) => {
    const response = await fetch(`${API_URL}/problems/${problemId}/vote`, {
        method: 'POST',
        headers: {
            'x-user-email': userEmail 
        }
    });

    return await response.json();
};