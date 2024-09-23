'use client';

import { useVerify } from '@/hooks';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Setup({ token, refreshToken }: { token: string | null; refreshToken: string }) {
    useVerify(token, refreshToken); // Pass the token and refreshToken here

    return <ToastContainer />;
}
