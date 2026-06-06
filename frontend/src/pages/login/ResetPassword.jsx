import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useStore();

  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // ✅ FIX: load email safely
  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    console.log("Loaded email:", storedEmail);

    if (!storedEmail) {
      showToast("Please enter email first", "error");
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate, showToast]);

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
        ...form,
      });

      showToast(response.data.message, "success");

      // ✅ cleanup
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      showToast(error.response?.data?.message || "Error", "error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#fff1f4] to-[#fff8fa] px-4 py-8">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-pink-100 px-10 py-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[#9c2756]">
            Reset Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Verify OTP and enter your new password
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="otp"
              id="otp"
              value={form.otp}
              onChange={handleChange}
              className="input-floating peer"
              required
            />
            <label htmlFor="otp" className="label-floating">
              Enter 6-digit OTP
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={form.password}
              onChange={handleChange}
              className="input-floating peer"
              required
            />
            <label htmlFor="password" className="label-floating">
              New Password
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              className="input-floating peer"
              required
            />
            <label htmlFor="confirmPassword" className="label-floating">
              Confirm Password
            </label>
          </div>
        </div>

        <button className="mt-8 w-full bg-[#c9487c] text-white font-medium py-3.5 rounded-full text-sm tracking-wide hover:bg-[#9c2756] shadow-lg transition-colors">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
