import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useStore from '../../store/store'; // Corrected import to use the global store

const AdminProtectedRoute = () => {
  const user = useStore((state) => state.user); // Corrected access to user from the auth slice

  if (!user) {
    // If no user is logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    // If user is logged in but not an admin, redirect to home or an unauthorized page
    return <Navigate to="/" replace />; // Or a specific /unauthorized page
  }

  // If user is an admin, render the child routes
  return <Outlet />;
};

export default AdminProtectedRoute;
