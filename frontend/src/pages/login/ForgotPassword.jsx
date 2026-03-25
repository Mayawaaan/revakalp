import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import  Toast  from "../../components/globalComponents/Toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onChangeHandler = (e) => {
    setEmail(e.target.value);
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      setMessage(response.data.message);
      Toast(response.data.message, "success");
    } catch (error) {
      setMessage(error.response.data.message);
      Toast(error.response.data.message, "error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md rounded-2xl shadow-sm px-10 py-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Forgot Your Password?
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your email address and we will send you a link to reset your
            password.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={onChangeHandler}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-8 w-full bg-black text-white py-3 rounded-lg text-sm tracking-wide hover:bg-gray-900 transition"
        >
          Send Reset Link
        </button>

        {/* Back to Login */}
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-gray-500 hover:text-gray-800">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
