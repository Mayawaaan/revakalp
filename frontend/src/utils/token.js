/* ─────────────────────────────────────────────
   ACCESS TOKEN HELPERS
   (stored in memory via localStorage)
   Refresh token lives in httpOnly cookie — no JS access needed.
───────────────────────────────────────────── */

export const getToken = () => {
  const token = localStorage.getItem("token");
  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

export const setToken = (token) => {
  if (token && token !== "undefined") {
    localStorage.setItem("token", token);
  }
};

export const clearToken = () => {
  localStorage.removeItem("token");
};