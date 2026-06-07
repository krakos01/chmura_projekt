import type { ApiError } from '../types';

const TOKEN_KEY = 'fishnet.token';

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(
    /\/+$/,
    '',
  ) ?? '/api';

export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* ignore */
    }
  },
  clear(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

type UnauthorizedHandler = () => void;
let unauthorizedHandler: UnauthorizedHandler | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedHandler | null) {
  unauthorizedHandler = handler;
}

export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined | null>;
  auth?: boolean;
  raw?: boolean;
}

function buildUrl(
  path: string,
  query?: RequestOptions['query'],
): string {
  const base = path.startsWith('http')
    ? path
    : `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query) return base;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '')
      params.append(key, String(value));
  });
  const qs = params.toString();
  return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base;
}

async function parseResponse(response: Response): Promise<unknown> {
  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return response.json();
  }
  const text = await response.text();
  return text.length ? text : null;
}

export async function request<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, query, auth = true, headers, raw, ...rest } = options;

  const reqHeaders = new Headers(headers);
  const isFormData =
    typeof FormData !== 'undefined' && body instanceof FormData;

  if (body !== undefined && !isFormData && !reqHeaders.has('Content-Type')) {
    reqHeaders.set('Content-Type', 'application/json');
  }
  if (!reqHeaders.has('Accept')) {
    reqHeaders.set('Accept', 'application/json');
  }

  if (auth) {
    const token = tokenStorage.get();
    if (token && !reqHeaders.has('Authorization')) {
      reqHeaders.set('Authorization', `Bearer ${token}`);
    }
  }

  const init: RequestInit = {
    ...rest,
    headers: reqHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
  };

  let response: Response;
  try {
    response = await fetch(buildUrl(path, query), init);
  } catch (err) {
    const networkError: ApiError = Object.assign(
      new Error('Network error — please check your connection.'),
      { status: 0, body: (err as Error).message },
    );
    throw networkError;
  }

  if (response.status === 401 && auth) {
    tokenStorage.clear();
    unauthorizedHandler?.();
  }

  if (raw) {
    if (!response.ok) {
      const body = await parseResponse(response).catch(() => null);
      const error: ApiError = Object.assign(
        new Error(extractMessage(body) ?? response.statusText),
        { status: response.status, body },
      );
      throw error;
    }
    return response as unknown as T;
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    const error: ApiError = Object.assign(
      new Error(extractMessage(data) ?? response.statusText),
      { status: response.status, body: data },
    );
    throw error;
  }

  return data as T;
}

function extractMessage(body: unknown): string | undefined {
  if (!body) return undefined;
  if (typeof body === 'string') return body;
  if (typeof body === 'object') {
    const b = body as Record<string, unknown>;
    if (typeof b.message === 'string') return b.message;
    if (typeof b.error === 'string') return b.error;
    if (Array.isArray(b.errors) && b.errors.length) return String(b.errors[0]);
  }
  return undefined;
}

export const api = {
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'PATCH', body }),
  delete: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
};
