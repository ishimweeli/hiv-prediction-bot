import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-xl sm:text-2xl font-bold">ThereWeCome Hairstyle</h1>
        <nav>
          <Link to="/" className="mx-2 sm:mx-4 hover:text-red-400">Home</Link>
          <Link to="/login" className="mx-2 sm:mx-4 hover:text-red-400">Login</Link>
          <Link to="/register" className="mx-2 sm:mx-4 hover:text-red-400">Register</Link>
          <a href="#contact" className="mx-2 sm:mx-4 hover:text-red-400">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
