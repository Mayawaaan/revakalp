import { getToken, setToken, clearToken } from "../utils/token";

const API_BASE = import.meta.env.VITE_API_URL;

/* ─────────────────────────────────────────────
   REFRESH HELPER (singleton promise to avoid double-refresh)
───────────────────────────────────────────── */
let refreshPromise = null;

const refreshAccessToken = async () => {
  if (refreshPromise) return refreshPromise;

  refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    credentials: "include",      // 🍪 send httpOnly cookie
  })
    .then(async (res) => {
      if (!res.ok) throw new Error("Refresh failed");
      const data = await res.json();
      setToken(data.token);
      return data.token;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
};

/* ─────────────────────────────────────────────
   MAIN FETCH WRAPPER
───────────────────────────────────────────── */
export const apiFetch = async (endpoint, options = {}, _isRetry = false) => {
  const token = getToken();

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),

    ...(token && token !== "undefined"
      ? { Authorization: `Bearer ${token}` }
      : {}),

    ...options.headers,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",    // 🍪 always send cookies
    headers,
  });

  // ── 401 handling ──
  if (res.status === 401 && !_isRetry) {
    // Don't attempt refresh on auth endpoints themselves
    if (endpoint.includes("/api/auth/login") || endpoint.includes("/api/auth/refresh")) {
      clearToken();
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    try {
      const newToken = await refreshAccessToken();
      // Retry original request with new token
      return apiFetch(endpoint, options, true);
    } catch {
      clearToken();
      window.location.href = "/login";
      throw new Error("Session expired. Please log in again.");
    }
  }

  if (!res.ok) {
    let error = "Request failed";

    try {
      const data = await res.json();
      error = data.message || error;
    } catch {}

    throw new Error(error);
  }

  if (options.isBlob) {
    return await res.blob();
  }

  return res.json();
};