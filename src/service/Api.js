import axios from 'axios';

const API_URL = 'http://localhost:8080/'; // Adjust this to your backend URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = (email, password) => api.post('/api/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const getUserData = () => api.get('/user/data');
export const getStatistics = () => api.get('/statistics/export', { responseType: 'blob' });

export default api;