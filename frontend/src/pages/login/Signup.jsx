import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import BrandMark from "../../components/brand/BrandMark";
import EditorialButton from "../../components/ui/EditorialButton";

const PASSWORD_RULE = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

const Signup = () => {
  const { handleSignup } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChangeHandler = (e) => {
    setValidationError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!PASSWORD_RULE.test(formData.password)) {
      setValidationError(
        "Password must be at least 8 characters and include at least one letter and one number."
      );
      return;
    }

    if (!consentAccepted) {
      setValidationError(
        "Please accept the Terms & Conditions and Privacy Policy to create your account."
      );
      return;
    }

    setSubmitting(true);
    try {
      const success = await handleSignup(
        formData.fullName,
        formData.email,
        formData.password,
        null,
        {
          consentAccepted: true,
          consentVersion: "2025-dpdpa-v1",
        }
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

        {validationError && (
          <div
            role="alert"
            className="p-3 rounded-[2px] bg-[#38131E]/8 border border-[#38131E]/25 text-xs text-[#38131E] leading-relaxed"
          >
            {validationError}
          </div>
        )}

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
              minLength={8}
              value={formData.password}
              onChange={onChangeHandler}
              className="input-floating peer"
              required
            />
            <label htmlFor="password" className="label-floating">
              Password (min 8 chars, letters &amp; numbers)
            </label>
          </div>
        </div>

        <label className="flex items-start gap-2.5 text-xs text-[#1A1718]/80 leading-relaxed cursor-pointer">
          <input
            type="checkbox"
            checked={consentAccepted}
            onChange={(e) => {
              setValidationError("");
              setConsentAccepted(e.target.checked);
            }}
            required
            className="mt-0.5 w-4 h-4 accent-[#38131E] shrink-0 cursor-pointer"
          />
          <span>
            I agree to the{" "}
            <Link to="/terms-conditions" className="text-[#38131E] font-semibold underline">
              Terms &amp; Conditions
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="text-[#38131E] font-semibold underline">
              Privacy Policy
            </Link>
            , and consent to Revakalp processing my personal details to manage my account
            and orders.
          </span>
        </label>

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
