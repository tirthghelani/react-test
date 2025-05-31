import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

interface PostsState {
  posts: Post[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: 'idle',
  error: null
};

const API_URL = 'https://dummyjson.com/posts';

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const token = localStorage.getItem('token');
  const response = await axios.get(API_URL, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // The API returns { posts: Post[], total: number, skip: number, limit: number }
  return response.data.posts || [];
});

export const addNewPost = createAsyncThunk('posts/addNewPost', async (post: Omit<Post, 'id'>) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(API_URL + '/add', post, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
});

export const updatePost = createAsyncThunk('posts/updatePost', async (post: Post) => {
  const token = localStorage.getItem('token');
  const response = await axios.put(`${API_URL}/${post.id}`, post, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
});

export const deletePost = createAsyncThunk('posts/deletePost', async (id: number) => {
  const token = localStorage.getItem('token');
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  // Return the deleted post id for filtering
  return id;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Ensure we're setting an array
        state.posts = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch posts';
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        if (action.payload) {
          state.posts.push(action.payload);
        }
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.posts.findIndex(post => post.id === action.payload.id);
          if (index !== -1) {
            state.posts[index] = action.payload;
          }
        }
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        if (action.payload) {
          state.posts = state.posts.filter(post => post.id !== action.payload);
        }
      });
  }
});

export default postsSlice.reducer; 