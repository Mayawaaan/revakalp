import { getToken } from "../utils/token";

const API_BASE = import.meta.env.VITE_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
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
    headers,
  });

  if (!res.ok) {
    let error = "Request failed";

    try {
      const data = await res.json();
      error = data.message || error;
    } catch {}

    // 🔥 AUTO LOGOUT ON 401 (VERY IMPORTANT)
    if (res.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    throw new Error(error);
  }
   if (options.isBlob) {
    return await res.blob();
  }

  return res.json();
};