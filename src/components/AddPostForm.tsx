import React from "react";
import { useAppDispatch } from "../app/hooks";
import { addNewPost } from "../features/posts/postsSlice";
import { Paper, TextField, Button, Box, Typography } from "@mui/material";
import { useForm, Controller } from "react-hook-form";

interface PostFormInputs {
  title: string;
  body: string;
}

const AddPostForm = () => {
  const dispatch = useAppDispatch();
  const { control, handleSubmit, reset } = useForm<PostFormInputs>({
    defaultValues: {
      title: "",
      body: "",
    },
  });

  const onSubmit = (data: PostFormInputs) => {
    dispatch(
      addNewPost({
        title: data.title,
        body: data.body,
        userId: 1, // Using a default userId for demo purposes
      })
    );
    reset();
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Add New Post
      </Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="title"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Post Title"
              margin="normal"
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Controller
          name="body"
          control={control}
          rules={{ required: "Content is required" }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              fullWidth
              label="Post Content"
              margin="normal"
              multiline
              rows={4}
              error={!!error}
              helperText={error?.message}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Add Post
        </Button>
      </Box>
    </Paper>
  );
};

export default AddPostForm;
