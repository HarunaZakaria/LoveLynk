import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(`${API_URL}/api/auth/refresh`, {
          refreshToken,
        });

        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: { email: string; password: string }) => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
};

// User API
export const userApi = {
  getMe: async () => {
    const { data } = await api.get('/users/me');
    return data;
  },
  updateMe: async (userData: any) => {
    const { data } = await api.put('/users/me', userData);
    return data;
  },
  uploadPhoto: async (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    const { data } = await api.post('/users/upload-photo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data;
  },
};

// Discovery API
export const discoveryApi = {
  getStack: async (limit = 50) => {
    const { data } = await api.get(`/discovery/stack?limit=${limit}`);
    return data;
  },
  swipe: async (swipeData: { swipedId: string; action: string; compatibilityScore: number }) => {
    const { data } = await api.post('/discovery/swipe', swipeData);
    return data;
  },
};

// Match API
export const matchApi = {
  getMatches: async () => {
    const { data } = await api.get('/matches');
    return data;
  },
  getMatch: async (id: string) => {
    const { data } = await api.get(`/matches/${id}`);
    return data;
  },
  getCompatibility: async (id: string) => {
    const { data } = await api.get(`/matches/${id}/compatibility`);
    return data;
  },
};

// Chat API
export const chatApi = {
  getChats: async () => {
    const { data } = await api.get('/chats');
    return data;
  },
  getChat: async (matchId: string) => {
    const { data } = await api.get(`/chats/${matchId}`);
    return data;
  },
  sendMessage: async (matchId: string, message: { content: string; type?: string; audioUrl?: string }) => {
    const { data } = await api.post(`/chats/${matchId}/messages`, message);
    return data;
  },
};

// Quest API
export const questApi = {
  getAvailable: async () => {
    const { data } = await api.get('/quests/available');
    return data;
  },
  createQuest: async (questData: any) => {
    const { data } = await api.post('/quests', questData);
    return data;
  },
};

export default api;

