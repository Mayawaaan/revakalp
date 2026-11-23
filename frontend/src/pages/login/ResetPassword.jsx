import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";
import BrandMark from "../../components/brand/BrandMark";
import EditorialButton from "../../components/ui/EditorialButton";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useStore();

  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    const stateEmail = location.state?.email;
    const storedEmail = stateEmail || localStorage.getItem("resetEmail");
    if (!storedEmail) {
      showToast("Please enter your email first", "error");
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail.trim().toLowerCase());
    }
  }, [location.state, navigate, showToast]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "otp") {
      setForm({ ...form, otp: value.replace(/\D/g, "").slice(0, 6) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleResendOtp = async () => {
    if (!email || resending || cooldown > 0) return;
    setResending(true);
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      showToast(
        response.data?.message || "A new 6-digit OTP has been sent to your email",
        "success"
      );
      setCooldown(30);
    } catch (error) {
      const errData = error.response?.data;
      const errMsg =
        typeof errData === "string"
          ? errData
          : errData?.message || "Could not resend OTP";
      showToast(errMsg, "error");
    } finally {
      setResending(false);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const cleanOtp = form.otp.trim();
    if (cleanOtp.length !== 6) {
      showToast("Please enter the 6-digit OTP sent to your email", "error");
      return;
    }
    if (form.password.length < 8) {
      showToast("Password must be at least 8 characters long", "error");
      return;
    }
    if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
      showToast("Password must include at least one letter and one number", "error");
      return;
    }
    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post("/api/auth/verify-otp-reset", {
        email,
        otp: cleanOtp,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      showToast(response.data?.message || "Password reset successful", "success");
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const errData = error.response?.data;
      const errMsg =
        typeof errData === "string"
          ? errData
          : errData?.message || "Password reset failed";
      showToast(errMsg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#F7F1E5] px-4 py-12">
      <form
        onSubmit={onSubmitHandler}
        className="rk-surface-card w-full max-w-md p-6 sm:p-10 space-y-6"
      >
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <BrandMark variant="headerLight" className="h-7 w-auto" />
          </div>
          <h1 className="font-serif text-3xl text-[#38131E]">
            Reset Password
          </h1>
          <p className="text-sm text-[#1A1718]/75">
            Enter the 6-digit OTP sent to{" "}
            <span className="font-semibold text-[#38131E] break-all">
              {email}
            </span>
          </p>
          <div className="flex items-center justify-center gap-4 text-xs pt-0.5">
            <Link
              to="/forgot-password"
              className="text-[#38131E]/75 hover:text-[#38131E] underline"
            >
              Change email
            </Link>
            <span className="text-[#38131E]/30">·</span>
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resending || cooldown > 0}
              className="font-semibold text-[#38131E] hover:underline disabled:opacity-50 cursor-pointer"
            >
              {resending
                ? "Sending…"
                : cooldown > 0
                ? `Resend OTP (${cooldown}s)`
                : "Resend OTP"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              name="otp"
              id="otp"
              value={form.otp}
              onChange={handleChange}
              className="input-floating peer font-mono tracking-[0.25em]"
              required
            />
            <label htmlFor="otp" className="label-floating">
              6-Digit OTP
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="new-password"
              minLength={8}
              value={form.password}
              onChange={handleChange}
              className="input-floating peer"
              required
            />
            <label htmlFor="password" className="label-floating">
              New Password (min 8 chars, letters &amp; numbers)
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              autoComplete="new-password"
              minLength={8}
              value={form.confirmPassword}
              onChange={handleChange}
              className="input-floating peer"
              required
            />
            <label htmlFor="confirmPassword" className="label-floating">
              Confirm New Password
            </label>
          </div>
        </div>

        <EditorialButton
          type="submit"
          variant="primary"
          disabled={submitting}
          className="w-full"
        >
          {submitting ? "Updating…" : "Reset Password"}
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

export default ResetPassword;
