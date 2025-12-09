import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface NavbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, setSearchTerm }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <nav className="bg-primary border-b border-white/10 sticky top-0 z-40 backdrop-blur-md">
      <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 shrink-0 mr-4">
            <div className="w-8 h-8 bg-gradient-to-tr from-accent to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <span className="text-xl font-bold text-white tracking-tight hidden md:block">Metal<span className="text-accent">Track</span></span>
          </Link>

          {/* Search Bar - Moved Left */}
          <div className="flex-1 max-w-xl relative">
             <input
              type="text"
              placeholder="Search gold, oil, copper..."
              className="w-full bg-slate-800/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:bg-slate-800 transition-colors"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <svg className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>

          <div className="ml-auto">
             {/* Right side spacer or future nav items */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;