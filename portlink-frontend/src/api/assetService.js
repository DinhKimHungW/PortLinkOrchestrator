import apiClient from './apiClient';
import endpoints from '../constants/apiEndpoints';

export async function fetchAssets(params) {
  const response = await apiClient.get(endpoints.assets, { params });
  return response.data;
}
