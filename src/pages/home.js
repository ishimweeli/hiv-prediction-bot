
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState(null);

  const handleNavClick = (path) => {
    navigate(path);
    if (isAuthenticated) {
      window.location.reload();
    }
  };

  const handleInviteUser = async () => {
    setInviteLoading(true);
    setInviteMessage(null);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/invite`,
        JSON.stringify(inviteEmail),
        {
          headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
          },
        }
      );
      console.log(response.data);
      setShowInviteModal(false);
      setInviteEmail('');
      alert('Successfully sent invitation. Check your email.');
    } catch (error) {
      console.error('Error inviting user:', error);
      const errorMessage = error.response?.data?.message || 'Failed to send invitation. Please try again.';
      setInviteMessage({ type: 'error', text: errorMessage });
      alert('Failed: ' + errorMessage);
    } finally {
      setInviteLoading(false);
    }
  };

  return (
    <div className="font-sans">
      {/* Header */}
      <header className="bg-gray-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl sm:text-2xl font-bold">ThereWeCome Hairstyle</h1>
          <nav>
            <a href="#services" className="mx-2 sm:mx-4 hover:text-red-400">Services</a>
            <a href="#contact" className="mx-2 sm:mx-4 hover:text-red-400">Contact</a>
            <button onClick={() => handleNavClick('/login')} className="mx-2 sm:mx-4 hover:text-red-400">Sign in</button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: `url('https://media.istockphoto.com/id/1973194125/photo/hairdresser-shaping-eyebrows-of-man-client-using-razor-in-barbershop.webp?b=1&s=612x612&w=0&k=20&c=FJRQxfdJfTnx-3jknvqE9_K1HIqf-5AiLYVSSFXTpVg=')` }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4">Find the Perfect Hairstylist Near You</h1>
          <p className="text-base sm:text-lg md:text-2xl mb-8">Book your next appointment with ease and style.</p>
          <div>
            <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full mr-4 mb-4 md:mb-0">
          <Link to="/booking">Book Now</Link>  
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
              onClick={() => setShowInviteModal(true)}
            >
              Join as a Stylist
            </button>
          </div>
        </div>
      </section>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4">Join as a Stylist</h2>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-2 border rounded mb-4"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
            {inviteMessage && (
              <p className={`mb-4 ${inviteMessage.type === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                {inviteMessage.text}
              </p>
            )}
            <div className="flex justify-between">
              <button
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => setShowInviteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={handleInviteUser}
                disabled={inviteLoading}
              >
                {inviteLoading ? 'Sending...' : 'Send Invitation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      <section id="services" className="py-12 sm:py-16 bg-gray-100 text-gray-800">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Profile Management</h3>
              <p>Service providers can create and update their profiles with personal information, professional qualifications, and a short bio.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Client Registration</h3>
              <p>Clients can easily sign up, log in, and book appointments with their preferred hairstylists.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Admin Dashboard</h3>
              <p>Admin can manage service pricing, payment processing, user profiles, and access detailed analytics on platform usage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-16 bg-gray-900 text-white">
        <div className="container mx-auto text-center px-4">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8">What Our Clients Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="italic mb-4">"Amazing service! My stylist was professional and did an incredible job."</p>
              <h4 className="font-bold">- Sarah M.</h4>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="italic mb-4">"Booking an appointment was so easy, and I love my new haircut!"</p>
              <h4 className="font-bold">- John D.</h4>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="italic mb-4">"The best platform to find skilled hairstylists in my area."</p>
              <h4 className="font-bold">- Emily R.</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2024 ThereWeCome Hairstyle. All rights reserved.</p>
          <p className="mt-4">
            <a href="#about" className="mx-2 hover:text-red-400">About Us</a> |
            <a href="#privacy" className="mx-2 hover:text-red-400">Privacy Policy</a> |
            <a href="#terms" className="mx-2 hover:text-red-400">Terms of Service</a>
          </p>
          <div className="mt-4">
            <a href="#" className="mx-2 hover:text-red-400">Facebook</a>
            <a href="#" className="mx-2 hover:text-red-400">Twitter</a>
            <a href="#" className="mx-2 hover:text-red-400">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;