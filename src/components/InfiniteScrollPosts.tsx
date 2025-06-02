import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { fetchPosts, Post } from "../features/posts/postsSlice";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Container,
  Paper,
  Divider,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Article as ArticleIcon } from "@mui/icons-material";
import InfiniteScroll from "react-infinite-scroll-component";

const POSTS_PER_PAGE = 5;

const InfiniteScrollPosts = () => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector((state) => state.posts.posts);
  const status = useAppSelector((state) => state.posts.status);
  const error = useAppSelector((state) => state.posts.error);
  const navigate = useNavigate();

  const [displayedPosts, setDisplayedPosts] = useState<number>(POSTS_PER_PAGE);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPosts());
    }
  }, [status, dispatch]);

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  const fetchMoreData = () => {
    if (displayedPosts >= posts.length) {
      setHasMore(false);
      return;
    }

    // Simulate loading delay
    setTimeout(() => {
      setDisplayedPosts((prev) => prev + POSTS_PER_PAGE);
    }, 500);
  };

  if (status === "loading" && displayedPosts === POSTS_PER_PAGE) {
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

  const visiblePosts = posts.slice(0, displayedPosts);

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
          <ArticleIcon sx={{ fontSize: 40, mr: 2, color: "primary.main" }} />
          <Typography variant="h4" component="h1" color="primary">
            Posts Feed
          </Typography>
        </Box>

        <InfiniteScroll
          dataLength={visiblePosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={30} />
            </Box>
          }
          endMessage={
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant="body1" color="text.secondary">
                You have seen all posts! 🎉
              </Typography>
            </Box>
          }
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {visiblePosts.map((post: Post) => (
              <Card
                key={post.id}
                elevation={2}
                sx={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                  },
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>
                      {post.title.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          color: "primary.main",
                        }}
                      >
                        {post.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Post ID: {post.id} • User ID: {post.userId}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.7,
                      letterSpacing: 0.3,
                    }}
                  >
                    {post.body}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        </InfiniteScroll>
      </Box>
    </Container>
  );
};

export default InfiniteScrollPosts;
