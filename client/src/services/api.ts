import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const auth = {
  register: (data: { email: string; password: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// URL API
export const urls = {
  create: (data: { originalUrl: string; customAlias?: string }) =>
    api.post('/urls', data),
  getAll: () => api.get('/urls'),
  getOne: (id: string) => api.get(`/urls/${id}`),
  getStats: (id: string) => api.get(`/urls/${id}/stats`),
  redirect: (shortUrl: string) => api.get(`/urls/redirect/${shortUrl}`),
};

// Wallet API
export const wallet = {
  getBalance: () => api.get('/wallet'),
  withdraw: (data: { amount: number }) => api.post('/wallet/withdraw', data),
  getTransactions: (page = 1, limit = 10) =>
    api.get(`/wallet/transactions?page=${page}&limit=${limit}`),
  getTransaction: (id: string) => api.get(`/wallet/transactions/${id}`),
};

export default api; 