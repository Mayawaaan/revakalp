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
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4">
      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md rounded-2xl shadow-sm px-10 py-12"
      >
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Create Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Join us to explore authentic handloom collections
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={onChangeHandler}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={onChangeHandler}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={onChangeHandler}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end items-center mt-6 text-sm text-gray-500">
          <Link
            to="/login"
            className="cursor-pointer hover:text-gray-800 transition"
          >
            Login instead
          </Link>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-8 w-full bg-black text-white py-3 rounded-lg text-sm tracking-wide hover:bg-gray-900 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
