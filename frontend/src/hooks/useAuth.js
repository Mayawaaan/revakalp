import { useEffect, useCallback } from "react";
import useStore from "../store/store";
import axios from "../utils/axiosInstance";
import { setToken, clearToken, getToken } from "../utils/token";

const useAuth = () => {
  const {
    user,
    login,
    logout,
    showToast,
    updateProfile,
    setAuthReady,
  } = useStore();

  /* ================= RESTORE AUTH ================= */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getToken();

        if (!token) {
          setAuthReady(true);
          return;
        }

        const res = await axios.get("/api/auth/check");

        login({
          user: res.data,
          token,
        });
      } catch (error) {
        clearToken();
      } finally {
        setAuthReady(true); // 🔥 prevents race condition
      }
    };

    checkAuth();
  }, [login, setAuthReady]);

  /* ================= LOGIN ================= */
  const handleLogin = useCallback(
    async (email, password) => {
      try {
        const res = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (res.data?.token) {
          setToken(res.data.token);

          login({
            user: res.data.user,
            token: res.data.token,
          });

          showToast?.("Logged in successfully", "success");
          return true;
        }

        throw new Error("Invalid response");
      } catch (error) {
        const message =
          error.response?.data?.message || "Login failed";
        showToast?.(message, "error");
        return false;
      }
    },
    [login, showToast]
  );

  /* ================= SIGNUP ================= */
  const handleSignup = useCallback(
    async (fullName, email, password) => {
      try {
        const res = await axios.post("/api/auth/signup", {
          fullName,
          email,
          password,
          profilePic: "",
        });

        if (res.data?.token) {
          setToken(res.data.token);

          login({
            user: res.data.user,
            token: res.data.token,
          });

          showToast?.("Signed up successfully", "success");
          return true;
        }

        throw new Error("Invalid response");
      } catch (error) {
        const message =
          error.response?.data?.message || "Sign up failed";
        showToast?.(message, "error");
        return false;
      }
    },
    [login, showToast]
  );

  /* ================= LOGOUT ================= */
  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch {}

    logout();
    clearToken();

    showToast?.("Logged out successfully", "success");
  }, [logout, showToast]);

  /* ================= UPDATE PROFILE ================= */
  const handleUpdateProfile = useCallback(
    async ({ fullName, profilePic }) => {
      try {
        const formData = new FormData();
        formData.append("fullName", fullName);

        if (profilePic instanceof File) {
          formData.append("profilePic", profilePic);
        }

        const res = await axios.put(
          "/api/auth/update-profile",
          formData
        );

        updateProfile(res.data);
        showToast?.("Profile updated", "success");

        return true;
      } catch (error) {
        showToast?.(
          error.response?.data?.message || "Update failed",
          "error"
        );
        return false;
      }
    },
    [updateProfile, showToast]
  );

  return {
    user,
    handleLogin,
    handleSignup,
    handleLogout,
    handleUpdateProfile,
  };
};

export default useAuth;