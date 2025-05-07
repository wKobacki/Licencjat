import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Collapse, Paper, IconButton, TextField } from '@mui/material';
import { ExpandLess, ExpandMore, Send } from '@mui/icons-material';
import Comment from './Comment';
import styles from './CommentSection.module.css';
import { getComments, postComment, likeComment, unlikeComment } from '../../api/IdeasApi/commentsApi';

const CommentSection = ({ itemId, itemType, userEmail }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [showComments, setShowComments] = useState(false);

    const fetchComments = useCallback(async () => {
        try {
            const data = await getComments(itemId, itemType, userEmail);
            setComments(data);
        } catch (err) {
            console.error('Błąd podczas pobierania komentarzy:', err);
        }
    }, [itemId, itemType, userEmail]);

    useEffect(() => {
        if (showComments) fetchComments();
    }, [fetchComments, showComments]);

    const submitComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            await postComment({ item_id: itemId, item_type: itemType, parent_id: replyTo, content: newComment.trim() }, userEmail);
            setNewComment('');
            setReplyTo(null);
            fetchComments();
        } catch (err) {
            console.error('Błąd przy dodawaniu komentarza:', err);
        }
    };

    const handleLikeToggle = async (id, alreadyLiked) => {
        try {
            if (alreadyLiked) {
                await unlikeComment(id, userEmail);
            } else {
                await likeComment(id, userEmail);
            }
            fetchComments();
        } catch (err) {
            console.error('Błąd przy przetwarzaniu polubienia:', err);
        }
    };

    return (
        <Box className={styles.commentSection}>
            <Button
                variant="contained"
                color="primary"
                startIcon={showComments ? <ExpandLess /> : <ExpandMore />}
                onClick={() => setShowComments(!showComments)}
            >
                {showComments ? 'Ukryj komentarze' : 'Pokaż komentarze'}
            </Button>

            <Collapse in={showComments}>
                <Box mt={2}>
                    {comments.map((comment) => (
                        <Comment
                            key={comment.id}
                            comment={comment}
                            depth={0}
                            setReplyTo={setReplyTo}
                            handleLike={handleLikeToggle}
                        />
                    ))}

                    <form onSubmit={submitComment} className={styles.commentForm}>
                        <Paper className={styles.commentInputContainer}>
                            <TextField
                                variant="standard"
                                placeholder={replyTo ? 'Odpowiadasz na komentarz...' : 'Dodaj komentarz...'}
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
                </Box>
            </Collapse>
        </Box>
    );
};

export default CommentSection;
