import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto text-center px-4">
        <p>&copy; 2024 ThereWeCome Hairstyle. All rights reserved.</p>
        <p className="mt-4">
          <a href="#about" className="mx-2 hover:text-red-400">About Us</a> |
          <a href="#privacy" className="mx-2 hover:text-red-400">Privacy Policy</a> |
          <a href="#terms" className="mx-2 hover:text-red-400">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
