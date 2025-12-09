
import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Detail from './pages/Detail';
import NewsDetail from './pages/NewsDetail';
import Admin from './pages/Admin';
import ChatWidget from './components/ChatWidget';
import Ticker from './components/Ticker';
import Footer from './components/Footer';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    // Fetch items once for the Chat Widget context & Footer context
    api.getAllItems().then(setItems);

    // BACKGROUND WORKER SIMULATION
    // Check for price alerts every 60 seconds
    const interval = setInterval(() => {
      api.checkAlerts();
    }, 60000); // 1 minute

    return () => clearInterval(interval);
  }, []);

  return (
    <HashRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
        <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <Ticker />
        <main className="flex-grow">
          <Routes>
            <Route 
              path="/" 
              element={
                <Home 
                  searchTerm={searchTerm} 
                  setSearchTerm={setSearchTerm} 
                  onOpenChat={() => setIsChatOpen(true)} 
                />
              } 
            />
            <Route path="/product/:slug" element={<Detail />} />
            <Route path="/news/:id" element={<NewsDetail />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        
        <ChatWidget 
          items={items} 
          isOpen={isChatOpen} 
          setIsOpen={setIsChatOpen} 
        />

        <Footer items={items} />
      </div>
    </HashRouter>
  );
};

export default App;
