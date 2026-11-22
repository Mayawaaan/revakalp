import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import useStore from "../../store/store";

const AdminProtectedRoute = () => {
  const user = useStore((state) => state.user);
  const authReady = useStore((state) => state.authReady);
  const location = useLocation();

  if (!authReady) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-[#F7F1E5] text-[#38131E] text-xs uppercase tracking-[0.22em]">
        Verifying administrator access…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminProtectedRoute;
