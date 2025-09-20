"use client";

import axios from 'axios';

// Base configuration
const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Sponsors API
export const sponsorsApi = {
  getAll: async () => {
    const response = await apiClient.get('/sponsors');
    return response.data;
  },
  getByCategory: async (category: string) => {
    const response = await apiClient.get(`/sponsors?category=${encodeURIComponent(category)}`);
    return response.data;
  },
  create: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post('/sponsors', data, { headers });
    return response.data;
  },
  update: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.put('/sponsors', data, { headers });
    return response.data;
  },
  delete: async (id: string, category: string) => {
    const response = await apiClient.delete(`/sponsors?id=${encodeURIComponent(id)}&category=${encodeURIComponent(category)}`);
    return response.data;
  }
};

// TechspardhaTeams API
export const techspardhaTeamsApi = {
  getAll: async () => {
    const response = await apiClient.get('/techspardha-teams');
    return response.data;
  },
  getByName: async (teamName: string) => {
    const response = await apiClient.get(`/techspardha-teams/${encodeURIComponent(teamName)}`);
    return response.data;
  },
  create: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post('/techspardha-teams', data, { headers });
    return response.data;
  },
  update: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.put('/techspardha-teams', data, { headers });
    return response.data;
  },
  delete: async (teamName: string) => {
    const response = await apiClient.delete(`/techspardha-teams?team=${encodeURIComponent(teamName)}`);
    return response.data;
  }
};

// Lectures API
export const lecturesApi = {
  getAll: async () => {
    const response = await apiClient.get('/lectures');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/lectures?id=${encodeURIComponent(id)}`);
    return response.data;
  },
  create: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post('/lectures', data, { headers });
    return response.data;
  },
  update: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.put('/lectures', data, { headers });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/lectures?id=${encodeURIComponent(id)}`);
    return response.data;
  }
};

// Events API
export const eventsApi = {
  getAll: async () => {
    const response = await apiClient.get('/events');
    return response.data;
  },
  getByName: async (category: string, eventName: string) => {
    const response = await apiClient.get(`/events?category=${encodeURIComponent(category)}&eventName=${encodeURIComponent(eventName)}`);
    return response.data;
  },
  getByCategory: async (category: string) => {
    const response = await apiClient.get(`/events?category=${encodeURIComponent(category)}`);
    return response.data;
  },
  create: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post('/events', data, { headers });
    return response.data;
  },
  update: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.put('/events', data, { headers });
    return response.data;
  },
  delete: async (category: string, eventName: string) => {
    const response = await apiClient.delete(`/events?category=${encodeURIComponent(category)}&eventName=${encodeURIComponent(eventName)}`);
    return response.data;
  }
};

// Event Categories API
export const eventCategoriesApi = {
  getAll: async () => {
    const response = await apiClient.get('/event-categories');
    return response.data;
  },
  getById: async (id: string) => {
    const response = await apiClient.get(`/event-categories?id=${encodeURIComponent(id)}`);
    return response.data;
  },
  create: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.post('/event-categories', data, { headers });
    return response.data;
  },
  update: async (data: FormData | object) => {
    const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {};
    const response = await apiClient.put('/event-categories', data, { headers });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await apiClient.delete(`/event-categories?id=${encodeURIComponent(id)}`);
    return response.data;
  }
};

// Admin API
export const adminApi = {
  // Category management
  getAllCategories: async () => {
    const response = await apiClient.get('/admin/category');
    return response.data;
  },
  addCategory: async (data: object) => {
    const response = await apiClient.post('/admin/category', data);
    return response.data;
  },
  
  // Query management
  deleteQuery: async (id: string) => {
    const response = await apiClient.put('/admin/query', { id });
    return response.data;
  },
  
  // Communication
  sendMail: async (data: object) => {
    const response = await apiClient.post('/admin/mail', data);
    return response.data;
  },
  sendNotification: async (data: object) => {
    const response = await apiClient.post('/admin/notification', data);
    return response.data;
  },
  
  // User management
  updateAllUsers: async (data: object) => {
    const response = await apiClient.post('/admin/update-users', data);
    return response.data;
  },
  updateUser: async (data: object) => {
    const response = await apiClient.post('/admin/user', data);
    return response.data;
  }
};

// Users API
export const usersApi = {
  getRegisteredEvents: async (userId?: string) => {
    const url = userId ? `/users?userId=${encodeURIComponent(userId)}` : '/users';
    const response = await apiClient.get(url);
    return response.data;
  },
  registerForEvent: async (data: object) => {
    const response = await apiClient.put('/users', data);
    return response.data;
  },
  unregisterFromEvent: async (data: object) => {
    const response = await apiClient.put('/users?action=unregister', data);
    return response.data;
  },
  addQuery: async (data: object) => {
    const response = await apiClient.post('/users', data);
    return response.data;
  }
};

export default {
  sponsors: sponsorsApi,
  techspardhaTeams: techspardhaTeamsApi,
  lectures: lecturesApi,
  events: eventsApi,
  eventCategories: eventCategoriesApi,
  admin: adminApi,
  users: usersApi
};