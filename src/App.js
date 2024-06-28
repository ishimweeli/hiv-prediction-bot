import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

          <Route
            path="/admin"
            element={
              <AdminRoute isAdmin={userRole === 'ADMIN'} isAuthenticated={isAuthenticated}>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isDataUser={userRole === 'DATA_USER'} isAuthenticated={isAuthenticated}>
                <UserDashboard />
              </PrivateRoute>
            }
          />
          <Route 
            path="/" 
            element={
              isAuthenticated 
                ? (userRole === 'ADMIN' 
                    ? <Navigate to="/admin" /> 
                    : <Navigate to="/dashboard" />)
                : <Navigate to="/login" />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;