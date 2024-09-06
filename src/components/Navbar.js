import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (isAuthenticated) {
      window.location.reload();
    }
  };

  return (
    <nav className="bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" onClick={() => handleNavClick('/')} className="text-white text-xl font-bold">Valens hair</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {!isAuthenticated ? (
                <>
                  <button onClick={() => handleNavClick('/login')} className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium">Login</button>
                  {/* <button onClick={() => handleNavClick('/register')} className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium">Register</button> */}
                </>
              ) : (
                <button onClick={handleLogout} className="text-white hover:bg-blue-500 px-3 py-2 rounded-md text-sm font-medium">Logout</button>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:bg-blue-500 inline-flex items-center justify-center p-2 rounded-md focus:outline-none">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {!isAuthenticated ? (
              <>
                <button onClick={() => handleNavClick('/login')} className="text-white hover:bg-blue-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Login</button>
                {/* <button onClick={() => handleNavClick('/register')} className="text-white hover:bg-blue-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left"></button> */}
              </>
            ) : (
              <button onClick={handleLogout} className="text-white hover:bg-blue-500 block px-3 py-2 rounded-md text-base font-medium w-full text-left">Logout</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;