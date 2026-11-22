import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";
import BrandMark from "../../components/brand/BrandMark";
import EditorialButton from "../../components/ui/EditorialButton";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useStore();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      showToast(response.data.message, "success");
      localStorage.setItem("resetEmail", email);
      navigate("/reset-password");
    } catch (error) {
      showToast(error.response?.data?.message || "Failed to send OTP", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F1E5] px-4 py-12">
      <form
        onSubmit={onSubmitHandler}
        className="rk-surface-card w-full max-w-md p-8 sm:p-10 space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandMark variant="headerLight" className="h-7 w-auto" />
          </div>
          <h1 className="font-serif text-3xl text-[#38131E]">
            Forgot Password?
          </h1>
          <p className="text-sm text-[#1A1718]/70">
            Enter your email and we will send you a 6-digit verification OTP.
          </p>
        </div>

        <div className="relative">
          <input
            type="email"
            id="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-floating peer"
            required
          />
          <label htmlFor="email" className="label-floating">
            Email Address
          </label>
        </div>

        <EditorialButton
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Sending OTP…" : "Send OTP"}
        </EditorialButton>

        <div className="text-center">
          <Link
            to="/login"
            className="text-sm font-medium text-[#38131E] hover:underline"
          >
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
