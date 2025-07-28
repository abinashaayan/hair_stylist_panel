import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStylistAvailability } from './stylistAvailabilitySlice';

export default function useStylistAvailability() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state) => state.stylistAvailability);

  useEffect(() => {
    if (data.length === 0 && !loading && !error) {
      dispatch(fetchStylistAvailability());
    }
    // Note: Only dispatch and data are in deps now (not data.length, loading, error)
  }, [dispatch, data]);

  return { data, loading, error };
}
