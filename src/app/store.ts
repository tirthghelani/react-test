import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../features/posts/postsSlice';
import authReducer from '../features/auth/authSlice';
import productsReducer from '../features/products/productsSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    auth: authReducer,
    products: productsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 