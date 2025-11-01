import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  loading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
  },
};

function normalizeIncident(raw) {
  if (!raw) return null;
  const status = raw.status || 'Open';
  return {
    ...raw,
    id: raw.id ?? raw.incidentId ?? raw?.incident?.incidentId,
    incidentId: raw.incidentId ?? raw.id ?? raw?.incident?.incidentId,
    status,
    statusLower: status.toLowerCase(),
  };
}

const incidentSlice = createSlice({
  name: 'incidents',
  initialState,
  reducers: {
    setIncidents(state, action) {
      const collection = Array.isArray(action.payload) ? action.payload : [];
      state.items = collection.map((item) => normalizeIncident(item)).filter(Boolean);
    },
    addIncident(state, action) {
      const payload = action.payload?.incident ?? action.payload;
      const incident = normalizeIncident(payload);
      if (!incident) return;
      state.items = [incident, ...state.items.filter((item) => item.id !== incident.id)];
    },
    updateIncidentStatus(state, action) {
      const { id, status } = action.payload || {};
      if (!id || !status) return;
      const normalizedStatus = status.toString();
      state.items = state.items.map((item) =>
        item.id === id || item.incidentId === id
          ? {
              ...item,
              status: normalizedStatus,
              statusLower: normalizedStatus.toLowerCase(),
              updatedAt: new Date().toISOString(),
            }
          : item,
      );
    },
    setIncidentsLoading(state, action) {
      state.loading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },
    setIncidentsError(state, action) {
      state.error = action.payload;
    },
    setIncidentFilters(state, action) {
      state.filters = { ...state.filters, ...(action.payload || {}) };
    },
    clearIncidents(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setIncidents,
  addIncident,
  updateIncidentStatus,
  setIncidentsLoading,
  setIncidentsError,
  setIncidentFilters,
  clearIncidents,
} = incidentSlice.actions;

export default incidentSlice.reducer;
