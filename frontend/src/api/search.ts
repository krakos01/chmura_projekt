import type { SearchResult, Tag } from '../types';
import { api } from './client';

export const searchApi = {
  search: (q: string) =>
    api.get<SearchResult>('/search', { auth: false, query: { q } }),
  tags: () => api.get<Tag[]>('/tags', { auth: false }),
};
