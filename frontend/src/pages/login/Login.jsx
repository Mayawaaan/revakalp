import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Login = () => {
  const { handleLogin, user } = useAuth(); // Get handleLogin and user from useAuth
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const success = await handleLogin(formData.email, formData.password);
    if (success) {
      if (user && user.role === 'admin') {
        navigate("/admin"); // Redirect admin to admin dashboard
      } else {
        navigate("/"); // Redirect regular users to home page
      }
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#fff1f4] to-[#fff8fa] px-4 py-8">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-pink-100 px-10 py-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-[#9c2756]">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue shopping handcrafted sarees
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="relative">
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={onChangeHandler}
              className="input-floating peer"
              required
            />
            <label htmlFor="email" className="label-floating">
              Email Address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={onChangeHandler}
              className="input-floating peer"
              required
            />
            <label htmlFor="password" className="label-floating">
              Password
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <Link
            to="/forgot-password"
            className="cursor-pointer hover:text-[#c9487c] transition-colors"
          >
            Forgot password?
          </Link>
          <Link
            to="/signup"
            className="cursor-pointer font-medium text-[#9c2756] hover:text-[#c9487c] transition-colors"
          >
            Create account
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-8 w-full bg-[#c9487c] text-white font-medium py-3.5 rounded-full text-sm tracking-wide hover:bg-[#9c2756] shadow-lg transition-colors"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};

export default Login;
