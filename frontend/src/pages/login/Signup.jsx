import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import BrandMark from "../../components/brand/BrandMark";
import EditorialButton from "../../components/ui/EditorialButton";

const Signup = () => {
  const { handleSignup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const onChangeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const success = await handleSignup(
        formData.fullName,
        formData.email,
        formData.password
      );
      if (success) {
        navigate("/");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center bg-[#F7F1E5] px-4 py-12">
      <form
        onSubmit={onSubmitHandler}
        className="rk-surface-card w-full max-w-md p-8 sm:p-10 space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandMark variant="headerLight" className="h-7 w-auto" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#38131E]">
            Create Account
          </h1>
          <p className="text-sm text-[#1A1718]/70">
            Join Revakalp to save favorites and track your orders.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="fullName"
              id="fullName"
              autoComplete="name"
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
              autoComplete="email"
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
              autoComplete="new-password"
              minLength={6}
              value={formData.password}
              onChange={onChangeHandler}
              className="input-floating peer"
              required
            />
            <label htmlFor="password" className="label-floating">
              Password (min 6 characters)
            </label>
          </div>
        </div>

        <div className="flex justify-end items-center text-xs sm:text-sm gap-2">
          <span className="text-[#1A1718]/65">Already have an account?</span>
          <Link
            to="/login"
            className="font-semibold text-[#38131E] hover:underline"
          >
            Login instead
          </Link>
        </div>

        <EditorialButton
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Creating Account…" : "Sign Up"}
        </EditorialButton>
      </form>
    </div>
  );
};

export default Signup;
