export type Role = 'USER' | 'MOD' | 'ADMIN';

export type ThreadStatus = 'OPEN' | 'LOCKED' | string;
export type PostStatus = 'VISIBLE' | 'HIDDEN' | string;

export interface User {
  /** Prefer numeric IDs from AuthResponse; JWT `sub` may be a username string. */
  id: number | string;
  username: string;
  email?: string;
  roles?: string[];
  /** Highest-privilege role derived from `roles` for UI checks. */
  role?: Role;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  type?: string;
  user?: User;
  username?: string;
  roles?: string[];
  expiresIn?: number;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthRequest {
  username: string;
  password: string;
}

export interface Category {
  id: number | string;
  name: string;
  description?: string;
  position?: number;
  /** Optional — not returned by all backend versions. */
  slug?: string;
  threadCount?: number;
  postCount?: number;
  icon?: string;
  color?: string;
  createdAt?: string;
}

export interface Thread {
  id: number | string;
  title: string;
  categoryId: number | string;
  categoryName?: string;
  authorId?: number | string;
  author?: string;
  createdAt?: string;
  updatedAt?: string;
  lastPostAt?: string;
  postCount?: number;
  viewCount?: number;
  status?: ThreadStatus;
  pinned?: boolean;
  tags?: string[];
  tagNames?: string[];
  excerpt?: string;
}

/** Payload accepted by POST /api/threads (content is created via POST /api/posts). */
export interface ThreadRequest {
  title: string;
  categoryId: number | string;
  tagNames?: string[];
}

export interface Post {
  id: number | string;
  threadId: number | string;
  authorId?: number | string;
  author?: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  status?: PostStatus;
  attachments?: Attachment[];
}

export interface PostRequest {
  threadId: number | string;
  content: string;
}

export interface Attachment {
  id: number | string;
  postId?: number | string;
  filename: string;
  originalFilename?: string;
  contentType?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  downloadUrl?: string;
  createdAt?: string;
}

export interface Tag {
  id?: number | string;
  name: string;
  count?: number;
}

export interface SearchResult {
  threads?: Thread[];
  posts?: Post[];
}

export interface ApiError extends Error {
  status?: number;
  body?: unknown;
}
