import axios from 'axios';
import { environment_urls } from './URLS';

const baseURL = environment_urls.URLS.baseURL;

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // Add timeout
});

// Request interceptor to add the access token to headers
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = localStorage.getItem('refresh_token');

    // Handle network errors (timeout, SSL redirect issues, etc.)
    if (!error.response) {
      console.error('Network error:', error.message);
      // If it's a network error, don't try to refresh tokens
      return Promise.reject(error);
    }

    // Check if error.response exists before accessing its properties
    if (error.response && error.response.status === 401 && refreshToken && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const response = await axios.post(`${baseURL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem('access_token', response.data.access);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Refresh token is invalid', refreshError);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        // window.location.href = '/'; 
      }
    } else if (error.response && error.response.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      // window.location.href = '/'; 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;