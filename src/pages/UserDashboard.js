import React, { useState } from 'react';
import { FaBars, FaSignOutAlt, FaBell } from 'react-icons/fa';
import Sidebar from '../components/userDashboard/Sidebar';
import Profile from '../components/userDashboard/Profile';
import Bookings from '../components/userDashboard/Bookings';
import Payments from '../components/userDashboard/Payments';
import Comments from '../components/userDashboard/Comments.js';
import Home from '../components/userDashboard/Home';
import Notifications from '../components/userDashboard/Notifications';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Add redirect logic after logout
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} showSidebar={showSidebar} />

      <div className="flex-1 flex flex-col">
        <header className="bg-slate-600 text-white p-4 flex justify-between items-center">
          <FaBars className="md:hidden block cursor-pointer" onClick={() => setShowSidebar(!showSidebar)} />
          <h1 className="text-2xl font-semibold">User Dashboard</h1>
          <div className="flex items-center">
            <FaBell className="cursor-pointer mr-4" onClick={toggleNotifications} />
            <FaSignOutAlt className="cursor-pointer" onClick={handleLogout} />
          </div>
        </header>

        <Notifications isOpen={showNotifications} onClose={toggleNotifications} />

        <main className="flex-1 bg-gray-100 p-6">
          {activeTab === 'home' && <Home />}
          {activeTab === 'profile' && <Profile />}
          {activeTab === 'bookings' && <Bookings />}
          {activeTab === 'payments' && <Payments />}
          {activeTab === 'comments' && <Comments />}
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;