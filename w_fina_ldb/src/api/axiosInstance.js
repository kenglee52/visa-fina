/**
 * Axios Instance Configuration
 * Centralized axios instance with interceptors for authentication and error handling
 */
import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '@/config/env.config';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token automatically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('employee');
      // Redirect to login
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
