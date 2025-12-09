import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Item } from '../types';
import { api } from '../services/dataService';
import AdsPlaceholder from '../components/AdsPlaceholder';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- DYNAMIC DATA GENERATOR ---
const getDynamicDetails = (item: Item) => {
  const p = item.todayPrice;
  const name = item.name;
  const category = item.category;
  const unitCode = item.unit.split('/')[0] || "USD"; // e.g. "USD" from "USD/oz"
  const change = item.percentChange;
  
  // Helper to randomize slightly for mock live feel
  const v = (val: number, factor = 0.002) => val * (1 + (Math.random() * factor - factor/2));
  const fmtTime = () => new Date().toLocaleTimeString('en-US', { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });

  // 1. Dynamic Global Tables
  // Mock currency rates relative to USD
  const currencies = {
    EUR: 0.92, GBP: 0.79, CHF: 0.88, SEK: 10.4, NOK: 10.5, DKK: 6.9, PLN: 4.0,
    CAD: 1.35, BRL: 4.95, MXN: 17.1, ARS: 820,
    CNY: 7.2, INR: 83.1, JPY: 150.2, HKD: 7.82, SGD: 1.34, KRW: 1330,
    ZAR: 19.1, EGP: 30.9,
    AED: 3.67, SAR: 3.75, TRY: 30.5, ILS: 3.65,
    AUD: 1.52, NZD: 1.63
  };

  const createRow = (currency: string, multiplier: number, suffixOverride?: string) => {
    const suffix = suffixOverride || (item.unit.includes('/') ? `/${item.unit.split('/')[1]}` : '');
    const localPrice = p * multiplier;
    const bid = v(localPrice);
    const ask = bid * 1.0005; // Tight spread
    const chg = change * multiplier; 
    const pchg = change;
    const high = localPrice * 1.01;
    const low = localPrice * 0.99;
    
    return {
      name: `${name} ${currency} ${suffix}`,
      bid, ask, chg, pchg, high, low, time: fmtTime()
    };
  };

  const globalTables = [
    {
      region: `Live ${name} Price (Global - USD/EUR/GBP)`,
      data: [
        createRow("USD", 1),
        createRow("EUR", currencies.EUR),
        createRow("GBP", currencies.GBP),
        // Grams calculation if it's a metal (assuming price is per oz, 1 oz ~ 31.1035g)
        ...(category === 'metal' && item.unit.includes('oz') ? [
          createRow("USD", 1 / 31.1035, "/g"),
          createRow("EUR", currencies.EUR / 31.1035, "/g"),
        ] : [])
      ]
    },
    {
      region: `Live ${name} Price Europe`,
      data: ["CHF", "SEK", "NOK", "DKK", "PLN"].map(c => createRow(c, currencies[c as keyof typeof currencies]))
    },
    {
      region: `Live ${name} Price Americas`,
      data: ["CAD", "BRL", "MXN", "ARS"].map(c => createRow(c, currencies[c as keyof typeof currencies]))
    },
    {
      region: `Live ${name} Price Asia`,
      data: ["CNY", "INR", "JPY", "HKD", "SGD", "KRW"].map(c => createRow(c, currencies[c as keyof typeof currencies]))
    },
    {
      region: `Live ${name} Price Africa`,
      data: ["ZAR", "EGP"].map(c => createRow(c, currencies[c as keyof typeof currencies]))
    },
    {
      region: `Live ${name} Price Middle East`,
      data: ["AED", "SAR", "TRY", "ILS"].map(c => createRow(c, currencies[c as keyof typeof currencies]))
    },
    {
      region: `Live ${name} Price Australasia`,
      data: ["AUD", "NZD"].map(c => createRow(c, currencies[c as keyof typeof currencies]))
    }
  ];

  // 2. Daily Price (AM/PM Fix)
  const dailyPrices = {
    am: v(p, 0.005),
    pm: v(p, 0.005)
  };

  // 3. Ratios
  let ratios = [];
  if (category === 'metal') {
    ratios = [
      { pair: `${name} / Silver`, ratio: (p / 22.85).toFixed(2), change: -0.15 },
      { pair: `${name} / Platinum`, ratio: (p / 980).toFixed(2), change: 0.05 },
      { pair: `Platinum / Palladium`, ratio: "0.94", change: -0.01 },
      { pair: `${name} / Oil`, ratio: (p / 76.5).toFixed(2), change: 1.20 },
    ];
  } else if (category === 'energy') {
    ratios = [
      { pair: `${name} / Nat Gas`, ratio: (p / 2.5).toFixed(2), change: 0.45 },
      { pair: `${name} / Brent`, ratio: (p / (p + 2)).toFixed(2), change: -0.01 },
      { pair: `Gold / ${name}`, ratio: (2045 / p).toFixed(2), change: 0.50 },
    ];
  } else {
    ratios = [
      { pair: `${name} / USD`, ratio: "1.00", change: 0.00 },
      { pair: `${name} / EUR`, ratio: currencies.EUR.toFixed(2), change: -0.02 },
      { pair: `${name} / Gold`, ratio: (p / 2045).toFixed(4), change: 0.01 },
    ];
  }

  // 4. Stories
  const stories = [
    { title: `${name} prices adjust as markets await central bank data`, time: "2h ago" },
    { title: `Analysts update 2026 forecast for ${name}`, time: "5h ago" },
    { title: `Supply concerns in key regions boost ${name} sentiment`, time: "8h ago" },
    { title: `${name} technical analysis: Support levels holding`, time: "11h ago" },
    { title: `Weekly Wrap: ${name} performance vs broader market`, time: "1d ago" },
  ];

  // 5. Events
  const events = [
    { event: "CPI Data Release", date: "Feb 13" },
    { event: "FOMC Minutes", date: "Feb 21" },
    { event: `${name} Futures Expiry`, date: "Feb 23" },
    { event: "Jobs Report", date: "Mar 08" },
  ];

  // 6. Charts data (Simulated)
  // Create a copy of history scaled for currency
  const historyEUR = (item.history || []).map(h => ({ ...h, price: h.price * currencies.EUR }));
  const historyGBP = (item.history || []).map(h => ({ ...h, price: h.price * currencies.GBP }));
  
  const charts = [
    { label: `${name} Euro Chart`, sub: `${item.symbol || name}/EUR`, data: historyEUR, color: '#3b82f6' },
    { label: `${name} GBP Chart`, sub: `${item.symbol || name}/GBP`, data: historyGBP, color: '#8b5cf6' },
  ];

  return { globalTables, dailyPrices, ratios, stories, events, charts, unitCode };
};

