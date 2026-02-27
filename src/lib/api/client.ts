const APP_URL = (import.meta as any).env?.VITE_APP_URL || (import.meta as any).env?.APP_URL || "";
const API_BASE_URL = APP_URL ? `${String(APP_URL).replace(/\/$/, "")}/api` : "/api";

const AUTH_TOKEN_KEY = "auth_token";

export function getAuthToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token);
  else localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export class ApiError extends Error {
  status: number;
  payload?: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

function buildHeaders(init?: HeadersInit, includeJson = true) {
  const headers = new Headers(init || {});
  headers.set("Accept", "application/json");
  if (includeJson && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAuthToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  return headers;
}

export async function apiFetch<T>(path: string, options: RequestInit & { json?: unknown } = {}) {
  const { json, headers, body, ...rest } = options;
  const isFormData = typeof FormData !== "undefined" && (body instanceof FormData || json instanceof FormData);
  const resolvedBody = json !== undefined ? (json instanceof FormData ? json : JSON.stringify(json)) : body;
  const resolvedHeaders = buildHeaders(headers, !isFormData && json !== undefined);
  if (isFormData) {
    resolvedHeaders.delete("Content-Type");
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: resolvedHeaders,
    body: resolvedBody,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const message = (payload as any)?.message || res.statusText || "Request failed";
    throw new ApiError(message, res.status, payload || undefined);
  }

  return payload as T;
}
