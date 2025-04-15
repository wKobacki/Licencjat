const API_URL = process.env.REACT_APP_API_URL;

export const getComments = async (itemId, itemType, userEmail) => {
    const res = await fetch(
        `${API_URL}comments?item_id=${itemId}&item_type=${itemType}`,
        { headers: { 'x-user-email': userEmail } }
    );
    return res.json();
};

export const postComment = async (body, userEmail) => {
    return fetch('${API_URL}/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-email': userEmail,
        },
        body: JSON.stringify(body),
    });
};

export const likeComment = async (commentId, userEmail) => {
    return fetch(`${API_URL}/comments/${commentId}/likes`, {
        method: 'POST',
        headers: { 'x-user-email': userEmail },
    });
};
