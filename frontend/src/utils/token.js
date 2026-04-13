export const getToken = () => {
  const token = localStorage.getItem("token");

  // ❌ prevent invalid tokens
  if (!token || token === "undefined" || token === "null") {
    return null;
  }

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