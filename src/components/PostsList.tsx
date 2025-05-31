import React, { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  fetchPosts,
  deletePost,
  updatePost,
  Post,
} from "../features/posts/postsSlice";
import {
  Card,
  CardContent,
  CardActions,
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
  Container,
  Divider,
  Chip,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Article as ArticleIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const POSTS_PER_PAGE = 6; // Changed to 6 for better grid layout
const DEBOUNCE_DELAY = 300;

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
    setDisplayedPosts(POSTS_PER_PAGE);
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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (status === "failed") {
    return (
      <Paper elevation={3} sx={{ p: 3, mt: 3, bgcolor: "#fff3f3" }}>
        <Typography color="error" variant="h6">
          Error Loading Posts
        </Typography>
        <Typography color="error">{error}</Typography>
      </Paper>
    );
  }

  const visiblePosts = filteredPosts.slice(0, displayedPosts);
  const hasMorePosts = filteredPosts.length > displayedPosts;

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} sx={{ mt: 3, p: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <ArticleIcon sx={{ fontSize: 32, mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1" color="primary">
            Posts
          </Typography>
        </Box>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="primary" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 4 }}
        />

        {filteredPosts.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ p: 4, textAlign: "center", bgcolor: "#f5f5f5" }}
          >
            <Typography color="textSecondary" variant="h6">
              No posts found matching your search
            </Typography>
          </Paper>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(2, 1fr)",
                },
                gap: 3,
                width: "100%",
              }}
            >
              {visiblePosts.map((post) => (
                <Box key={post.id}>
                  <Card
                    elevation={2}
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 4,
                        cursor: "pointer",
                      },
                    }}
                    onClick={() => handlePostClick(post.id)}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom noWrap>
                        {post.title}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {post.body}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end", p: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(post);
                        }}
                        sx={{ color: "primary.main" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(post.id);
                        }}
                        sx={{ color: "error.main" }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </Box>
              ))}
            </Box>

            {hasMorePosts && (
              <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleLoadMore}
                  size="large"
                  sx={{
                    px: 4,
                    py: 1,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.1rem",
                  }}
                >
                  Load More Posts
                </Button>
              </Box>
            )}
          </>
        )}
      </Paper>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h5">Edit Post</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: 2 }}>
          <TextField
            autoFocus
            margin="normal"
            label="Title"
            fullWidth
            variant="outlined"
            value={editingPost?.title || ""}
            onChange={(e) =>
              setEditingPost((prev) =>
                prev ? { ...prev, title: e.target.value } : null
              )
            }
          />
          <TextField
            margin="normal"
            label="Content"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={editingPost?.body || ""}
            onChange={(e) =>
              setEditingPost((prev) =>
                prev ? { ...prev, body: e.target.value } : null
              )
            }
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setEditDialogOpen(false)}
            variant="outlined"
            color="inherit"
          >
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PostsList;
