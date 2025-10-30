import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
};

const visitSlice = createSlice({
  name: 'visits',
  initialState,
  reducers: {
    setVisits(state, action) {
      state.items = action.payload || [];
    },
    setVisitsLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export const { setVisits, setVisitsLoading } = visitSlice.actions;
export default visitSlice.reducer;
