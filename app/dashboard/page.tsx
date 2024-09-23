'use client';

import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';
import { List, Spinner } from '@/components/common';

export default function Page() {
  const { data: user, isLoading, isFetching, error } = useRetrieveUserQuery();

  // Configuration for displaying user details in the List component
  const config = [
    {
      label: 'First Name',
      value: user?.first_name || 'N/A',
    },
    {
      label: 'Last Name',
      value: user?.last_name || 'N/A',
    },
    {
      label: 'Email',
      value: user?.email || 'N/A',
    },
  ];

  // Show a spinner while data is loading or fetching
  if (isLoading || isFetching) {
    return (
      <div className='flex justify-center my-8'>
        <Spinner lg />
      </div>
    );
  }

  // Display an error message if fetching user data fails
  if (error) {
    console.error('Error fetching user:', error);
    return (
      <div className='flex justify-center my-8'>
        <p className='text-red-500'>Failed to load user data. Please try again later.</p>
      </div>
    );
  }

  // Render a message if no user data is available
  if (!user) {
    return (
      <div className='flex justify-center my-8'>
        <p className='text-gray-500'>No user data available.</p>
      </div>
    );
  }

  return (
    <>
      <header className='bg-white shadow'>
        <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
          <h1 className='text-3xl font-bold tracking-tight text-gray-900'>
            Dashboard
          </h1>
        </div>
      </header>
      <main className='mx-auto max-w-7xl py-6 my-8 sm:px-6 lg:px-8'>
        <List config={config} />
      </main>
    </>
  );
}
