import type { Post, Thread, ThreadRequest } from '../types';
import { api } from './client';

export const threadsApi = {
  get: (id: number | string) =>
    api.get<Thread>(`/threads/${id}`, { auth: false }),
  create: (body: ThreadRequest) => api.post<Thread>('/threads', body),
  posts: (threadId: number | string) =>
    api.get<Post[]>(`/threads/${threadId}/posts`, { auth: false }),
};
