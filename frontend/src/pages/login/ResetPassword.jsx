import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../../components/globalComponents/Toast";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [toastMsg, setToastMsg] = useState(null);
  const [toastType, setToastType] = useState("success");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setToastMsg("Passwords do not match!");
      setToastType("error");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password, confirmPassword }
      );

      setToastMsg(response.data.message);
      setToastType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      const message =
        error?.response?.data?.message || "Something went wrong";

      setToastMsg(message);
      setToastType("error");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#faf9f6] px-4">
      {toastMsg && (
        <Toast message={toastMsg} type={toastType} />
      )}

      <form
        onSubmit={onSubmitHandler}
        className="bg-white w-full max-w-md rounded-2xl shadow-sm px-10 py-12"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-semibold text-gray-900">
            Reset Your Password
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your new password below.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Confirm New Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-gray-800"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-8 w-full bg-black text-white py-3 rounded-lg text-sm tracking-wide hover:bg-gray-900 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;