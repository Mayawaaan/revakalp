const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5173";

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token"); // or your getToken()

  const headers = {
    ...(options.body instanceof FormData
      ? {}
      : { "Content-Type": "application/json" }),
    ...(token && { Authorization: `Bearer ${token}` }),
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
    } catch (err) {
      console.error("Error parsing response:", err);
    }
    throw new Error(error);
  }

  return res.json(); // ✅ already parsed
};