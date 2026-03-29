import { useEffect, useCallback } from "react";
import useStore from "../store/store";
import axios from "../utils/axiosInstance";

const useAuth = () => {
  const { user, login, logout, showToast, updateProfile } = useStore();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/check");

        if (res.data && isMounted) {
          login(res.data);
        }
      } catch (error) {
        console.log("User not authenticated:", error.message);
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [login]);

  const handleLogin = useCallback(
    async (email, password) => {
      try {
        const res = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (res.data) {
          login(res.data);
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

  const handleSignup = useCallback(
    async (fullName, email, password) => {
      try {
        const res = await axios.post("/api/auth/signup", {
          fullName,
          email,
          password,
          profilePic: "",
        });

        if (res.data) {
          login(res.data);
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