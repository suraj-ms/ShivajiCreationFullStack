import axios from 'axios';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BACKEND_API_URL}`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;