const PriceTable = ({ title, rows }: { title: string, rows: any[] }) => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
      <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wide">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs whitespace-nowrap">
        <thead className="bg-white text-slate-500 border-b border-slate-100">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">Name</th>
            <th className="px-4 py-2 text-right font-semibold">Bid</th>
            <th className="px-4 py-2 text-right font-semibold">Ask</th>
            <th className="px-4 py-2 text-right font-semibold">+/-</th>
            <th className="px-4 py-2 text-right font-semibold">%</th>
            <th className="px-4 py-2 text-right font-semibold hidden sm:table-cell">High</th>
            <th className="px-4 py-2 text-right font-semibold hidden sm:table-cell">Low</th>
            <th className="px-4 py-2 text-right font-medium text-slate-400">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-2 font-medium text-slate-700">{row.name}</td>
              <td className="px-4 py-2 text-right font-mono text-slate-900">{row.bid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right font-mono text-slate-500">{row.ask.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
              <td className={`px-4 py-2 text-right font-semibold ${row.chg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {row.chg > 0 ? '+' : ''}{row.chg.toFixed(2)}
              </td>
              <td className={`px-4 py-2 text-right font-semibold ${row.pchg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {row.pchg.toFixed(2)}%
              </td>
              <td className="px-4 py-2 text-right text-slate-500 hidden sm:table-cell">{row.high.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right text-slate-500 hidden sm:table-cell">{row.low.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td className="px-4 py-2 text-right text-slate-400 text-[10px]">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Detail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Alert State
  const [email, setEmail] = useState('');
  const [targetPrice, setTargetPrice] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        const data = await api.getItemBySlug(slug);
        setItem(data || null);
        // Reset subscription state when item changes
        setIsSubscribed(false);
        setEmail('');
        setTargetPrice('');
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && item) {
      setIsSubmitting(true);
      const price = parseFloat(targetPrice) || item.todayPrice; // Default to current if empty
      
      try {
        await api.createAlert(email, item.slug, price);
        setIsSubscribed(true);
      } catch (error) {
        alert("Failed to create alert.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>;
  if (!item) return <div className="flex h-screen items-center justify-center text-slate-500">Item not found</div>;

  const isPositive = item.percentChange >= 0;
  const history = item.history || [];
  const latestPrice = item.todayPrice;
  const price7DaysAgo = history[history.length - 8]?.price || latestPrice;
  const price30DaysAgo = history[history.length - 31]?.price || latestPrice;
  
  const change7d = ((latestPrice - price7DaysAgo) / price7DaysAgo) * 100;
  const change30d = ((latestPrice - price30DaysAgo) / price30DaysAgo) * 100;

  const dynData = getDynamicDetails(item);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-accent mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT MAIN COLUMN --- */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Top Info Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <div className="flex-1 min-w-[200px]">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category} • {item.country}</span>
                <h1 className="text-3xl font-bold text-slate-900 mt-1 leading-tight">{item.name}</h1>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed">{item.description || `${item.name} is a key asset in the ${item.category} market.`}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-bold text-slate-900">
                  {item.todayPrice.toLocaleString()} <span className="text-base text-slate-400 font-medium">{item.unit}</span>
                </div>
                <div className={`flex items-center justify-end gap-1 mt-1 text-base font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                   {isPositive ? '+' : ''}{item.percentChange}%
                   <span className="text-slate-400 text-xs font-normal">Today</span>
                </div>
              </div>
            </div>

            {/* Main Chart */}
            <div className="h-[350px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={item.history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={isPositive ? '#10b981' : '#ef4444'} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    tick={{fontSize: 11, fill: '#94a3b8'}} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tick={{fontSize: 11, fill: '#94a3b8'}}
                    axisLine={false}
                    tickLine={false}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px'}}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke={isPositive ? '#10b981' : '#ef4444'} 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Historical Data Table (Compacted) */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 overflow-hidden">
            <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">Historical Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-500">
                <thead className="text-[10px] text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-1.5">Date</th>
                    <th className="px-4 py-1.5">Price</th>
                    <th className="px-4 py-1.5">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {[...item.history].reverse().slice(0, 8).map((record, idx) => (
                    <tr key={idx} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-4 py-1.5 font-medium">{record.date}</td>
                      <td className="px-4 py-1.5 text-slate-900">{record.price.toLocaleString()}</td>
                      <td className="px-4 py-1.5">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Global Prices Tables (Main Column) */}
           <div className="pt-2">
              <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-accent rounded-sm"></span>
                Live Global Prices & Market Intelligence
              </h3>
              <div className="grid grid-cols-1 gap-6">
                {dynData.globalTables.map((table, idx) => (
                  <PriceTable key={idx} title={table.region} rows={table.data} />
                ))}
              </div>
              <div className="bg-slate-100 rounded-xl p-4 text-xs text-slate-500 leading-relaxed border border-slate-200 mt-2">
                <p>
                  Prices updated in real-time. {item.name} is a key benchmark in the {item.category} sector. 
                  This table provides an overview across major global currencies. Timestamps are UTC.
                </p>
              </div>
           </div>

        </div>

        {/* --- RIGHT SIDEBAR --- */}
        <div className="space-y-6">
          
          {/* 1. Performance */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500 text-sm">7 Days</span>
                <span className={`font-semibold text-sm ${change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change7d > 0 ? '+' : ''}{change7d.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500 text-sm">30 Days</span>
                <span className={`font-semibold text-sm ${change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change30d > 0 ? '+' : ''}{change30d.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">Last Updated</span>
                <span className="font-medium text-slate-900 text-sm">{new Date(item.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          {/* 2. Price Alerts (DYNAMIC & EMAIL SIGNUP) */}
          <div className="bg-primary rounded-2xl shadow-lg p-5 text-white text-center relative overflow-hidden">
             <div className="relative z-10">
                 <h3 className="text-base font-bold mb-1">Price Alerts</h3>
                 <p className="text-slate-300 text-xs mb-4">
                    Get notified when <strong className="text-white">{item.name}</strong> reaches your target price.
                 </p>
                 
                 {isSubscribed ? (
                     <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 animate-fade-in">
                        <p className="text-green-300 text-xs font-semibold flex items-center justify-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                          Alert Active! We'll email you.
                        </p>
                     </div>
                 ) : (
                     <form onSubmit={handleSubscribe} className="space-y-3">
                        <input 
                            type="email" 
                            placeholder="Enter your email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                        />
                         <div className="relative">
                           <input 
                               type="number" 
                               step="0.01"
                               placeholder={`Target Price (${item.unit.split('/')[0]})`} 
                               value={targetPrice}
                               onChange={(e) => setTargetPrice(e.target.value)}
                               className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-colors"
                           />
                           <span className="absolute right-3 top-2 text-[10px] text-slate-400 pointer-events-none">Optional</span>
                         </div>
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-2 bg-accent hover:bg-sky-500 rounded-lg text-xs font-semibold text-white transition-colors shadow-sm disabled:opacity-50"
                        >
                            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                        </button>
                     </form>
                 )}
             </div>
             {/* Decorative background elements */}
             <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl"></div>
             <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 bg-blue-500/20 rounded-full blur-2xl"></div>
          </div>

          {/* 3. Advertisement */}
          <AdsPlaceholder />

          {/* --- THE DETAILS BLOCK (Ordered below Ads as requested) --- */}
          
          {/* A. Daily Price */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-100 pb-2">
              {item.name} Daily Price
            </h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-500 text-sm">AM Fix ({dynData.unitCode})</span>
              <span className="font-mono font-bold text-slate-900">{dynData.dailyPrices.am.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">PM Fix ({dynData.unitCode})</span>
              <span className="font-mono font-bold text-slate-900">{dynData.dailyPrices.pm.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
            </div>
          </div>

          {/* B. Ratios */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-100 pb-2">
              {item.category === 'metal' ? 'Metal' : 'Market'} Ratios
            </h3>
            <div className="space-y-3">
              {dynData.ratios.map((r, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-600">{r.pair}</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900 block text-sm">{r.ratio}</span>
                    <span className={`text-xs ${Number(r.change) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Number(r.change) > 0 ? '+' : ''}{r.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* C. Top Stories */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-100 pb-2">Top Stories</h3>
            <ul className="space-y-4">
              {dynData.stories.map((story, i) => (
                <li key={i} className="group cursor-pointer">
                  <p className="text-sm font-medium text-slate-800 group-hover:text-accent transition-colors leading-snug mb-1">
                    {story.title}
                  </p>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {story.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* D. Upcoming Events */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-100 pb-2">Upcoming Events</h3>
            <ul className="space-y-3">
              {dynData.events.map((evt, i) => (
                <li key={i} className="flex justify-between items-start text-sm">
                  <span className="font-medium text-slate-700 truncate pr-2">{evt.event}</span>
                  <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs whitespace-nowrap">{evt.date}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* E. Regional Charts (Sidebar) */}
          <div className="space-y-4">
            {dynData.charts.map((chart, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-2">{chart.label}</h3>
                <div className="h-28 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chart.data}>
                      <defs>
                        <linearGradient id={`colorChart${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={chart.color} stopOpacity={0.2}/>
                          <stop offset="95%" stopColor={chart.color} stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Area type="monotone" dataKey="price" stroke={chart.color} strokeWidth={2} fillOpacity={1} fill={`url(#colorChart${i})`} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">{chart.sub}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Detail;