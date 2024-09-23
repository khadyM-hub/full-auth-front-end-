// authApiSlice.ts
import { apiSlice } from '../services/apiSlice';
import { RootState } from '../store';
import { createSelector } from '@reduxjs/toolkit';

// Define interfaces
interface User {
  first_name: string;
  last_name: string;
  email: string;
}

interface SocialAuthArgs {
  provider: string;
  state: string;
  code: string;
}

interface CreateUserResponse {
  success: boolean;
  user: User;
}

// Define the authApiSlice with all necessary endpoints
const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Retrieve the currently authenticated user
    retrieveUser: builder.query<User, void>({
      query: () => {
        return {
          url: '/users/me/',
          method: 'GET',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken') || ''}`, // Get access token from localStorage
          },
        };
      },
      providesTags: [{ type: 'User', id: 'ME' }],
    }),

    // Login mutation
    login: builder.mutation<{ access: string; refresh: string }, { email: string; password: string }>({
      query: ({ email, password }) => ({
        url: '/jwt/create/',
        method: 'POST',
        body: { email, password },
      }),
      invalidatesTags: [{ type: 'Auth', id: 'LIST' }],
    }),

    // Register a new user
    register: builder.mutation<CreateUserResponse, { first_name: string; last_name: string; email: string; password: string; re_password: string }>({
      query: ({ first_name, last_name, email, password, re_password }) => ({
        url: '/users/',
        method: 'POST',
        body: { first_name, last_name, email, password, re_password },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Verify JWT token
    verify: builder.mutation<void, { token: string }>({
      query: ({ token }) => ({
        url: '/jwt/verify/',
        method: 'POST',
        body: { token },
      }),
    }),

    // Logout mutation
    logout: builder.mutation<void, void>({
      query: () => {
        const accessToken = localStorage.getItem('accessToken'); // Get access token from localStorage
        return {
          url: '/logout/',
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken || ''}`,
          },
        };
      },
      // Add an invalidation tag to ensure the auth state is refreshed
      invalidatesTags: [{ type: 'User', id: 'ME' }, { type: 'Auth', id: 'LIST' }],
      async onQueryStarted(_, { dispatch }) {
        // Clear tokens on logout
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      },
    }),
    

    // Account activation mutation
    activation: builder.mutation<void, { uid: string; token: string }>({
      query: ({ uid, token }) => ({
        url: '/users/activation/',
        method: 'POST',
        body: { uid, token },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    // Request password reset
    resetPassword: builder.mutation<void, { email: string }>({
      query: (email) => ({
        url: '/users/reset_password/',
        method: 'POST',
        body: { email },
      }),
    }),

    // Confirm password reset
    resetPasswordConfirm: builder.mutation<void, { uid: string; token: string; new_password: string; re_new_password: string }>({
      query: ({ uid, token, new_password, re_new_password }) => ({
        url: '/users/reset_password_confirm/',
        method: 'POST',
        body: { uid, token, new_password, re_new_password },
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for all endpoints
export const {
  useRetrieveUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useVerifyMutation,
  useLogoutMutation,
  useActivationMutation,
  useResetPasswordMutation,
  useResetPasswordConfirmMutation,
} = authApiSlice;

export default authApiSlice;
