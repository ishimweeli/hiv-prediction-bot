import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const DateInput = ({ label, value, onChange, disabled }) => (
  <div>
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <input
      type="date"
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    />
  </div>
);

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(1);
  const [hivPositive, setHivPositive] = useState(false);
  const [timeCaughtVirus, setTimeCaughtVirus] = useState('');
  const [onArtDrugs, setOnArtDrugs] = useState(false);
  const [timeStartedArt, setTimeStartedArt] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      validateToken(tokenFromUrl);
    } else {
      setAlertMessage('No invitation token provided');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  }, [location]);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/validate-token/${token}`);
      setEmail(response.data.email);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'Invalid or expired token';
      setAlertMessage(errorMessage);
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (hivPositive && timeCaughtVirus && onArtDrugs && timeStartedArt && new Date(timeStartedArt) < new Date(timeCaughtVirus)) {
      setAlertMessage('ART start date cannot be earlier than the date the virus was caught.');
      setAlertSeverity('error');
      setAlertOpen(true);
      setIsLoading(false);
      return;
    }

    const userData = {
      firstName,
      lastName,
      age,
      hivPositive,
      timeCaughtVirus: hivPositive ? timeCaughtVirus : null,
      onArtDrugs: hivPositive && onArtDrugs,
      timeStartedArt: hivPositive && onArtDrugs ? timeStartedArt : null,
      email,
      password,
      role: 'DATA_USER',
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register?token=${token}`,
        userData
      );
      const successMessage = response.data.message || 'Registration successful!';
      setAlertMessage(successMessage);
      setAlertSeverity('success');
      setAlertOpen(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data || error.message || 'An error occurred during registration';
      setAlertMessage(errorMessage);
      setAlertSeverity('error');
      setAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 relative">
      {isLoading && <Loader />}
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-gray-700 text-sm font-bold mb-2">Age</label>
          <input
            type="number"
            id="age"
            value={age}
            onChange={(e) => setAge(Math.max(1, Number(e.target.value)))}
            min="1"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">HIV Positive</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={hivPositive}
              onChange={(e) => {
                setHivPositive(e.target.checked);
                if (!e.target.checked) {
                  setOnArtDrugs(false);
                  setTimeCaughtVirus('');
                  setTimeStartedArt('');
                }
              }}
              className="mr-2"
            />
            <span>Yes</span>
          </div>
        </div>
        {hivPositive && (
          <DateInput
            label="Time Caught Virus"
            value={timeCaughtVirus}
            onChange={(e) => setTimeCaughtVirus(e.target.value)}
          />
        )}
        {hivPositive && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">On ART Drugs</label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={onArtDrugs}
                onChange={(e) => {
                  setOnArtDrugs(e.target.checked);
                  if (!e.target.checked) {
                    setTimeStartedArt('');
                  }
                }}
                className="mr-2"
              />
              <span>Yes</span>
            </div>
          </div>
        )}
        {hivPositive && onArtDrugs && (
          <DateInput
            label="Time Started ART"
            value={timeStartedArt}
            onChange={(e) => setTimeStartedArt(e.target.value)}
          />
        )}
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            readOnly
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity}>
          {typeof alertMessage === 'string' ? alertMessage : JSON.stringify(alertMessage)}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;