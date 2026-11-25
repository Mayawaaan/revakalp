import { getToken, clearToken } from "../utils/token";
import { API_BASE } from "../utils/apiBase";
import { cancelProactiveRefresh, refreshSessionToken } from "../utils/authRefresh";

/* ─────────────────────────────────────────────
   MAIN FETCH WRAPPER
───────────────────────────────────────────── */
export const apiFetch = async (endpoint, options = {}, _isRetry = false) => {
  const token = getToken();

  const hasJsonBody =
    options.body !== undefined &&
    options.body !== null &&
    !(options.body instanceof FormData);

  const headers = {
    ...(hasJsonBody ? { "Content-Type": "application/json" } : {}),

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
      cancelProactiveRefresh();
      window.location.href = "/login";
      throw new Error("Unauthorized");
    }

    try {
      await refreshSessionToken();
      // Retry original request with new token
      return apiFetch(endpoint, options, true);
    } catch (refreshError) {
      if (refreshError?.isAuthFailure) {
        clearToken();
        cancelProactiveRefresh();
        window.location.href = "/login";
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error(refreshError?.message || "Temporary connection error. Please retry.");
    }
  }

  if (!res.ok) {
    let error = "Request failed";

    try {
      const data = await res.json();
      error = data.message || error;
    } catch {
      /* ignore non-JSON body */
    }

    throw new Error(error);
  }

  if (options.isBlob) {
    return await res.blob();
  }

  return res.json();
};