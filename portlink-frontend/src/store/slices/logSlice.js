import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  hasMore: false,
  error: null,
  page: 1,
  pageSize: 10,
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
      if (action.payload) {
        state.error = null;
      }
    },
    setHasMore(state, action) {
      state.hasMore = action.payload;
    },
    setLogsError(state, action) {
      state.error = action.payload;
    },
    setLogsPage(state, action) {
      const { page, pageSize } = action.payload || {};
      state.page = page ?? state.page;
      state.pageSize = pageSize ?? state.pageSize;
    },
    clearLogs(state) {
      state.items = [];
      state.hasMore = false;
      state.error = null;
    },
  },
});

export const {
  setLogs,
  appendLogs,
  setLogsLoading,
  setHasMore,
  setLogsError,
  setLogsPage,
  clearLogs,
} = logSlice.actions;
export default logSlice.reducer;
