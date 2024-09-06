import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { FaUsers, FaChartLine, FaPercent, FaCut, FaDollarSign, FaSignOutAlt, FaUser } from 'react-icons/fa';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activeBookings: 0,
    customerSatisfactionRate: 0,
    avgServicePrice: 0,
    totalRevenue: 0
  });
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newServicePrice, setNewServicePrice] = useState('');
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingError, setPricingError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchMetrics = async () => {
    // Simulating API call with dummy data
    return {
      totalUsers: 150,
      activeBookings: 45,
      customerSatisfactionRate: 92,
      avgServicePrice: 65.50,
      totalRevenue: 28750.00
    };
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const metricsData = await fetchMetrics();
      setMetrics(metricsData);
      
      // Dummy user data
      const dummyUsers = [
        { id: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', role: 'STYLIST', totalBookings: 120, isActive: true },
        { id: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com', role: 'ADMIN', totalBookings: 0, isActive: true },
        { id: 3, firstName: 'Alice', lastName: 'Johnson', email: 'alice@example.com', role: 'STYLIST', totalBookings: 85, isActive: true },
        { id: 4, firstName: 'Bob', lastName: 'Brown', email: 'bob@example.com', role: 'STYLIST', totalBookings: 62, isActive: false },
        { id: 5, firstName: 'Charlie', lastName: 'Davis', email: 'charlie@example.com', role: 'STYLIST', totalBookings: 98, isActive: true },
      ];
      setUsers(dummyUsers);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
      setIsLoading(false);
    }
  };

  const handleDownloadStatistics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulating download
      await new Promise(resolve => setTimeout(resolve, 1000));
      const dummyData = 'Date,Total Users,Active Bookings,Customer Satisfaction,Avg Service Price,Total Revenue\n' +
                        '2024-09-01,150,45,92%,$65.50,$28750.00';
      const blob = new Blob([dummyData], { type: 'text/csv' });
      saveAs(blob, 'statistics.csv');
      setIsLoading(false);
    } catch (error) {
      console.error('Error downloading statistics:', error);
      setError('Failed to download statistics. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'STYLIST' : 'ADMIN';
    const updatedUsers = users.map(user => 
      user.id === userId ? {...user, role: newRole} : user
    );
    setUsers(updatedUsers);
  };

  const handleUpdatePricing = async () => {
    setPricingLoading(true);
    setPricingError(null);
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMetrics(prevMetrics => ({...prevMetrics, avgServicePrice: parseFloat(newServicePrice)}));
      setShowPricingModal(false);
      setNewServicePrice('');
    } catch (error) {
      console.error('Error updating pricing:', error);
      setPricingError('Failed to update pricing. Please try again.');
    } finally {
      setPricingLoading(false);
    }
  };

  const handleViewDetails = (user) => {
    setSelectedUser(user);
    setShowUserDetailsModal(true);
  };

  const handleDeactivateUser = (userId) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? {...user, isActive: !user.isActive} : user
    );
    setUsers(updatedUsers);
  };

  const handleLogout = () => {
    // Implement logout logic here
    console.log('Logging out...');
  };

  const handleViewProfile = () => {
    // Implement view profile logic here
    console.log('Viewing profile...');
  };

  return (
    <div className="relative">
      <div className={`bg-white shadow rounded-lg p-6 ${showPricingModal || showUserDetailsModal ? 'filter blur-sm' : ''}`}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Stylist Business Admin Dashboard</h2>
          <div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              onClick={handleViewProfile}
            >
              <FaUser className="inline mr-2" /> Profile
            </button>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 p-4 rounded-lg flex items-center">
            <FaUsers className="text-3xl mr-4 text-blue-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Total Users</h3>
              <p className="text-3xl font-bold">{metrics.totalUsers}</p>
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg flex items-center">
            <FaChartLine className="text-3xl mr-4 text-green-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Active Bookings</h3>
              <p className="text-3xl font-bold">{metrics.activeBookings}</p>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
            <FaPercent className="text-3xl mr-4 text-yellow-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Customer Satisfaction</h3>
              <p className="text-3xl font-bold">{metrics.customerSatisfactionRate}%</p>
            </div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg flex items-center">
            <FaCut className="text-3xl mr-4 text-red-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Avg Service Price</h3>
              <p className="text-3xl font-bold">${metrics.avgServicePrice.toFixed(2)}</p>
            </div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg flex items-center">
            <FaDollarSign className="text-3xl mr-4 text-purple-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold">${metrics.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex mb-6">
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleDownloadStatistics}
            disabled={isLoading}
          >
            {isLoading ? 'Downloading...' : 'Download Statistics'}
          </button>
          <button
            className="ml-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setShowPricingModal(true)}
          >
            Update Pricing
          </button>
        </div>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        
        <h3 className="text-xl font-bold mb-4">User List</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">First Name</th>
                <th className="px-4 py-2 border-b">Last Name</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Total Bookings</th>
                <th className="px-4 py-2 border-b">Status</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border-b">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.firstName}</td>
                  <td className="px-4 py-2 border-b">{user.lastName}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.role}</td>
                  <td className="px-4 py-2 border-b">{user.totalBookings}</td>
                  <td className="px-4 py-2 border-b">{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                      onClick={() => handleViewDetails(user)}
                    >
                      View Details
                    </button>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm mr-2"
                      onClick={() => handleRoleChange(user.id, user.role)}
                    >
                      Change Role
                    </button>
                    <button
                      className={`${user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white font-bold py-1 px-2 rounded text-sm`}
                      onClick={() => handleDeactivateUser(user.id)}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPricingModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-8 m-4 max-w-xl w-full">
            <h3 className="text-xl font-bold mb-4">Update Service Pricing</h3>
            <input
              type="number"
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              placeholder="Enter new service price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {pricingError && <p className="text-red-500 mt-2">{pricingError}</p>}
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                onClick={() => setShowPricingModal(false)}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${pricingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleUpdatePricing}
                disabled={pricingLoading}
              >
                {pricingLoading ? 'Updating...' : 'Update Pricing'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-8 m-4 max-w-xl w-full">
            <h3 className="text-xl font-bold mb-4">User Details</h3>
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Name:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
          
<p><strong>Role:</strong> {selectedUser.role}</p>
            <p><strong>Total Bookings:</strong> {selectedUser.totalBookings}</p>
            <p><strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowUserDetailsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;