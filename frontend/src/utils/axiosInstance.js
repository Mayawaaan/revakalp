import axios from "axios";
import { getToken, clearToken } from "./token";
import { API_BASE } from "./apiBase";
import { cancelProactiveRefresh, refreshSessionToken } from "./authRefresh";

const axiosInstance = axios.create({
  baseURL: API_BASE,
  withCredentials: true,   // 🍪 send httpOnly refresh cookie automatically
});

/* ================= REQUEST INTERCEPTOR ================= */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      delete config.headers.Authorization;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= RESPONSE INTERCEPTOR ================= */
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401, and only once per request
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      // Don't refresh on the refresh/login endpoints themselves (prevents loop)
      !originalRequest.url?.includes("/api/auth/refresh") &&
      !originalRequest.url?.includes("/api/auth/login")
    ) {
      originalRequest._retry = true;

      try {
        // Unified singleton refresh — prevents concurrent rotation races
        const newToken = await refreshSessionToken();
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${newToken}`;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        if (refreshError?.isAuthFailure) {
          clearToken();
          cancelProactiveRefresh();
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;