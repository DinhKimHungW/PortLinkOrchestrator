import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
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
    },
  },
});

export const { setAssets, setAssetsLoading } = assetSlice.actions;
export default assetSlice.reducer;
