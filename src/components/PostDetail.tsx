import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";

const PostDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = useAppSelector((state) =>
    state.posts.posts.find((p) => p.id === Number(id))
  );

  if (!post) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        sx={{ mb: 2 }}
      >
        Back to Posts
      </Button>

      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>

      <Typography variant="body1" sx={{ mt: 2 }}>
        {post.body}
      </Typography>

      <Box sx={{ mt: 3, color: "text.secondary" }}>
        <Typography variant="subtitle2">Post ID: {post.id}</Typography>
        <Typography variant="subtitle2">Author ID: {post.userId}</Typography>
      </Box>
    </Paper>
  );
};

export default PostDetail;
