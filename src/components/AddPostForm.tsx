import React, { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { addNewPost } from "../features/posts/postsSlice";
import { Paper, TextField, Button, Box, Typography } from "@mui/material";

const AddPostForm = () => {
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && body) {
      dispatch(
        addNewPost({
          title,
          body,
          userId: 1, // Using a default userId for demo purposes
        })
      );
      setTitle("");
      setBody("");
    }
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Post Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Post Content"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={!title || !body}
        >
          Add Post
        </Button>
      </Box>
    </Paper>
  );
};

export default AddPostForm;
