import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children, isAdmin, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return isAdmin ? children : <Navigate to="/admin" />;
};

export default AdminRoute;