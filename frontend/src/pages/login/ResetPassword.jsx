import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useStore();

  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ Get email from navigation state
  useEffect(() => {
    const emailFromState = location.state?.email;

    if (!emailFromState) {
      showToast("Please enter email first", "error");
      navigate("/forgot-password");
    } else {
      setEmail(emailFromState);
    }
  }, [location, navigate, showToast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    try {
      const response = await axios.post("/api/auth/verify-otp-reset", {
        email,
        otp: form.otp,
        password: form.password,
      });

      showToast(response.data.message, "success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      showToast(error.response?.data?.message || "Error", "error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md rounded-2xl shadow-sm px-10 py-12"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Verify OTP & Reset Password
        </h2>

        <input
          type="text"
          name="otp"
          placeholder="Enter 6-digit OTP"
          value={form.otp}
          onChange={handleChange}
          className="w-full mb-4 border px-4 py-2 rounded-lg"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="New Password"
          value={form.password}
          onChange={handleChange}
          className="w-full mb-4 border px-4 py-2 rounded-lg"
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          className="w-full mb-6 border px-4 py-2 rounded-lg"
          required
        />

        <button className="w-full bg-black text-white py-3 rounded-lg">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;