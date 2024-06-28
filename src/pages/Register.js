import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Alert, Snackbar } from '@mui/material';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(18);
  const [hivPositive, setHivPositive] = useState(false);
  const [timeCaughtVirus, setTimeCaughtVirus] = useState(null);
  const [onArtDrugs, setOnArtDrugs] = useState(false);
  const [timeStartedArt, setTimeStartedArt] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      firstName,
      lastName,
      age,
      hivPositive,
      timeCaughtVirus: timeCaughtVirus ? timeCaughtVirus.toISOString().split('T')[0] : null,
      onArtDrugs,
      timeStartedArt: timeStartedArt ? timeStartedArt.toISOString().split('T')[0] : null,
      email,
      password,
      role: 'DATA_USER',
    };
    console.log(userData)

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        userData
      );
      console.log(response)
      if (response.data) {
        setAlertMessage('Registration successful!');
        setAlertSeverity('success');
        setAlertOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        setAlertMessage(response.data.message || 'Registration failed. Please try again.');
        setAlertSeverity('error');
        setAlertOpen(true);
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || 'An error occurred during registration.');
      setAlertSeverity('error');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
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
            onChange={(e) => setAge(Number(e.target.value))}
            min="0"
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
              onChange={(e) => setHivPositive(e.target.checked)}
              className="mr-2"
            />
            <span>Yes</span>
          </div>
        </div>
        {hivPositive && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Time Caught Virus</label>
            <DatePicker
              selected={timeCaughtVirus}
              onChange={date => setTimeCaughtVirus(date)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">On ART Drugs</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={onArtDrugs}
              onChange={(e) => setOnArtDrugs(e.target.checked)}
              className="mr-2"
            />
            <span>Yes</span>
          </div>
        </div>
        {onArtDrugs && (
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Time Started ART</label>
            <DatePicker
              selected={timeStartedArt}
              onChange={date => setTimeStartedArt(date)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
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
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Register
        </button>
      </form>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alertSeverity} sx={{ width: '100%' }}>
          {alertMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Register;