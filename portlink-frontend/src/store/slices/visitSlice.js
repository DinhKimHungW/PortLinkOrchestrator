import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    view: 'list',
    query: '',
  },
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
      if (action.payload) {
        state.error = null;
      }
    },
    setVisitsError(state, action) {
      state.error = action.payload;
    },
    setVisitFilters(state, action) {
      state.filters = { ...state.filters, ...(action.payload || {}) };
    },
  },
});

export const { setVisits, setVisitsLoading, setVisitsError, setVisitFilters } = visitSlice.actions;
export default visitSlice.reducer;
