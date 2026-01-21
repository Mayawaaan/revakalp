import { useEffect, useCallback } from "react";
import useStore from "../store/store";
import axios from "axios";

const useAuth = () => {
  const { user, login, logout, showToast, updateProfilePic } = useStore();

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      try {
        const res = await axios.get("/api/auth/check");
        if (res.data && isMounted) {
          login(res.data);
        }
      } catch (error) {
        // do nothing if check auth fails
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
        const res = await axios.post("/api/auth/login", { email, password });
        if (res.data) {
          login(res.data);
          showToast("Logged in successfully", "success");
          return true;
        }
        return false;
      } catch (error) {
        const message = error.response?.data?.message || "Login failed";
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
        });
        if (res.data) {
          login(res.data);
          showToast("Signed up successfully", "success");
          return true;
        }
        return false;
      } catch (error) {
        const message = error.response?.data?.message || "Sign up failed";
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
      const message = error.response?.data?.message || "Logout failed";
      showToast(message, "error");
    }
  }, [logout, showToast]);

  const handleUpdateProfilePic = useCallback(
    async (profilePic) => {
      try {
        const res = await axios.put("/api/auth/update-profile", { profilePic });
        if (res.data) {
          updateProfilePic(res.data.profilePic);
          showToast("Profile picture updated successfully", "success");
          return true;
        }
        return false;
      } catch (error) {
        const message =
          error.response?.data?.message || "Profile picture update failed";
        showToast(message, "error");
        return false;
      }
    },
    [updateProfilePic, showToast]
  );

  return {
    user,
    handleLogin,
    handleSignup,
    handleLogout,
    handleUpdateProfilePic,
  };
};

export default useAuth;
