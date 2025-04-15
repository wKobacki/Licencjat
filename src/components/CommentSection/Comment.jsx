import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { Reply, ThumbUp } from '@mui/icons-material';

const Comment = ({ comment, depth, setReplyTo, handleLike }) => {
    return (
        <Box sx={{
            ml: depth * 2,
            mb: 2,
            p: 2,
            border: '1px solid #ccc',
            borderRadius: 2,
            backgroundColor: '#f9f9f9',
        }}>
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
                <Button size="small" startIcon={<ThumbUp />} onClick={handleLike}>
                    {comment.likes || 0}
                </Button>
            </Stack>

            {comment.replies && comment.replies.map((reply) => (
                <Comment
                    key={reply.id}
                    comment={reply}
                    depth={depth + 1}
                    setReplyTo={setReplyTo}
                    handleLike={() => handleLike(reply.id)}
                />
            ))}
        </Box>
    );
};

export default Comment;
