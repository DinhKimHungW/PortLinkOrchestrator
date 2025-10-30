import apiClient from './apiClient';
import endpoints from '../constants/apiEndpoints';

export async function fetchKpis() {
  const response = await apiClient.get(endpoints.kpis);
  return response.data;
}
