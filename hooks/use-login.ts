import { useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/redux/hooks';
import { useLoginMutation } from '@/redux/features/authApiSlice';
import { setAuth } from '@/redux/features/authSlice';
import { toast } from 'react-toastify';
import { useRetrieveUserQuery } from '@/redux/features/authApiSlice';

export default function useLogin() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const { refetch } = useRetrieveUserQuery();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      const { access, refresh } = result;
      localStorage.setItem('accessToken', access);
      dispatch(setAuth({ refreshToken: refresh }));
  
      // Manually trigger refetch of user data
      refetch();
  
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    }
  };
  

  return {
    email,
    password,
    isLoading,
    onChange,
    onSubmit,
  };
}
