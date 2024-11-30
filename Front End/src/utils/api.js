import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BACKEND_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor to attach the token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor to handle token expiration and auto logout
api.interceptors.response.use(
  (response) => {
    // Normal response, just return it
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      toast.error('Session expired. Please log in again.');
      // Token expired or unauthorized, trigger logout
      localStorage.removeItem('authToken');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error); // Reject the error
  }
);

export default api;
