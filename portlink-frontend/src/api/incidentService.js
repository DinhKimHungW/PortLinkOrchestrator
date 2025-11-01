import apiClient from './apiClient';
import endpoints from '../constants/apiEndpoints';

export async function fetchIncidents(params) {
  const response = await apiClient.get(endpoints.incidents, { params });
  return response.data;
}

export async function createIncident(payload) {
  const response = await apiClient.post(endpoints.incidents, payload);
  return response.data;
}
