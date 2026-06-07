import type { Category, Thread } from '../types';
import { api } from './client';

export const categoriesApi = {
  list: () => api.get<Category[]>('/categories', { auth: false }),
  get: (id: number | string) =>
    api.get<Category>(`/categories/${id}`, { auth: false }),
  create: (body: { name: string; description?: string }) =>
    api.post<Category>('/categories', body),
  threads: (categoryId: number | string) =>
    api.get<Thread[]>(`/categories/${categoryId}/threads`, { auth: false }),
};
