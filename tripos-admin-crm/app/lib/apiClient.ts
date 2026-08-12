import type { CrmSession } from "../components/crmTypes";

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

export function sessionHeaders(token?: string, user?: Record<string, unknown>) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (user?.organizationId)
    headers["x-organization-id"] = String(user.organizationId);
  if (user?.branchId) headers["x-branch-id"] = String(user.branchId);
  return headers;
}

type SessionLike = Pick<CrmSession, "token" | "user"> | null | undefined;

type RequestOptions = {
  session?: SessionLike;
  errorMessage?: string;
  cache?: RequestCache;
  signal?: AbortSignal;
};

async function request<T>(
  path: string,
  method: string,
  body: unknown,
  options: RequestOptions,
): Promise<T> {
  const headers: Record<string, string> = {
    ...sessionHeaders(options.session?.token, options.session?.user),
  };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const response = await fetch(`${apiBaseUrl}/${path}`, {
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: options.cache,
    headers,
    method,
    signal: options.signal,
  });
  if (!response.ok)
    throw new Error(options.errorMessage ?? `Request to ${path} failed`);
  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

export function apiGet<T>(path: string, options: RequestOptions = {}) {
  return request<T>(path, "GET", undefined, options);
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  options: RequestOptions = {},
) {
  return request<T>(path, "POST", body, options);
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  options: RequestOptions = {},
) {
  return request<T>(path, "PATCH", body, options);
}

export function apiDelete<T>(path: string, options: RequestOptions = {}) {
  return request<T>(path, "DELETE", undefined, options);
}
