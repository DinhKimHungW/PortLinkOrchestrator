import apiClient from './apiClient';
import endpoints from '../constants/apiEndpoints';

export async function fetchActiveSchedule(params) {
  const response = await apiClient.get(endpoints.schedule.active, { params });
  return response.data;
}

export async function fetchSchedule(params) {
  const response = await apiClient.get(endpoints.schedule.list, { params });
  return response.data;
}

export async function triggerRecalculate(payload) {
  const response = await apiClient.post(endpoints.schedule.recalc, payload);
  return response.data;
}

export async function submitIncident(payload) {
  const response = await apiClient.post(endpoints.incidents, payload);
  return response.data;
}
