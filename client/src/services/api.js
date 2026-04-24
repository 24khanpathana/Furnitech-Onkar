import axios from 'axios';

const DEFAULT_REMOTE_API_URL = 'https://furnitech-onkar.onrender.com/api';
const DEFAULT_LOCAL_API_URL = '/api';

const normalizeApiBaseUrl = (value) => {
  const fallback = DEFAULT_LOCAL_API_URL;
  if (!value) {
    return fallback;
  }

  const trimmed = value.replace(/\/+$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
};

const resolveApiBaseUrl = () => {
  const configured = process.env.REACT_APP_API_URL;
  if (configured) {
    return normalizeApiBaseUrl(configured);
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return DEFAULT_LOCAL_API_URL;
    }
  }

  return DEFAULT_REMOTE_API_URL;
};

const API = axios.create({
  baseURL: resolveApiBaseUrl(),
  timeout: 20000,
});

API.interceptors.request.use((config) => {
  const stored = localStorage.getItem('onkar_auth');
  if (stored) {
    const { token } = JSON.parse(stored);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const loginAdmin = (payload) => API.post('/auth/login-admin', payload);
export const loginWorker = (payload) => API.post('/auth/login-worker', payload);
export const signupWorker = (payload) => API.post('/auth/signup-worker', payload);
export const forgotPassword = (payload) => API.post('/auth/forgot-password', payload);
export const resetPassword = (payload) => API.post('/auth/reset-password', payload);
export const getProfile = () => API.get('/auth/me');
export const getPendingWorkers = () => API.get('/auth/pending-workers');
export const reviewWorkerRequest = (workerId, action) => API.patch(`/auth/workers/${workerId}/review`, { action });

export const createOrder = (payload) => API.post('/orders', payload);
export const getOrders = (params) => API.get('/orders', { params });
export const getRecentOrders = (limit = 10) => API.get('/orders/recent', { params: { limit } });
export const getOrderByOrderId = (orderId) => API.get(`/orders/${orderId}`);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
export const deleteOrder = (id) => API.delete(`/orders/${id}`);
export const getDeletedOrders = () => API.get('/orders/deleted');
export const getDashboardSummary = () => API.get('/orders/dashboard/summary');
export const downloadOrdersCsv = () => API.get('/orders/export/csv', { responseType: 'blob' });

export const getNotifications = () => API.get('/notifications');
