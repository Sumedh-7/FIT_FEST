import axios from 'axios';

const API_BASE_URL = 'http://localhost:8001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const requestService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data;
  },

  async createRequest(data) {
    const response = await api.post('/requests', data);
    const req = response.data;
    this.saveLocalRequest(req);
    return req;
  },

  async getRequestById(identifier) {
    const response = await api.get(
      `/requests/${encodeURIComponent(identifier)}`
    );
    return response.data;
  },

async updateStatus(identifier, status) {
  const response = await api.patch(
    `/requests/${encodeURIComponent(identifier)}/status`,
    { status }
  );

  return response.data;
},
  async getRequests(params = {}) {
    const response = await api.get('/requests', { params });
    return response.data;
  },

  async getStats() {
    const response = await api.get('/stats');
    return response.data;
  },

async adminLogin() {
  return { authenticated: true };
},

async getAdminDashboard(params = {}) {
  const response = await api.get('/requests', { params });
  return response.data;
},

  saveLocalRequest(req) {
    try {
      const history = this.getLocalRequests();

      const exists = history.some(
        item => item.request_id === req.request_id
      );

      if (!exists) {
        history.unshift(req);
        localStorage.setItem(
          'ecocollect_my_requests',
          JSON.stringify(history)
        );
      }
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  },

  getLocalRequests() {
    try {
      const data = localStorage.getItem('ecocollect_my_requests');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to read from localStorage:', e);
      return [];
    }
  },
};