import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  metrics: null,
  loading: false,
};

const kpiSlice = createSlice({
  name: 'kpis',
  initialState,
  reducers: {
    setKpis(state, action) {
      state.metrics = action.payload || null;
    },
    setKpisLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setKpis, setKpisLoading } = kpiSlice.actions;
export default kpiSlice.reducer;
