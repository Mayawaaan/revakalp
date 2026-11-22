import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useStore from "../../store/store";
import BrandMark from "../../components/brand/BrandMark";
import EditorialButton from "../../components/ui/EditorialButton";

const Login = () => {
  const { handleLogin } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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
      const success = await handleLogin(formData.email, formData.password);
      if (success) {
        const loggedInUser = useStore.getState().user;
        if (loggedInUser && loggedInUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
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
            Welcome Back
          </h1>
          <p className="text-sm text-[#1A1718]/70">
            Sign in to access your bag, wishlist, and order history.
          </p>
        </div>

        <div className="space-y-4">
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
              autoComplete="current-password"
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

        <div className="flex justify-between items-center text-xs sm:text-sm">
          <Link
            to="/forgot-password"
            className="text-[#38131E]/75 hover:text-[#38131E] underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
          <Link
            to="/signup"
            className="font-semibold text-[#38131E] hover:underline"
          >
            Create account
          </Link>
        </div>

        <EditorialButton
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Signing In…" : "Sign In"}
        </EditorialButton>
      </form>
    </div>
  );
};

export default Login;
