import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';
import { FaUsers, FaChartLine, FaPercent, FaHeartbeat, FaPills } from 'react-icons/fa';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    activePredictions: 0,
    accuracyRate: 0,
    avgLifespanAIDS: 0,
    medianLifespanAIDSWithMeds: 0,
    medianLifespanAIDSWithoutMeds: 0
  });
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/statistics/metrics`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [usersResponse, metricsData] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/admin/users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }),
        fetchMetrics()
      ]);

      setUsers(usersResponse.data);
      
      setMetrics({
        totalUsers: metricsData.totalUsers,
        activePredictions: metricsData.totalPredictions,
        accuracyRate: metricsData.accuracyRate,
        avgLifespanAIDS: metricsData.avgLifespanHIVPositive,
        medianLifespanAIDSWithMeds: metricsData.medianLifespanWithMeds,
        medianLifespanAIDSWithoutMeds: metricsData.medianLifespanWithoutMeds
      });
      
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
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/statistics/export`, {
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, 'statistics.xlsx');
      setIsLoading(false);
    } catch (error) {
      console.error('Error downloading statistics:', error);
      setError('Failed to download statistics. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRoleChange = async (email, currentRole) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    
    if (!token) {
      setError('No authentication token found. Please log in again.');
      setIsLoading(false);
      return;
    }
  
    const newRole = currentRole === 'ADMIN' ? 'DATA_USER' : 'ADMIN';
  
    try {
      const response = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_API_URL}/admin/user/${email}/role`,
        params: { 
          email: email,
          newRole: newRole
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        }
      });
  
      console.log('Role change response:', response);
      
      if (response.status === 200) {
        fetchUsers(); // Refresh the user list after role change
      } else {
        setError(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error changing user role:', error);
      if (error.response) {
        setError(`Error ${error.response.status}: ${error.response.data || error.response.statusText}`);
      } else if (error.request) {
        setError('No response received from the server. Please check your connection.');
      } else {
        setError(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteUser = async () => {
    setInviteLoading(true);
    setInviteError(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/invite`,
        JSON.stringify(inviteEmail),
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
            'accept': '*/*'
          }
        }
      );
      console.log(response.data);
      setShowInviteModal(false);
      setInviteEmail('');
    } catch (error) {
      console.error('Error inviting user:', error);
      setInviteError(error.response?.data || 'Failed to send invitation. Please try again.');
    } finally {
      setInviteLoading(false);
    }
  };
  return (
    <div className="relative">
      <div className={`bg-white shadow rounded-lg p-6 ${showInviteModal ? 'filter blur-sm' : ''}`}>
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
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
              <h3 className="font-bold text-lg mb-2">Active Predictions</h3>
              <p className="text-3xl font-bold">{metrics.activePredictions}</p>
            </div>
          </div>
          <div className="bg-yellow-100 p-4 rounded-lg flex items-center">
            <FaPercent className="text-3xl mr-4 text-yellow-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Accuracy Rate</h3>
              <p className="text-3xl font-bold">{metrics.accuracyRate}%</p>
            </div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg flex items-center">
            <FaHeartbeat className="text-3xl mr-4 text-red-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Avg Lifespan (AIDS)</h3>
              <p className="text-3xl font-bold">{metrics.avgLifespanAIDS.toFixed(1)} years</p>
            </div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg flex items-center">
            <FaPills className="text-3xl mr-4 text-purple-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Median Lifespan (AIDS with meds)</h3>
              <p className="text-3xl font-bold">{metrics.medianLifespanAIDSWithMeds.toFixed(1)} years</p>
            </div>
          </div>
          <div className="bg-indigo-100 p-4 rounded-lg flex items-center">
            <FaPills className="text-3xl mr-4 text-indigo-500" />
            <div>
              <h3 className="font-bold text-lg mb-2">Median Lifespan (AIDS without meds)</h3>
              <p className="text-3xl font-bold">{metrics.medianLifespanAIDSWithoutMeds.toFixed(1)} years</p>
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
            onClick={() => setShowInviteModal(true)}
          >
            Invite User
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
                <th className="px-4 py-2 border-b">Age</th>
                <th className="px-4 py-2 border-b">HIV Status</th>
                <th className="px-4 py-2 border-b">Time Caught Virus</th>
                <th className="px-4 py-2 border-b">On ART Drugs</th>
                <th className="px-4 py-2 border-b">Time Started ART</th>
                <th className="px-4 py-2 border-b">Email</th>
                <th className="px-4 py-2 border-b">Role</th>
                <th className="px-4 py-2 border-b">Predicted Lifespan</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border-b">{user.id}</td>
                  <td className="px-4 py-2 border-b">{user.firstName}</td>
                  <td className="px-4 py-2 border-b">{user.lastName}</td>
                  <td className="px-4 py-2 border-b">{user.age}</td>
                  <td className="px-4 py-2 border-b">{user.hivPositive ? 'Positive' : 'Negative'}</td>
                  <td className="px-4 py-2 border-b">{user.timeCaughtVirus}</td>
                  <td className="px-4 py-2 border-b">{user.onArtDrugs ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 border-b">{user.timeStartedArt}</td>
                  <td className="px-4 py-2 border-b">{user.email}</td>
                  <td className="px-4 py-2 border-b">{user.role}</td>
                  <td className="px-4 py-2 border-b">{user.predictedLifespan}</td>
                  <td className="px-4 py-2 border-b">
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
                      onClick={() => handleRoleChange(user.email, user.role)}
                    >
                      Change Role to {user.role === 'ADMIN' ? 'DATA_USER' : 'ADMIN'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showInviteModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative bg-white rounded-lg p-8 m-4 max-w-xl w-full">
            <h3 className="text-xl font-bold mb-4">Invite User</h3>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email address"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {inviteError && <p className="text-red-500 mt-2">{inviteError}</p>}
            <div className="mt-4 flex justify-end">
              <button
                className="mr-2 bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
              <button
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${inviteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={handleInviteUser}
                disabled={inviteLoading}
              >
                {inviteLoading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;