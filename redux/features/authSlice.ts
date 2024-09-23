import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshToken?: string; // Add this line to include refreshToken
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ refreshToken: string }>) => {
      state.isAuthenticated = true;
      state.refreshToken = action.payload.refreshToken; // Set the refresh token
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.refreshToken = undefined; // Clear the refresh token on logout
    },
    finishInitialLoad: (state) => {
      state.isLoading = false;
    },
  },
});

export const { setAuth, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;
