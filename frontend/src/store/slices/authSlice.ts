import { createSlice, PayLoadAction } from '@reduxjs/toolkit';

interface AuthUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    token: string;
}

interface AuthState {
    user: AuthUser | null;
}

const storedUser = localStorage.getItem('user');

const initialState: AuthState = {
    // Rehydrate user from localStorage on page refresh
    user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      localStorage.setItem('user', JSON.stringify(action.payload));
      localStorage.setItem('token', action.payload.token);
    },
    logout(state) {
      state.user = null;
      localStorage.removeItem('user');
      localStorage.removeItem('tokn');
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;