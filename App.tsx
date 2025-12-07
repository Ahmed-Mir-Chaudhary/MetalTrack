import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import Admin from './pages/Admin';
import ChatWidget from './components/ChatWidget';
import { api } from './services/dataService';
import { Item } from './types';

// Scroll to top wrapper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // Fetch items once for the Chat Widget context
    api.getAllItems().then(setItems);
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:slug" element={<Detail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        <ChatWidget items={items} />

        <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} Metal & Lubricant Price Tracker. All rights reserved.</p>
            <p className="mt-2 text-xs">Data provided for demonstration purposes.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;