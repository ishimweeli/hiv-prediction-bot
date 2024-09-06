import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import LandingPage from './pages/home';
import BookingProcess from './components/BookingProcess';

import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#1E88E5' },  // Blue
    secondary: { main: '#43A047' }, // Green
    error: { main: '#E53935' },     // Red
  },
});



function App() {
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole');

  return (
    <Router>
      {/* <Layout> */}
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/user" /> : <Login />} />
          <Route path="/" element={isAuthenticated ? <Navigate to="/user" /> : <LandingPage />} />
          <Route path="/booking" element={isAuthenticated ? <Navigate to="/user" /> : <BookingProcess />} />


          
          <Route path="/register" element={isAuthenticated ? <Navigate to="/user" /> : <Register />} />

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
              <PrivateRoute isDataUser={userRole === 'STYLIST'} isAuthenticated={isAuthenticated}>
                 <ThemeProvider theme={theme}>
    <UserDashboard />
  </ThemeProvider>
              </PrivateRoute>
            }
          />
          <Route 
            path="/user" 
            element={
              isAuthenticated 
                ? (userRole === 'ADMIN' 
                    ? <Navigate to="/admin" /> 
                    : <Navigate to="/dashboard" />)
                : <Navigate to="/login" />
            } 
          />
        </Routes>
      {/* </Layout> */}
    </Router>
  );
}

export default App;