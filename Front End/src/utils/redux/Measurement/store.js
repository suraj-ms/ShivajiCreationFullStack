import { configureStore } from '@reduxjs/toolkit';
import measurementReducer from './measurementSlice';

const store = configureStore({
  reducer: {
    measurements: measurementReducer
  }
});

export default store;
