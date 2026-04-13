import { useEffect, useCallback } from "react";
import useStore from "../store/store";
import axios from "../utils/axiosInstance";
import { getToken } from "../utils/token";

const useAuth = () => {
  const { user, login, logout, showToast, updateProfile, setAuthReady } = useStore();

  // =========================
  // ✅ CHECK AUTH (FIXED)
  // =========================
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      const token = getToken();

      // 🔥 DO NOT CALL API WITHOUT TOKEN
      if (!token) {
        setAuthReady(true);
        return;
      }

      try {
        const res = await axios.get("/api/auth/check");

        if (res.data && isMounted) {
          login({
            user: res.data,
            token, // 🔥 KEEP TOKEN
          });
        }
      } catch (error) {
        console.log("User not authenticated:", error.message);
        logout(); // 🔥 clear invalid token
      } finally {
        setAuthReady(true);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [login, logout, setAuthReady]);

  // =========================
  // ✅ LOGIN (FIXED)
  // =========================
  const handleLogin = useCallback(
    async (email, password) => {
      try {
        const res = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (res.data) {
          login({
            user: res.data.user,
            token: res.data.token, // 🔥 CRITICAL FIX
          });

          showToast("Logged in successfully", "success");
          return true;
        }

        return false;
      } catch (error) {
        const message =
          error.response?.data?.message || "Login failed";
        showToast(message, "error");
        return false;
      }
    },
    [login, showToast]
  );

  // =========================
  // ✅ SIGNUP (FIXED)
  // =========================
  const handleSignup = useCallback(
    async (fullName, email, password, profilePic) => {
      try {
        const formData = new FormData();
        formData.append("fullName", fullName);
        formData.append("email", email);
        formData.append("password", password);

        if (profilePic) {
          formData.append("profilePic", profilePic);
        }

        const res = await axios.post("/api/auth/signup", formData);

        if (res.data) {
          login({
            user: res.data.user,
            token: res.data.token, // 🔥 FIX
          });

          showToast("Signed up successfully", "success");
          return true;
        }

        return false;
      } catch (error) {
        const message =
          error.response?.data?.message || "Sign up failed";
        showToast(message, "error");
        return false;
      }
    },
    [login, showToast]
  );

  // =========================
  // ✅ LOGOUT (NO CHANGE)
  // =========================
  const handleLogout = useCallback(async () => {
    try {
      await axios.post("/api/auth/logout");
      logout();
      showToast("Logged out successfully", "success");
    } catch (error) {
      const message =
        error.response?.data?.message || "Logout failed";
      showToast(message, "error");
    }
  }, [logout, showToast]);

  // =========================
  // ✅ UPDATE PROFILE (NO CHANGE)
  // =========================
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

        if (res.data) {
          updateProfile(res.data);
          showToast("Profile updated successfully", "success");
          return true;
        }

        return false;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Profile update failed";
        showToast(message, "error");
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