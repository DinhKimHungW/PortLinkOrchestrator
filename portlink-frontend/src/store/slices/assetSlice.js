import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    query: '',
    type: 'all',
    status: 'all',
  },
};

const assetSlice = createSlice({
  name: 'assets',
  initialState,
  reducers: {
    setAssets(state, action) {
      state.items = action.payload || [];
    },
    setAssetsLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setAssetsError(state, action) {
      state.error = action.payload;
    },
    setAssetFilters(state, action) {
      state.filters = { ...state.filters, ...(action.payload || {}) };
    },
  },
});

export const { setAssets, setAssetsLoading, setAssetsError, setAssetFilters } = assetSlice.actions;
export default assetSlice.reducer;
