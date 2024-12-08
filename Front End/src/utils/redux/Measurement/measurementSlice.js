import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pantMeasurements: {
    Length: '',
    width: '',
    Hip: '',
    Fork: '',
    Bottom: '',
    Rt: '',
    Knee: ''
  },
  shirtMeasurements: {
    Length: '',
    Shoulder: '',
    FullLength: '',
    fElbow: '',
    DownWidth: '',
    Cuff: '',
    HalfLength: '',
    hElbow: '',
    Neck: '',
    Rf1: '',
    Rf2: '',
    Rf3: '',
    Rf4: ''
  }
};

const measurementSlice = createSlice({
  name: 'measurements',
  initialState,
  reducers: {
    updatePantMeasurement: (state, action) => {
      const { field, value } = action.payload;
      state.pantMeasurements[field] = value;
    },
    updateShirtMeasurement: (state, action) => {
      const { field, value } = action.payload;
      state.shirtMeasurements[field] = value;
    },
    resetPantMeasurements: (state) => {
      state.pantMeasurements = initialState.pantMeasurements;
    },
    resetShirtMeasurements: (state) => {
      state.shirtMeasurements = initialState.shirtMeasurements;
    }
  }
});

export const {
  updatePantMeasurement,
  updateShirtMeasurement,
  resetPantMeasurements,
  resetShirtMeasurements
} = measurementSlice.actions;
export default measurementSlice.reducer;
