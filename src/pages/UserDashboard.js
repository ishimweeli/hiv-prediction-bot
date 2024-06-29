import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeartbeat, FaCalendarAlt, FaClock, FaPills, FaChartLine, FaCalendarCheck } from 'react-icons/fa';

const UserDashboard = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/current`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }
  const calculateDaysOnArt = () => {
    if (!userData.onArtDrugs || !userData.timeStartedArt) return 'N/A';
    const startDate = new Date(userData.timeStartedArt);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const  predictedRemainingLifetime=userData.predictedLifespan-userData.age
  const timeCaughtVirus = new Date(userData.timeCaughtVirus);
  const predictedYearOfDeath = timeCaughtVirus.getFullYear() + predictedRemainingLifetime;

  // const predictedYearOfDeath = userData.getTimeCaughtVirus().getYear() + predictedRemainingLifetime;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {userData.firstName} {userData.lastName}!</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <FaHeartbeat className="mr-2" /> Health Status
          </h3>
          <p className="text-3xl font-bold">{userData.hivPositive ? 'HIV+' : 'HIV-'}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <FaCalendarAlt className="mr-2" /> Age
          </h3>
          <p className="text-3xl font-bold">{userData.age} years</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <FaClock className="mr-2" /> Time Since Diagnosis
          </h3>
          <p className="text-3xl font-bold">
            {userData.timeCaughtVirus ? new Date(userData.timeCaughtVirus).toLocaleDateString() : 'N/A'}
          </p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2 flex items-center">
            <FaPills className="mr-2" /> ART Status
          </h3>
          <p className="text-3xl font-bold">{userData.onArtDrugs ? 'On ART' : 'Not on ART'}</p>
          {userData.onArtDrugs && userData.timeStartedArt && (
            <p>Started: {new Date(userData.timeStartedArt).toLocaleDateString()}</p>
          )}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-bold text-lg mb-2 flex items-center">
          <FaChartLine className="mr-2" /> Your Health Insights
        </h3>
        <ul className="list-disc list-inside">
          <li className="flex items-center">
            <FaCalendarCheck className="mr-2" /> Predicted life expectancy: {userData.predictedLifespan} years
          </li>
          <li className="flex items-center">
            <FaCalendarCheck className="mr-2" /> Predicted remainingLifeTime: {predictedRemainingLifetime} years
          </li>
          <li className="flex items-center">
            <FaCalendarCheck className="mr-2" /> Predicted year of death: {predictedYearOfDeath} years
          </li>
          <li className="flex items-center mt-2">
            <FaCalendarAlt className="mr-2" /> Days on ART: {calculateDaysOnArt()}
          </li>
        </ul>
      </div>
      <div className="mt-6 bg-indigo-100 p-4 rounded-lg">
        <h3 className="font-bold text-lg mb-2">Health Advice</h3>
        <p>
          Remember to take your medications regularly as prescribed. Consistent adherence to your
          ART regimen can significantly improve your health outcomes and increase your chances of
          living a longer, healthier life. If you have any concerns or side effects, please consult
          your healthcare provider.
        </p>
      </div>
    </div>
  );
};

export default UserDashboard;