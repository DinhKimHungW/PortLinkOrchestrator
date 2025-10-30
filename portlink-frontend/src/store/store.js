import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import scheduleReducer from './slices/scheduleSlice';
import logReducer from './slices/logSlice';
import kpiReducer from './slices/kpiSlice';
import assetReducer from './slices/assetSlice';
import visitReducer from './slices/visitSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    schedules: scheduleReducer,
    logs: logReducer,
    kpis: kpiReducer,
    assets: assetReducer,
    visits: visitReducer,
  },
});

export default store;
