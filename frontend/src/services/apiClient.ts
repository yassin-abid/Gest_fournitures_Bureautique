/**
 * API Client Configuration
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { localStorageUtil, storageKeys } from '@utils/storage';
import { handleApiError } from '@utils/errorHandler';

const API_BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) || 'http://localhost:3000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorageUtil.get<string>(storageKeys.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const apiError = handleApiError(error);

    // Handle 401 - redirect to login
    if (error.response?.status === 401) {
      localStorageUtil.clear();
      window.location.href = '/login';
    }

    // Wrap in a real Error so .message is always accessible in catch blocks
    const err = new Error(apiError.message || 'Une erreur est survenue');
    (err as any).code = apiError.code;
    (err as any).details = apiError.details;
    return Promise.reject(err);
  }
);

export default apiClient;
