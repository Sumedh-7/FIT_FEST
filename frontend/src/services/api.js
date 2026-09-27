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

  async updateStatus(identifier, status, credentials = null) {
    const response = await api.patch(
      `/requests/${encodeURIComponent(identifier)}/status`,
      { status },
      credentials
        ? {
            auth: {
              username: credentials.username,
              password: credentials.password,
            },
          }
        : {}
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

  // ADMIN LOGIN
  async adminLogin(credentials) {
    const response = await api.post('/admin/session', null, {
      auth: {
        username: credentials.username,
        password: credentials.password,
      },
    });

    return response.data;
  },

  // ADMIN DASHBOARD
  async getAdminDashboard(params = {}, credentials) {
    const response = await api.get('/admin/dashboard', {
      params,
      auth: {
        username: credentials.username,
        password: credentials.password,
      },
    });

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