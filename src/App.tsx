import React from "react";
import { Container, Typography, Box } from "@mui/material";
import PostsList from "./components/PostsList";
import PostDetail from "./components/PostDetail";
import AddPostForm from "./components/AddPostForm";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Container maxWidth="lg">
          <Box sx={{ my: 4 }}>
            <Typography variant="h3" component="h1" gutterBottom>
              Posts Manager
            </Typography>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <AddPostForm />
                    <PostsList />
                  </>
                }
              />
              <Route path="/post/:id" element={<PostDetail />} />
            </Routes>
          </Box>
        </Container>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
