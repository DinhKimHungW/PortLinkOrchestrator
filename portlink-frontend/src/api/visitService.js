import apiClient from './apiClient';
import endpoints from '../constants/apiEndpoints';

export async function fetchVisits(params) {
  const response = await apiClient.get(endpoints.visits, { params });
  return response.data;
}
