import type { AuthResponse, User } from '../types';

interface JwtClaims {
  sub?: string;
  username?: string;
  name?: string;
  email?: string;
  userId?: unknown;
  id?: unknown;
  [key: string]: unknown;
}

/** Prefer numeric IDs from the API; fall back to string identifiers from JWT. */
export function normalizeUserId(raw: unknown): number | string | undefined {
  if (raw == null || raw === '') return undefined;
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (/^\d+$/.test(trimmed)) return Number(trimmed);
    if (trimmed.length > 0) return trimmed;
    return undefined;
  }
  return undefined;
}

export function userIdFromJwtClaims(claims: JwtClaims): number | string | undefined {
  return (
    normalizeUserId(claims.userId) ??
    normalizeUserId(claims.id) ??
    normalizeUserId(claims.sub)
  );
}

export function resolveUserId(
  resp: AuthResponse,
  claims: JwtClaims | null,
  tokenFallback: User | null,
): number | string {
  return (
    normalizeUserId(resp.user?.id) ??
    userIdFromJwtClaims(claims ?? {}) ??
    tokenFallback?.id ??
    resp.username ??
    'me'
  );
}
