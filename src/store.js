import { configureStore } from '@reduxjs/toolkit';
import stylistProfileReducer from './hooks/stylistProfileSlice';
import stylistAvailabilityReducer from './hooks/stylistAvailabilitySlice';

const store = configureStore({
  reducer: {
    stylistProfile: stylistProfileReducer,
    // stylistAvailability: stylistAvailabilityReducer,
  },
});

export default store; 