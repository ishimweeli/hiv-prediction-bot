import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isDataUser, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return isDataUser ? children : <Navigate to="/dashboard" />;
};

export default PrivateRoute;