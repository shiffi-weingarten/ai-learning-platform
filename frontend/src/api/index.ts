import axios from 'axios';
import type { AuthResponse, Category, Prompt, PaginatedResponse, User } from '../types';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const register = (data: { name: string; phone: string; password: string }) =>
  api.post<AuthResponse>('/auth/register', data).then((r) => r.data);

export const login = (data: { phone: string; password: string }) =>
  api.post<AuthResponse>('/auth/login', data).then((r) => r.data);

// Categories
export const getCategories = () =>
  api.get<Category[]>('/categories').then((r) => r.data);

// Prompts
export const submitPrompt = (data: { categoryId: number; subCategoryId: number; prompt: string }) =>
  api.post<Prompt>('/prompts', data).then((r) => r.data);

export const getHistory = (page = 1, limit = 10) =>
  api.get<PaginatedResponse<Prompt>>(`/prompts/history?page=${page}&limit=${limit}`).then((r) => r.data);

// Admin
export const adminGetUsers = (page = 1, limit = 20, search = '') =>
  api
    .get<PaginatedResponse<User & { _count: { prompts: number } }>>(
      `/admin/users?page=${page}&limit=${limit}&search=${search}`
    )
    .then((r) => r.data);

export const adminGetUserPrompts = (userId: number, page = 1, limit = 10) =>
  api
    .get<{ user: User } & PaginatedResponse<Prompt>>(
      `/admin/users/${userId}/prompts?page=${page}&limit=${limit}`
    )
    .then((r) => r.data);
