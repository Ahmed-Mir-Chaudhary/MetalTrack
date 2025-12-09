
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Item, Category } from '../types';
import { api } from '../services/dataService';

interface FooterProps {
  items: Item[];
}

const Footer: React.FC<FooterProps> = ({ items }) => {
  // --- NEWSLETTER STATE ---
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsStatus, setNewsStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsStatus('loading');
    try {
        await api.subscribeNewsletter(newsletterEmail);
        setNewsStatus('success');
        setNewsletterEmail('');
    } catch (e) {
        setNewsStatus('error');
    }
  };

  // --- DYNAMIC ALERT SYSTEM STATE ---
  const [alertCategory, setAlertCategory] = useState<Category | ''>('');
  const [alertItemSlug, setAlertItemSlug] = useState('');
  const [alertEmail, setAlertEmail] = useState('');
  const [alertTargetPrice, setAlertTargetPrice] = useState('');
  const [alertStatus, setAlertStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Derived state for dropdowns
  const availableCategories = Array.from(new Set(items.map(i => i.category)));
  const filteredItems = items.filter(i => i.category === alertCategory);
  
  // Auto-select unit for display
  const selectedItemUnit = items.find(i => i.slug === alertItemSlug)?.unit.split('/')[0] || 'USD';

  const handleAlertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertItemSlug || !alertEmail || !alertTargetPrice) return;

    setAlertStatus('loading');
    try {
        await api.createAlert(alertEmail, alertItemSlug, parseFloat(alertTargetPrice));
        setAlertStatus('success');
        // Reset form
        setAlertEmail('');
        setAlertTargetPrice('');
        setAlertItemSlug('');
        setAlertCategory('');
    } catch (e) {
        setAlertStatus('error');
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-auto">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* 1. Brand & Info */}
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
               <div className="w-8 h-8 bg-gradient-to-tr from-accent to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-900/50">M</div>
               <span className="text-xl font-bold text-white tracking-tight">Metal<span className="text-accent">Track</span></span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              The world's leading platform for real-time commodity pricing, market intelligence, and AI-driven forecasting.
            </p>
            <div className="flex space-x-4">
              {[
                "M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z", // Facebook
                "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z", // Twitter
                "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z M2 9h4v12H2z M4 2a2 2 0 1 1-1.998 2.002A2 2 0 0 1 4 2z" // LinkedIn
              ].map((path, i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-accent hover:text-white transition-all duration-300">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d={path}/></svg>
                </a>
              ))}
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6">Company & Markets</h4>
            <div className="grid grid-cols-1 gap-2 text-sm">
                <Link to="/" className="hover:text-accent transition-colors">Home</Link>
                <Link to="/admin" className="hover:text-accent transition-colors">Admin Portal</Link>
                <a href="#" className="hover:text-accent transition-colors">About Us</a>
                <a href="#" className="hover:text-accent transition-colors">API Documentation</a>
                <a href="#" className="hover:text-accent transition-colors">Contact Support</a>
            </div>
          </div>

          {/* 3. Newsletter Subscription */}
          <div>
             <h4 className="text-white font-bold mb-6 flex items-center gap-2">
                Stay Ahead
                {newsStatus === 'success' && <span className="text-green-500 text-xs">✓ Subscribed</span>}
             </h4>
             <p className="text-sm text-slate-400 mb-4">Get daily price alerts, weekly forecasts, and exclusive market analysis delivered to your inbox.</p>
             <form className="flex flex-col gap-3" onSubmit={handleNewsletterSubmit}>
               <input 
                  type="email" 
                  required
                  placeholder="Enter your email address" 
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-4 py-3 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all placeholder-slate-500" 
               />
               <button 
                type="submit" 
                disabled={newsStatus === 'loading' || newsStatus === 'success'}
                className="bg-accent hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold py-3 rounded-lg transition-colors shadow-lg shadow-accent/20"
               >
                 {newsStatus === 'loading' ? 'Subscribing...' : newsStatus === 'success' ? 'Subscribed!' : 'Subscribe'}
               </button>
             </form>
             <p className="text-[10px] text-slate-500 mt-3">
               By subscribing, you agree to our Privacy Policy and consent to receive updates.
             </p>
          </div>

          {/* 4. Dynamic Price Alerts System */}
          <div className="bg-slate-800 rounded-xl p-5 border border-slate-700">
             <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                Price Alerts
             </h4>
             <p className="text-xs text-slate-400 mb-4">
                Get notified when your commodity reaches a target price.
             </p>
             
             {alertStatus === 'success' ? (
                 <div className="text-center py-6">
                     <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                         <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                     </div>
                     <p className="text-white font-bold text-sm">Alert Created!</p>
                     <button onClick={() => setAlertStatus('idle')} className="text-xs text-accent mt-2 hover:underline">Create another</button>
                 </div>
             ) : (
                <form className="space-y-3" onSubmit={handleAlertSubmit}>
                    <select 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent"
                        value={alertCategory}
                        onChange={(e) => {
                            setAlertCategory(e.target.value as Category);
                            setAlertItemSlug('');
                        }}
                    >
                        <option value="">Select Category</option>
                        {availableCategories.map(c => (
                            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                    </select>

                    <select 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-accent disabled:opacity-50"
                        value={alertItemSlug}
                        onChange={(e) => setAlertItemSlug(e.target.value)}
                        disabled={!alertCategory}
                    >
                        <option value="">Select Item</option>
                        {filteredItems.map(i => (
                            <option key={i.id} value={i.slug}>{i.name}</option>
                        ))}
                    </select>

                    <input 
                        type="email" 
                        required
                        placeholder="Your Email" 
                        value={alertEmail}
                        onChange={(e) => setAlertEmail(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent" 
                    />

                    <div className="relative">
                        <input 
                            type="number" 
                            step="0.01"
                            required
                            placeholder="Target Price" 
                            value={alertTargetPrice}
                            onChange={(e) => setAlertTargetPrice(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-accent" 
                        />
                        <span className="absolute right-3 top-2 text-[10px] text-slate-500">{selectedItemUnit}</span>
                    </div>

                    <button 
                        type="submit" 
                        disabled={alertStatus === 'loading'}
                        className="w-full bg-white text-slate-900 hover:bg-slate-200 text-xs font-bold py-2 rounded-lg transition-colors"
                    >
                        {alertStatus === 'loading' ? 'Creating...' : 'Create Alert'}
                    </button>
                </form>
             )}
          </div>

        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
           <p>&copy; {new Date().getFullYear()} MetalTrack Inc. All rights reserved.</p>
           <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Preferences</a>
              <a href="#" className="hover:text-white transition-colors">Sitemap</a>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
