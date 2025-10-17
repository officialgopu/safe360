import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface OverviewStats {
  totalAlertsToday: number;
  crimeAlerts: number;
  fraudAlerts: number;
  weatherAlerts: number;
  activeResponders: number;
  avgResponseTime: number;
}

const adminApi = {
  // Overview stats
  getOverviewStats: async (): Promise<OverviewStats> => {
    const response = await api.get('/admin/overview');  // ← CHANGED from /api/admin/overview
    return response.data;
  },
};

export default adminApi;