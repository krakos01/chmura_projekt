import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { setUnauthorizedHandler, tokenStorage } from '../api/client';
import { authApi } from '../api/auth';
import type {
  AuthRequest,
  AuthResponse,
  RegisterRequest,
  Role,
  User,
} from '../types';
import { AuthContext, type AuthContextValue } from './authContextValue';
import {
  resolveUserId,
  userIdFromJwtClaims,
} from './userId';

interface DecodedJwt {
  sub?: string;
  username?: string;
  name?: string;
  email?: string;
  userId?: unknown;
  id?: unknown;
  role?: string;
  roles?: string[];
  authorities?: string[];
  exp?: number;
  iat?: number;
  [key: string]: unknown;
}

function normalizeRoles(raw: unknown): string[] {
  if (raw == null) return [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map((r) => String(r).replace(/^ROLE_/, '').toUpperCase());
}

function primaryRole(roles: string[]): Role {
  if (roles.includes('ADMIN')) return 'ADMIN';
  if (roles.includes('MOD') || roles.includes('MODERATOR')) return 'MOD';
  return 'USER';
}

function decodeJwt(token: string): DecodedJwt | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
    const json = decodeURIComponent(
      atob(padded)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json) as DecodedJwt;
  } catch {
    return null;
  }
}

function rolesFromJwt(decoded: DecodedJwt): string[] {
  const raw =
    decoded.roles ?? decoded.authorities ?? (decoded.role ? [decoded.role] : []);
  return normalizeRoles(raw);
}

function userFromToken(token: string): User | null {
  const decoded = decodeJwt(token);
  if (!decoded) return null;
  if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;

  const roles = rolesFromJwt(decoded);

  return {
    id: userIdFromJwtClaims(decoded) ?? 'me',
    username:
      (decoded.username as string | undefined) ??
      (decoded.name as string | undefined) ??
      (decoded.sub as string | undefined) ??
      'angler',
    email: decoded.email as string | undefined,
    roles,
    role: primaryRole(roles),
  };
}

function rolesFromAuthResponse(resp: AuthResponse): string[] {
  const fromBody = normalizeRoles(resp.roles ?? resp.user?.roles);
  if (fromBody.length) return fromBody;
  if (resp.token) {
    const decoded = decodeJwt(resp.token);
    if (decoded) return rolesFromJwt(decoded);
  }
  return [];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => tokenStorage.get());
  const [user, setUser] = useState<User | null>(() => {
    const stored = tokenStorage.get();
    return stored ? userFromToken(stored) : null;
  });

  const logout = useCallback(() => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => logout());
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  const applyAuth = useCallback(
    (resp: AuthResponse): User | null => {
      if (!resp?.token) return null;
      tokenStorage.set(resp.token);
      setToken(resp.token);
      const fromToken = userFromToken(resp.token);
      const claims = decodeJwt(resp.token);
      const roles = rolesFromAuthResponse(resp);
      const effectiveRoles =
        roles.length > 0 ? roles : (fromToken?.roles ?? ['USER']);
      const merged: User = {
        id: resolveUserId(resp, claims, fromToken),
        username:
          resp.user?.username ??
          resp.username ??
          fromToken?.username ??
          'angler',
        email: resp.user?.email ?? fromToken?.email,
        roles: effectiveRoles,
        role: primaryRole(effectiveRoles),
      };
      setUser(merged);
      return merged;
    },
    [],
  );

  const login = useCallback(
    async (credentials: AuthRequest) => {
      const resp = await authApi.login(credentials);
      return applyAuth(resp);
    },
    [applyAuth],
  );

  const register = useCallback(
    async (data: RegisterRequest) => {
      const resp = await authApi.register(data);
      if (resp && typeof resp === 'object' && 'token' in resp && resp.token) {
        return applyAuth(resp as AuthResponse);
      }
      const loginResp = await authApi.login({
        username: data.username,
        password: data.password,
      });
      return applyAuth(loginResp);
    },
    [applyAuth],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      isAdmin: Boolean(
        user?.roles?.includes('ADMIN') || user?.role === 'ADMIN',
      ),
      isMod: Boolean(
        user?.roles?.some((r) =>
          ['MOD', 'MODERATOR', 'ADMIN'].includes(r),
        ) ||
          user?.role === 'MOD' ||
          user?.role === 'ADMIN',
      ),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
