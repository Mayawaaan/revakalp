export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  // console.log("Setting token:", token);
  localStorage.setItem("token", token);
};

export const clearToken = () => {
  localStorage.removeItem("token");
};
