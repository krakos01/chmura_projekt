import { createContext } from 'react';
import type {
  AuthRequest,
  RegisterRequest,
  User,
} from '../types';

export interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isMod: boolean;
  login: (credentials: AuthRequest) => Promise<User | null>;
  register: (data: RegisterRequest) => Promise<User | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
