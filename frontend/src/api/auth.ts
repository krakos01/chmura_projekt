import type { AuthRequest, AuthResponse, RegisterRequest, User } from '../types';
import { api } from './client';

export const authApi = {
  login: (body: AuthRequest) =>
    api.post<AuthResponse>('/auth/login', body, { auth: false }),
  register: (body: RegisterRequest) =>
    api.post<AuthResponse | User>('/auth/register', body, { auth: false }),
};
