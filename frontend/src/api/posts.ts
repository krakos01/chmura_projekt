import type { Attachment, Post, PostRequest } from '../types';
import { api } from './client';

export const postsApi = {
  create: (body: PostRequest) => api.post<Post>('/posts', body),
  attachments: (postId: number | string) =>
    api.get<Attachment[]>(`/posts/${postId}/attachments`, { auth: false }),
  uploadAttachment: (postId: number | string, file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api.post<Attachment>(`/posts/${postId}/attachments`, form);
  },
};
