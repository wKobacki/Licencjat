const API_URL = process.env.REACT_APP_API_URL;

export const getComments = async (itemId, itemType, userEmail) => {
    const url = `${API_URL}/comments?item_id=${itemId}&item_type=${itemType}`;
    console.log('GET komentarze - URL:', url); 
    console.log('GET komentarze - userEmail:', userEmail); 
    const res = await fetch(url, {
        headers: { 'x-user-email': userEmail }
    });
    const json = await res.json();
    console.log('GET komentarze - odpowiedź:', json);
    return json;
};

export const postComment = async (body, userEmail) => {
    return fetch(`${API_URL}/comments`, { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail,
        },
        body: JSON.stringify(body),
    });
};

export const likeComment = async (commentId, userEmail) => {
    return fetch(`${API_URL}/comments/${commentId}/like`, {
        method: 'POST',
        headers: { 'x-user-email': userEmail },
    });
};

export const unlikeComment = async (commentId, userEmail) => {
    return fetch(`${API_URL}/comments/${commentId}/like`, {
        method: 'DELETE',
        headers: { 'x-user-email': userEmail },
    });
};

