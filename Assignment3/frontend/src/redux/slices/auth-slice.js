import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import httpInstance from '../../http-common';

// Register thunk
export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }, thunkAPI) => {
    try {
      const response = await httpInstance.post('/auth/register', { name, email, password });
      return response.data.user; // Adjust based on your API response
    } catch (error) {
      // Return a rejected action with the error message
      return thunkAPI.rejectWithValue(error.response.data.message || 'Registration failed');
    }
  }
);

// Login thunk
export const login = createAsyncThunk(
  'auth/login',
  async ({ username, password }, thunkAPI) => {
    try {
      const response = await httpInstance.post('/auth/login', { username, password });
      return response.data.user; // Return user data
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message || 'Login failed');
    }
  }
);

// Auth Slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.isAuthenticated = false;
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
