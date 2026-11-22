import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/axiosInstance";
import useStore from "../../store/store";
import BrandMark from "../../components/brand/BrandMark";
import EditorialButton from "../../components/ui/EditorialButton";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { showToast } = useStore();

  const [email, setEmail] = useState("");
  const [form, setForm] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const storedEmail = localStorage.getItem("resetEmail");
    if (!storedEmail) {
      showToast("Please enter email first", "error");
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate, showToast]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      showToast("Passwords do not match", "error");
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post("/api/auth/verify-otp-reset", {
        email,
        ...form,
      });

      showToast(response.data.message, "success");
      localStorage.removeItem("resetEmail");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      showToast(error.response?.data?.message || "Password reset failed", "error");
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
            Reset Password
          </h1>
          <p className="text-sm text-[#1A1718]/70">
            Verify the OTP sent to your email and set your new password.
          </p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              name="otp"
              id="otp"
              value={form.otp}
              onChange={handleChange}
              className="input-floating peer"
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
              minLength={6}
              value={form.password}
              onChange={handleChange}
              className="input-floating peer"
              required
            />
            <label htmlFor="password" className="label-floating">
              New Password
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              minLength={6}
              value={form.confirmPassword}
              onChange={handleChange}
              className="input-floating peer"
              required
            />
            <label htmlFor="confirmPassword" className="label-floating">
              Confirm Password
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
      </form>
    </div>
  );
};

export default ResetPassword;
