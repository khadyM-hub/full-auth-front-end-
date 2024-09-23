import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError, BaseQueryApi } from '@reduxjs/toolkit/query';
import { setAuth, logout } from '../features/authSlice';
import { Mutex } from 'async-mutex';
import { RootState } from '../store'; // Ensure the RootState is correctly imported

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_HOST}/api`,
  credentials: 'include',
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api: BaseQueryApi,
  extraOptions
) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  console.log('Result before re-auth:', result); // Log the result before re-auth

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const state = api.getState() as RootState;
        const refreshToken = state.auth.refreshToken;

        // Check if refreshToken exists
        if (refreshToken) {
          console.log('Refreshing token...'); // Log that you're attempting to refresh the token

          const refreshResult = await baseQuery(
            {
              url: '/jwt/refresh/',
              method: 'POST',
              body: { refresh: refreshToken },
            },
            api,
            extraOptions
          );

          console.log('Refresh result:', refreshResult); // Log the result of the refresh attempt

          if (refreshResult.data) {
            api.dispatch(setAuth({ refreshToken })); // Pass the refresh token when setting auth
            result = await baseQuery(args, api, extraOptions);
          } else {
            api.dispatch(logout());
          }
        } else {
          console.log('No refresh token available, logging out...'); // Log if no refresh token is found
          api.dispatch(logout());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};


export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Auth'], // Define tag types used across your application
  endpoints: (builder) => ({}),
  
});

export default apiSlice;
