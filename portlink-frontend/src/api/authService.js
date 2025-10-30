import apiClient from './apiClient';
import endpoints from '../constants/apiEndpoints';
import { storeToken as rememberToken, clearStoredToken } from '../lib/authStorage';

export async function login(credentials) {
  const response = await apiClient.post(endpoints.auth.login, credentials);
  return response.data;
}

export async function fetchCurrentUser() {
  const response = await apiClient.get(endpoints.auth.me);
  return response.data;
}

export function persistToken(token, remember = true) {
  rememberToken(token, remember);
}

export function clearToken() {
  clearStoredToken();
}
