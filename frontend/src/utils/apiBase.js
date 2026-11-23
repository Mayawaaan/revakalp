const PROD_BACKEND_FALLBACK = "https://revakalp-2461.onrender.com";
const LOCAL_BACKEND_FALLBACK = "http://localhost:5000";
const LOCAL_URL_RE = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i;

export function getApiBaseUrl() {
  const isBrowser = typeof window !== "undefined";
  const host = isBrowser ? window.location.hostname : "";
  const isLocalHost = host === "localhost" || host === "127.0.0.1";

  const raw = String(import.meta.env.VITE_API_URL || "")
    .trim()
    .replace(/^['"]+|['"]+$/g, "")
    .replace(/\/+$/, "");

  if (raw && raw !== "undefined" && raw !== "null") {
    // Prevent accidental localhost VITE_API_URL from breaking deployed Vercel builds
    if (isBrowser && !isLocalHost && LOCAL_URL_RE.test(raw)) {
      return PROD_BACKEND_FALLBACK;
    }
    return raw;
  }

  if (isLocalHost) {
    return LOCAL_BACKEND_FALLBACK;
  }

  return PROD_BACKEND_FALLBACK;
}

export const API_BASE = getApiBaseUrl();
