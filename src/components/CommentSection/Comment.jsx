import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Reply, ThumbUp } from '@mui/icons-material';
import styles from './Comment.module.css';

const Comment = ({ comment, depth, setReplyTo, handleLike }) => {
    const indentClass = styles[`indent${depth}`] || styles.indent0;

    return (
        <Box className={`${styles.commentContainer} ${indentClass}`}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="subtitle2">{comment.author_email}</Typography>
                <Typography variant="caption">
                    {new Date(comment.created_at).toLocaleString('pl-PL')}
                </Typography>
            </Stack>

            <Typography variant="body1" mt={1}>
                {comment.content}
            </Typography>

            <Stack direction="row" spacing={1} mt={1}>
                <Button size="small" startIcon={<Reply />} onClick={() => setReplyTo(comment.id)}>
                    Odpowiedz
                </Button>
                <Button
                    size="small"
                    startIcon={<ThumbUp />}
                    onClick={() => handleLike(comment.id, comment.likedByCurrentUser)}
                >
                    {comment.likes ?? 0} polubień
                </Button>
            </Stack>

            {comment.replies && comment.replies.map((reply) => (
                <Comment
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    setReplyTo={setReplyTo}
                    handleLike={handleLike}
                />
            ))}
        </Box>
    );
};

export default Comment;
