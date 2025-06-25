import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchStylistProfile } from './stylistProfileSlice';

export default function useStylistProfile() {
  const dispatch = useDispatch();
  const { profile, loading, error } = useSelector((state) => state.stylistProfile);

  useEffect(() => {
    if (!profile && !loading && !error) {
      dispatch(fetchStylistProfile());
    }
  }, [dispatch, profile, loading, error]);

  return { profile, loading, error };
} 