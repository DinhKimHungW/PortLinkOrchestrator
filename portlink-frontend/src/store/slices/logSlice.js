import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  hasMore: false,
};

const logSlice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    setLogs(state, action) {
      state.items = action.payload || [];
    },
    appendLogs(state, action) {
      const next = action.payload || [];
      state.items = [...state.items, ...next];
    },
    setLogsLoading(state, action) {
      state.loading = action.payload;
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
    clearLogs(state) {
      state.items = [];
      state.hasMore = false;
    },
  },
});

export const { setLogs, appendLogs, setLogsLoading, setHasMore, clearLogs } = logSlice.actions;
export default logSlice.reducer;
