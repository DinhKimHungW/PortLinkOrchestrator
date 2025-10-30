import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  version: null,
  updatedAt: null,
};

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setSchedules(state, action) {
      const payload = action.payload || {};
      state.items = payload.items || payload.tasks || payload;
      state.version = payload.version ?? state.version;
      state.updatedAt = payload.updatedAt ?? state.updatedAt;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearSchedules(state) {
      state.items = [];
      state.version = null;
      state.updatedAt = null;
    },
  },
});

export const { setSchedules, setLoading, clearSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
