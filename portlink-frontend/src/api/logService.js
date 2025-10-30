import apiClient from './apiClient';
import endpoints from '../constants/apiEndpoints';

export async function fetchLogs(params) {
  const response = await apiClient.get(endpoints.logs, { params });
  return response.data;
}

export function getLogsExportUrl() {
  const base = apiClient.defaults.baseURL || '';
  return `${base}${endpoints.logsExport}`;
}
