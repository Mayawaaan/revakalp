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
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md rounded-2xl shadow-sm px-10 py-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Forgot Your Password?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email and we will send you a 6-digit OTP.
          </p>
        </div>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border px-4 py-2.5"
          placeholder="Enter email"
          required
        />

        <button className="mt-8 w-full bg-black text-white py-3 rounded-lg">
          Send OTP
        </button>

        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-500">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;