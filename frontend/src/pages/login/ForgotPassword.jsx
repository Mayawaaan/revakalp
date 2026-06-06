import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { showToast } = useStore();

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/forgot-password", { email });

      // ✅ show toast
      showToast(response.data.message, "success");

      // ✅ save email
      localStorage.setItem("resetEmail", email);

      // ✅ navigate (absolute path)
      navigate("/reset-password");

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
            Forgot Password?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email and we will send you a 6-digit OTP.
          </p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-floating peer"
              required
            />
            <label htmlFor="email" className="label-floating">
              Email Address
            </label>
          </div>
        </div>

        <button className="mt-8 w-full bg-[#c9487c] text-white font-medium py-3.5 rounded-full text-sm tracking-wide hover:bg-[#9c2756] shadow-lg transition-colors">
          Send OTP
        </button>

        <div className="text-center mt-6">
          <Link to="/login" className="cursor-pointer font-medium text-[#9c2756] hover:text-[#c9487c] transition-colors">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
