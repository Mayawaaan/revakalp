import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const Signup = () => {
  const { handleSignup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const success = await handleSignup(
      formData.fullName,
      formData.email,
      formData.password
    );
    if (success) {
      navigate("/");
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
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Join us to explore authentic handloom collections
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              name="fullName"
              id="fullName"
              value={formData.fullName}
              onChange={onChangeHandler}
              className="input-floating peer"
              required
            />
            <label htmlFor="fullName" className="label-floating">
              Full Name
            </label>
          </div>

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
        <div className="flex justify-end items-center mt-6 text-sm">
          <span className="text-gray-500 mr-2">Already have an account?</span>
          <Link
            to="/login"
            className="cursor-pointer font-medium text-[#9c2756] hover:text-[#c9487c] transition-colors"
          >
            Login instead
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-8 w-full bg-[#c9487c] text-white font-medium py-3.5 rounded-full text-sm tracking-wide hover:bg-[#9c2756] shadow-lg transition-colors"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
