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

export interface Alert {
  id: number;
  type: 'crime' | 'fraud' | 'weather';
  location: string;
  severity: 'low' | 'medium' | 'high';
  status: 'pending' | 'assigned' | 'resolved';
  reportedOn: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'police' | 'ngo';
  zone: string;
  status: 'active' | 'inactive';
}

export interface DataStreamStatus {
  source: string;
  status: 'active' | 'delayed' | 'down';
  lastSync: string;
  dataVolume: number;
}

const adminApi = {
  // Overview stats
  getOverviewStats: async (): Promise<OverviewStats> => {
    const response = await api.get('/api/admin/overview');
    return response.data;
  },

  // Alerts
  getAlerts: async (params?: { 
    type?: string; 
    severity?: string; 
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: Alert[]; total: number }> => {
    const response = await api.get('/api/alerts/all', { params });
    return response.data;
  },

  // User Management
  getUsers: async (params?: {
    role?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ data: User[]; total: number }> => {
    const response = await api.get('/api/admin/users', { params });
    return response.data;
  },

  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    const response = await api.post('/api/admin/users', userData);
    return response.data;
  },

  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    const response = await api.put(`/api/admin/users/${id}`, userData);
    return response.data;
  },

  deleteUser: async (id: number): Promise<void> => {
    await api.delete(`/api/admin/users/${id}`);
  },

  // Data Streams Status
  getDataStreamsStatus: async (): Promise<DataStreamStatus[]> => {
    const response = await api.get('/api/admin/data-streams');
    return response.data;
  },

  // Reports
  generateReport: async (params: {
    type: 'weekly' | 'monthly';
    format: 'pdf' | 'csv';
    startDate: string;
    endDate: string;
  }): Promise<Blob> => {
    const response = await api.get('/api/admin/reports/generate', {
      params,
      responseType: 'blob',
    });
    return response.data;
  },

  // AI Insights
  getAIInsights: async (): Promise<{
    predictions: any;
    trends: any;
    correlations: any;
  }> => {
    const response = await api.get('/api/admin/ai-insights');
    return response.data;
  },
};

export default adminApi;