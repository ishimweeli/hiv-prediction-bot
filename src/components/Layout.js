import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
      <main className="container mx-auto flex-grow px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-gray-800 text-white text-center py-4">
        <p>&copy; 2024 valens hair App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Layout;