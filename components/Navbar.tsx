import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-primary border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-accent to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <span className="text-xl font-bold text-white tracking-tight">Metal<span className="text-accent">Track</span></span>
          </Link>

          {/* Right side menu items removed */}
          <div className="flex items-center space-x-6">
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;