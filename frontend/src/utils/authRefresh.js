import { API_BASE } from "./apiBase";
import { getToken, setToken } from "./token";

let inFlightRefreshPromise = null;
let proactiveTimer = null;
let visibilityListenerAttached = false;
const tokenListeners = new Set();

const PROACTIVE_REFRESH_BUFFER_MS = 5 * 60 * 1000;
const VISIBILITY_REFRESH_WINDOW_MS = 12 * 60 * 1000;
const MIN_REFRESH_DELAY_MS = 30 * 1000;

export function decodeJwtExpiryMs(token) {
  if (!token || typeof token !== "string") return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64Url = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64Url.padEnd(
      base64Url.length + ((4 - (base64Url.length % 4)) % 4),
      "="
    );
    const payload = JSON.parse(atob(padded));
    return typeof payload?.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenExpired(token, skewMs = 15000) {
  const expMs = decodeJwtExpiryMs(token);
  if (!expMs) return true;
  return Date.now() >= expMs - skewMs;
}

export function registerTokenListener(listener) {
  if (typeof listener !== "function") return () => {};
  tokenListeners.add(listener);
  return () => {
    tokenListeners.delete(listener);
  };
}

function notifyTokenListeners(newToken) {
  tokenListeners.forEach((listener) => {
    try {
      listener(newToken);
    } catch {
      // Ignore listener failure
    }
  });
}

export function cancelProactiveRefresh() {
  if (proactiveTimer) {
    clearTimeout(proactiveTimer);
    proactiveTimer = null;
  }
}

function ensureVisibilityListener() {
  if (
    visibilityListenerAttached ||
    typeof document === "undefined" ||
    typeof document.addEventListener !== "function"
  ) {
    return;
  }
  visibilityListenerAttached = true;
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState !== "visible") return;
    const currentToken = getToken();
    if (!currentToken) return;
    const expMs = decodeJwtExpiryMs(currentToken);
    if (!expMs || expMs - Date.now() <= VISIBILITY_REFRESH_WINDOW_MS) {
      refreshSessionToken().catch(() => {});
    }
  });
}

export function scheduleProactiveRefresh(token) {
  cancelProactiveRefresh();
  if (!token || typeof window === "undefined") return;

  ensureVisibilityListener();

  const expMs = decodeJwtExpiryMs(token);
  if (!expMs) return;

  const remainingMs = expMs - Date.now();
  if (remainingMs <= 0) return;

  const delayMs = Math.max(
    MIN_REFRESH_DELAY_MS,
    remainingMs - PROACTIVE_REFRESH_BUFFER_MS
  );

  proactiveTimer = setTimeout(() => {
    refreshSessionToken().catch(() => {});
  }, delayMs);
}

export async function refreshSessionToken() {
  if (inFlightRefreshPromise) return inFlightRefreshPromise;

  inFlightRefreshPromise = (async () => {
    const currentToken = getToken();
    const headers = {};
    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    let res;
    try {
      res = await fetch(`${API_BASE}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers,
      });
    } catch {
      const netErr = new Error("Network error while refreshing session");
      netErr.isAuthFailure = false;
      throw netErr;
    }

    if (res.status === 401 || res.status === 403) {
      const authErr = new Error("Session expired. Please log in again.");
      authErr.isAuthFailure = true;
      throw authErr;
    }

    if (!res.ok) {
      const serverErr = new Error(`Session refresh returned HTTP ${res.status}`);
      serverErr.isAuthFailure = false;
      throw serverErr;
    }

    const data = await res.json();
    if (!data?.token) {
      const invalidErr = new Error("Invalid refresh response");
      invalidErr.isAuthFailure = true;
      throw invalidErr;
    }

    setToken(data.token);
    notifyTokenListeners(data.token);
    scheduleProactiveRefresh(data.token);
    return data.token;
  })().finally(() => {
    inFlightRefreshPromise = null;
  });

  return inFlightRefreshPromise;
}
