import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useEffect } from 'react';
import { fetchUserProfile } from '../store/slices/userSlice';
import { useAppDispatch } from './useAppDispatch';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  const { profile } = useSelector((state: RootState) => state.user);

  // Fetch user profile if authenticated but profile not loaded
  useEffect(() => {
    if (isAuthenticated && token && !profile) {
      dispatch(fetchUserProfile() as any);
    }
  }, [isAuthenticated, token, profile, dispatch]);

  return {
    isAuthenticated,
    user: user || (profile ? { _id: profile._id, email: profile.email } : null),
    token,
    profile,
  };
};

