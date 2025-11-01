import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  version: null,
  updatedAt: null,
  summary: null,
  scheduleId: null,
  error: null,
  filters: {
    horizon: '24h',
  },
};

const scheduleSlice = createSlice({
  name: 'schedules',
  initialState,
  reducers: {
    setSchedules(state, action) {
      const payload = action.payload || {};
      const source = payload.items || payload.tasks || payload;
      state.items = Array.isArray(source) ? source : [];

      const versionCandidate = Object.prototype.hasOwnProperty.call(payload, 'version')
        ? payload.version
        : Object.prototype.hasOwnProperty.call(payload, 'scheduleVersion')
        ? payload.scheduleVersion
        : undefined;
      if (versionCandidate !== undefined) {
        state.version = versionCandidate;
      }

      const updatedCandidate = Object.prototype.hasOwnProperty.call(payload, 'updatedAt')
        ? payload.updatedAt
        : Object.prototype.hasOwnProperty.call(payload, 'generatedAt')
        ? payload.generatedAt
        : Object.prototype.hasOwnProperty.call(payload, 'createdAt')
        ? payload.createdAt
        : undefined;
      if (updatedCandidate !== undefined) {
        state.updatedAt = updatedCandidate;
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'summary')) {
        state.summary = payload.summary;
      }

      if (Object.prototype.hasOwnProperty.call(payload, 'scheduleId')) {
        state.scheduleId = payload.scheduleId;
      }

      state.error = null;
    },
    setLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setSchedulesError(state, action) {
      state.error = action.payload;
    },
    setScheduleFilters(state, action) {
      state.filters = { ...state.filters, ...(action.payload || {}) };
    },
    clearSchedules(state) {
      state.items = [];
      state.version = null;
      state.updatedAt = null;
       state.summary = null;
       state.scheduleId = null;
      state.error = null;
    },
  },
});

export const { setSchedules, setLoading, setSchedulesError, setScheduleFilters, clearSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
