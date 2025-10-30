import axios from 'axios';
import { getStoredToken } from '../lib/authStorage';

const API_URL = import.meta.env.VITE_API_URL || process.env.API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
  const storage = typeof window !== 'undefined' ? window.localStorage : null;
  const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const lang = storage?.getItem('lang');
    if (lang) {
      config.headers['Accept-Language'] = lang;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const storage = typeof window !== 'undefined' ? window.localStorage : null;
  const local = typeof window !== 'undefined' ? window.localStorage : null;
  const session = typeof window !== 'undefined' ? window.sessionStorage : null;
  local?.removeItem('token');
  session?.removeItem('token');
    }
    return Promise.reject(error);
  },
);

export default apiClient;
