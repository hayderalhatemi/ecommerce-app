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