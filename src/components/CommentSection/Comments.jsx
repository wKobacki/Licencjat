import React, { useEffect, useState, useCallback } from 'react';
import styles from './Comments.module.css';
import {
    getComments,
    postComment,
    likeComment,
    unlikeComment
} from '../../api/IdeasApi/commentsApi';
import {
    ExpandLess,
    ExpandMore,
    Send,
    Reply,
    ThumbUp
} from '@mui/icons-material';
import {
    Box,
    Button,
    Collapse,
    Paper,
    IconButton,
    TextField
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const Comments = ({ itemId, itemType, userEmail }) => {
    const [comments, setComments] = useState([]);
    const [replyTo, setReplyTo] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [expanded, setExpanded] = useState({});
    const { t } = useTranslation();

    const fetchData = useCallback(async () => {
        try {
            const data = await getComments(itemId, itemType, userEmail);
            setComments(data);
        } catch (err) {
            console.error('Błąd podczas pobierania komentarzy:', err);
        }
    }, [itemId, itemType, userEmail]);

    useEffect(() => {
        if (showComments) fetchData();
    }, [fetchData, showComments]);

    const findCommentById = (list, id) => {
        for (const comment of list) {
            if (comment.id === id) return comment;
            if (comment.replies) {
                const found = findCommentById(comment.replies, id);
                if (found) return found;
            }
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const parent = replyTo ? findCommentById(comments, replyTo) : null;

        if (parent) {
            if (parent.parent_id !== null) {
                alert('Można odpowiadać tylko na komentarze najwyższego poziomu.');
                return;
            }
        }

        try {
            await postComment({
                item_id: itemId,
                item_type: itemType,
                parent_id: replyTo,
                content: newComment.trim()
            }, userEmail);
            setNewComment('');
            setReplyTo(null);
            fetchData();
        } catch (err) {
            console.error('Błąd przy dodawaniu komentarza:', err);
        }
    };

    const handleLike = async (id, alreadyLiked) => {
        try {
            if (alreadyLiked) {
                await unlikeComment(id, userEmail);
            } else {
                await likeComment(id, userEmail);
            }
            fetchData();
        } catch (err) {
            console.error('Błąd przy polubieniu:', err);
        }
    };

    const toggle = (id) => {
        setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const renderComments = (list, depth = 0) =>
        list.map(comment => {
            const children = comment.replies || [];
            return (
                <div key={comment.id} className={styles.comment} style={{ marginLeft: `${depth * 20}px` }}>
                    <p className={styles.meta}>
                        <strong>{comment.author_email}</strong> — {new Date(comment.created_at).toLocaleString('pl-PL')}
                    </p>
                    <p>{comment.content}</p>
                    <div className={styles.actions}>
                        {comment.parent_id === null && (
                            <button onClick={() => setReplyTo(comment.id)} className={styles.replyButton}>
                                <Reply fontSize="small" /> {t('Reply')}
                            </button>
                        )}
                        <button onClick={() => handleLike(comment.id, comment.likedByCurrentUser)} className={styles.likeButton}>
                            <ThumbUp fontSize="small" /> {comment.likes ?? 0} {t('Likes')}
                        </button>
                        {children.length > 0 && (
                            <button onClick={() => toggle(comment.id)} className={styles.toggleButton}>
                                {expanded[comment.id]
                                    ? t('Collapse replies')
                                    : `${t('Show replies')} (${children.length})`}
                            </button>
                        )}
                    </div>
                    {expanded[comment.id] && renderComments(children, depth + 1)}
                </div>
            );
        });

    return (
        <div className={styles.container}>
            <Button
                variant="contained"
                color="primary"
                startIcon={showComments ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setShowComments(!showComments)}
            >
                {showComments ? t('Hide comments') : t('Show comments')}
            </Button>

            <Collapse in={showComments}>
                <div className={styles.commentSection}>
                    {renderComments(comments)}

                    <form onSubmit={handleSubmit} className={styles.commentForm}>
                        <Paper className={styles.commentInputContainer}>
                            <TextField
                                variant="standard"
                                placeholder={replyTo ? t('Replying to a comment') : t('Add a comment')}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                multiline
                                maxRows={4}
                                InputProps={{ disableUnderline: true }}
                                className={styles.textarea}
                            />
                            <IconButton type="submit" className={styles.sendBtn}>
                                <Send />
                            </IconButton>
                        </Paper>
                    </form>
                </div>
            </Collapse>
        </div>
    );
};

export default Comments;
