import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: null,
  loading: false,
  error: null,
  history: [],
};

const kpiSlice = createSlice({
  name: 'kpis',
  initialState,
  reducers: {
    setKpis(state, action) {
      state.metrics = action.payload || null;
      if (state.metrics) {
        state.history = [state.metrics, ...state.history].slice(0, 12);
      }
      state.error = null;
    },
    setKpisLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setKpisError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { setKpis, setKpisLoading, setKpisError } = kpiSlice.actions;
export default kpiSlice.reducer;
