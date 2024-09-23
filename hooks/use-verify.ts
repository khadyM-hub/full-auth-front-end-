import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/hooks';
import { setAuth, finishInitialLoad } from '@/redux/features/authSlice';
import { useVerifyMutation } from '@/redux/features/authApiSlice';

export default function useVerify(token: string | null, refreshToken: string) {
	const dispatch = useAppDispatch();
	const [verify] = useVerifyMutation();

	useEffect(() => {
		if (token) {
			verify({ token }) // Pass the token as an argument
				.unwrap()
				.then(() => {
					dispatch(setAuth({ refreshToken })); // Pass refreshToken to setAuth
				})
				.finally(() => {
					dispatch(finishInitialLoad());
				});
		}
	}, [token, refreshToken, verify, dispatch]);
}
