import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import PostsList from "./components/PostsList";
import PostDetail from "./components/PostDetail";
import AddPostForm from "./components/AddPostForm";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { logout } from "./features/auth/authSlice";
import InfiniteScrollPosts from "./components/InfiniteScrollPosts";
import DynamicForm from "./components/DynamicForm";
import Products from "./components/Products";

const AppContent = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 0, mr: 4 }}>
            Posts Manager
          </Typography>
          {user && (
            <>
              <Tabs
                value={location.pathname}
                onChange={handleTabChange}
                sx={{ flexGrow: 1 }}
                textColor="inherit"
                indicatorColor="secondary"
              >
                <Tab label="Home" value="/" />
                <Tab label="Infinite Scroll" value="/infinite" />
                <Tab label="Form Builder" value="/form-builder" />
                <Tab label="Products" value="/products" />
              </Tabs>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <>
                    <AddPostForm />
                    <PostsList />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/infinite"
              element={
                <ProtectedRoute>
                  <InfiniteScrollPosts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/form-builder"
              element={
                <ProtectedRoute>
                  <DynamicForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <Products />
                </ProtectedRoute>
              }
            />
            <Route
              path="/post/:id"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Box>
      </Container>
    </>
  );
};

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  );
}

export default App;
