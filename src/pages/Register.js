import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Alert, Snackbar } from '@mui/material';

const Loader = () => (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

const DateInput = ({ label, yearValue, monthValue, dayValue, onYearChange, onMonthChange, onDayChange }) => (
  <div>
    <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
    <div className="flex space-x-2">
      <input
        type="number"
        value={yearValue}
        onChange={onYearChange}
        placeholder="YYYY"
        min="1900"
        max="2099"
        className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <input
        type="number"
        value={monthValue}
        onChange={onMonthChange}
        placeholder="MM"
        min="1"
        max="12"
        className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      <input
        type="number"
        value={dayValue}
        onChange={onDayChange}
        placeholder="DD"
        min="1"
        max="31"
        className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>
  </div>
);

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState(18);
  const [hivPositive, setHivPositive] = useState(false);
  const [timeCaughtVirusYear, setTimeCaughtVirusYear] = useState('');
  const [timeCaughtVirusMonth, setTimeCaughtVirusMonth] = useState('');
  const [timeCaughtVirusDay, setTimeCaughtVirusDay] = useState('');
  const [onArtDrugs, setOnArtDrugs] = useState(false);
  const [timeStartedArtYear, setTimeStartedArtYear] = useState('');
  const [timeStartedArtMonth, setTimeStartedArtMonth] = useState('');
  const [timeStartedArtDay, setTimeStartedArtDay] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formatDate = (year, month, day) => {
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    const timeCaughtVirus = hivPositive ? formatDate(timeCaughtVirusYear, timeCaughtVirusMonth, timeCaughtVirusDay) : null;
    const timeStartedArt = onArtDrugs ? formatDate(timeStartedArtYear, timeStartedArtMonth, timeStartedArtDay) : null;

    if (timeCaughtVirus && timeStartedArt && new Date(timeStartedArt) < new Date(timeCaughtVirus)) {
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
      timeCaughtVirus,
      onArtDrugs,
      timeStartedArt,
      email,
      password,
      role: 'DATA_USER',
    };

    console.log("Form data before submission:", userData);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        userData
      );
      console.log(response);
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
          <DateInput
            label="Time Caught Virus"
            yearValue={timeCaughtVirusYear}
            monthValue={timeCaughtVirusMonth}
            dayValue={timeCaughtVirusDay}
            onYearChange={(e) => setTimeCaughtVirusYear(e.target.value)}
            onMonthChange={(e) => setTimeCaughtVirusMonth(e.target.value)}
            onDayChange={(e) => setTimeCaughtVirusDay(e.target.value)}
          />
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
          <DateInput
            label="Time Started ART"
            yearValue={timeStartedArtYear}
            monthValue={timeStartedArtMonth}
            dayValue={timeStartedArtDay}
            onYearChange={(e) => setTimeStartedArtYear(e.target.value)}
            onMonthChange={(e) => setTimeStartedArtMonth(e.target.value)}
            onDayChange={(e) => setTimeStartedArtDay(e.target.value)}
          />
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
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {isLoading ? 'Registering...' : 'Register'}
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