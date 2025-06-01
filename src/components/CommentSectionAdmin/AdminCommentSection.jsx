import React, { useEffect, useState } from 'react';
import styles from './AdminCommentSection.module.css';
import { fetchAllComments, deleteComment } from '../../api/AdminApi/adminApi';
import { useTranslation } from 'react-i18next';

const AdminCommentSection = ({ ideaId, ideaType }) => {
    const [comments, setComments] = useState([]);
    const [expanded, setExpanded] = useState({});
    const { t } = useTranslation();

    useEffect(() => {
        const loadComments = async () => {
            try {
                const allComments = await fetchAllComments();
                const filtered = allComments
                    .filter(c => c.item_id === ideaId && c.item_type === ideaType);

                const nestComments = (list, parentId = null) =>
                    list
                        .filter(c => c.parent_id === parentId)
                        .map(c => ({
                            ...c,
                            replies: nestComments(list, c.id)
                        }));

                setComments(nestComments(filtered));
            } catch (err) {
                console.error('Błąd podczas pobierania komentarzy:', err);
            }
        };

        loadComments();
    }, [ideaId, ideaType]);

    const getAllNestedCommentIds = (comment) => {
        const ids = [comment.id];
        if (comment.replies) {
            comment.replies.forEach(reply => {
                ids.push(...getAllNestedCommentIds(reply));
            });
        }
        return ids;
    };

    const handleDeleteComment = async (comment) => {
        const toDelete = getAllNestedCommentIds(comment);
        for (const id of toDelete) {
            await deleteComment(id);
        }

        const removeFromTree = (list) => {
            return list
                .filter(c => !toDelete.includes(c.id))
                .map(c => ({
                    ...c,
                    replies: c.replies ? removeFromTree(c.replies) : []
                }));
        };

        setComments(prev => removeFromTree(prev));
    };

    const toggle = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderComments = (commentList, depth = 0) => (
        commentList.map(comment => (
            <div key={comment.id} className={styles.comment} style={{ marginLeft: depth * 20 }}>
                <p className={styles.meta}>
                    <strong>{comment.author_email}</strong> — {new Date(comment.created_at).toLocaleString()}
                </p>
                <p>{comment.content}</p>
                <div className={styles.actions}>
                    {comment.replies?.length > 0 && (
                        <button onClick={() => toggle(comment.id)} className={styles.toggleButton}>
                            {expanded[comment.id]
                                ? t('Collapse replies')
                                : `${t('Show replies')} (${comment.replies.length})`}
                        </button>
                    )}
                    <button onClick={() => handleDeleteComment(comment)} className={styles.deleteButton}>
                        {t('Delete')}
                    </button>
                </div>
                {expanded[comment.id] && comment.replies && renderComments(comment.replies, depth + 1)}
            </div>
        ))
    );

    return (
        <div className={styles.container}>
            <h4>{t('Comments:')}</h4>
            {comments.length > 0 ? renderComments(comments) : <p>{t('No comments')}</p>}
        </div>
    );
};

export default AdminCommentSection;
