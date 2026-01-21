import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../../store/store';

const ProtectedRoute = () => {
  const { user } = useStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />; // Redirect to home or an unauthorized page
  }

  return <Outlet />;
};

export default ProtectedRoute;
