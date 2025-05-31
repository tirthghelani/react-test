import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPosts,
  deletePost,
  updatePost,
  Post,
} from "../features/posts/postsSlice";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Box,
  InputAdornment,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const POSTS_PER_PAGE = 5;
const DEBOUNCE_DELAY = 300; // 300ms delay for debouncing

const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const PostsList = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const status = useAppSelector((state) => state.posts.status);
  const error = useAppSelector((state) => state.posts.error);
  const navigate = useNavigate();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [displayedPosts, setDisplayedPosts] = useState<number>(POSTS_PER_PAGE);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deletePost(id));
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingPost) {
      dispatch(updatePost(editingPost));
      setEditDialogOpen(false);
      setEditingPost(null);
    }
  };

  const handleLoadMore = () => {
    setDisplayedPosts((prev) => prev + POSTS_PER_PAGE);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setDisplayedPosts(POSTS_PER_PAGE); // Reset pagination when searching
  };

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [posts, debouncedSearchTerm]);

  if (status === "loading") {
    return <CircularProgress />;
  }

  if (status === "failed") {
    return <Typography color="error">{error}</Typography>;
  }

  const visiblePosts = filteredPosts.slice(0, displayedPosts);
  const hasMorePosts = filteredPosts.length > displayedPosts;

  return (
    <Paper elevation={2} sx={{ mt: 3, p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Posts
      </Typography>

      <TextField
        fullWidth
        margin="normal"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {filteredPosts.length === 0 ? (
        <Typography color="textSecondary" align="center" sx={{ my: 2 }}>
          No posts found matching your search
        </Typography>
      ) : (
        <>
          <List>
            {visiblePosts.map((post) => (
              <ListItem
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(post);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(post.id);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={post.title} secondary={post.body} />
              </ListItem>
            ))}
          </List>

          {hasMorePosts && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLoadMore}
              >
                Load More Posts
              </Button>
            </Box>
          )}
        </>
      )}

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={editingPost?.title || ""}
            onChange={(e) =>
              setEditingPost((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={editingPost?.body || ""}
            onChange={(e) =>
              setEditingPost((prev) =>
                prev ? { ...prev, body: e.target.value } : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default PostsList;
