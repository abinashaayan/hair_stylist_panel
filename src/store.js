import { configureStore } from '@reduxjs/toolkit';
import stylistProfileReducer from './hooks/stylistProfileSlice';

const store = configureStore({
  reducer: {
    stylistProfile: stylistProfileReducer,
  },
});

export default store; 