import { useEffect, useCallback } from "react";
import useStore from "../store/store";
import axios from "../utils/axiosInstance";

const useAuth = () => {
  const { user, login, logout, showToast, updateProfile } = useStore();

  /* ================= CHECK AUTH ON LOAD ================= */
  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");

        // ❗ No token → skip API call
        if (!token) return;

        const res = await axios.get("/api/auth/check");

        if (res.data && isMounted) {
          login({
            user: res.data,
            token: token, // ✅ restore token
          });
        }
      } catch (error) {
        console.log("User not authenticated:", error.message);

        // optional: clear invalid token
        localStorage.removeItem("token");
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, [login]);

  /* ================= LOGIN ================= */
  const handleLogin = useCallback(
    async (email, password) => {
      try {
        const res = await axios.post("/api/auth/login", {
          email,
          password,
        });

        if (res.data?.token) {
          login({
            user: res.data.user,
            token: res.data.token,
          });

          showToast?.("Logged in successfully", "success");
          return true;
        }

        throw new Error("Invalid login response");
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
          login({
            user: res.data.user,
            token: res.data.token,
          });

          showToast?.("Signed up successfully", "success");
          return true;
        }

        throw new Error("Invalid signup response");
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
    } catch (error) {
      console.log("Logout API failed (safe to ignore)");
    }

    // ✅ Always clear local auth
    logout();
    localStorage.removeItem("token");

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

        if (res.data) {
          updateProfile(res.data);
          showToast?.("Profile updated successfully", "success");
          return true;
        }

        return false;
      } catch (error) {
        const message =
          error.response?.data?.message ||
          "Profile update failed";

        showToast?.(message, "error");
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