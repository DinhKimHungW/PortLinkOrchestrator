import { createSlice } from '@reduxjs/toolkit';
import { getStoredToken } from '../../lib/authStorage';

const tokenFromStorage = getStoredToken();

const initialState = {
  user: null,
  token: tokenFromStorage,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setUser, setToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;
