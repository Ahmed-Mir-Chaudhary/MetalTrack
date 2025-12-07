import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Item } from '../types';
import { api } from '../services/dataService';
import AdsPlaceholder from '../components/AdsPlaceholder';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA FOR NEW SECTIONS ---
const LIVE_TABLES = [
  {
    region: "Live Gold Price (Global - USD/EUR/GBP + grams)",
    data: [
      { name: "Gold USD /oz", bid: 2045.50, ask: 2046.10, chg: 8.50, pchg: 0.42, high: 2050.00, low: 2038.00, time: "14:05:22" },
      { name: "Gold EUR /oz", bid: 1885.20, ask: 1886.00, chg: 5.20, pchg: 0.28, high: 1890.00, low: 1880.00, time: "14:05:21" },
      { name: "Gold GBP /oz", bid: 1615.80, ask: 1616.50, chg: -2.10, pchg: -0.13, high: 1620.00, low: 1612.00, time: "14:05:20" },
      { name: "Gold USD /g", bid: 65.76, ask: 65.78, chg: 0.27, pchg: 0.42, high: 65.91, low: 65.52, time: "14:05:22" },
      { name: "Gold EUR /g", bid: 60.61, ask: 60.63, chg: 0.17, pchg: 0.28, high: 60.77, low: 60.44, time: "14:05:21" },
      { name: "Gold GBP /g", bid: 51.95, ask: 51.97, chg: -0.07, pchg: -0.13, high: 52.08, low: 51.83, time: "14:05:20" },
    ]
  },
  {
    region: "Live Gold Price Europe",
    data: [
      { name: "Gold CHF /oz", bid: 1795.20, ask: 1796.50, chg: 3.50, pchg: 0.19, high: 1801.00, low: 1790.00, time: "14:04" },
      { name: "Gold SEK /oz", bid: 21450.00, ask: 21480.00, chg: 120.00, pchg: 0.56, high: 21500.00, low: 21350.00, time: "14:04" },
      { name: "Gold NOK /oz", bid: 21600.50, ask: 21640.00, chg: 85.00, pchg: 0.39, high: 21680.00, low: 21550.00, time: "14:04" },
      { name: "Gold DKK /oz", bid: 14050.25, ask: 14080.00, chg: 35.00, pchg: 0.25, high: 14100.00, low: 14000.00, time: "14:04" },
      { name: "Gold PLN /oz", bid: 8250.00, ask: 8280.00, chg: 45.00, pchg: 0.55, high: 8300.00, low: 8200.00, time: "14:04" },
    ]
  },
  {
    region: "Live Gold Price Americas",
    data: [
      { name: "Gold CAD /oz", bid: 2750.40, ask: 2752.00, chg: 10.20, pchg: 0.37, high: 2755.00, low: 2740.00, time: "14:04" },
      { name: "Gold BRL /oz", bid: 10120.50, ask: 10150.00, chg: 45.00, pchg: 0.44, high: 10180.00, low: 10050.00, time: "14:04" },
      { name: "Gold MXN /oz", bid: 34890.00, ask: 34950.00, chg: 150.00, pchg: 0.43, high: 35000.00, low: 34800.00, time: "14:04" },
      { name: "Gold ARS /oz", bid: 1850500.00, ask: 1860000.00, chg: 25000.00, pchg: 1.37, high: 1870000.00, low: 1840000.00, time: "14:04" },
    ]
  },
  {
    region: "Live Gold Price Asia",
    data: [
      { name: "Gold CNY /oz", bid: 14560.00, ask: 14580.00, chg: 20.00, pchg: 0.14, high: 14600.00, low: 14500.00, time: "14:04" },
      { name: "Gold INR /10g", bid: 62500.00, ask: 62600.00, chg: 150.00, pchg: 0.24, high: 62700.00, low: 62400.00, time: "14:04" },
      { name: "Gold JPY /oz", bid: 302000.00, ask: 302500.00, chg: 1200.00, pchg: 0.40, high: 303000.00, low: 301000.00, time: "14:04" },
      { name: "Gold HKD /oz", bid: 15900.00, ask: 15920.00, chg: 30.00, pchg: 0.19, high: 15950.00, low: 15850.00, time: "14:04" },
      { name: "Gold SGD /oz", bid: 2750.50, ask: 2755.00, chg: 8.50, pchg: 0.31, high: 2760.00, low: 2745.00, time: "14:04" },
      { name: "Gold KRW /oz", bid: 2715000.00, ask: 2720000.00, chg: 5000.00, pchg: 0.18, high: 2725000.00, low: 2710000.00, time: "14:04" },
    ]
  },
  {
    region: "Live Gold Price Africa",
    data: [
      { name: "Gold ZAR /oz", bid: 38950.00, ask: 39000.00, chg: 250.00, pchg: 0.65, high: 39100.00, low: 38800.00, time: "14:04" },
      { name: "Gold EGP /oz", bid: 98500.00, ask: 99000.00, chg: 1200.00, pchg: 1.23, high: 99500.00, low: 98000.00, time: "14:04" },
    ]
  },
  {
    region: "Live Gold Price Middle East",
    data: [
      { name: "Gold AED /oz", bid: 7515.50, ask: 7520.00, chg: 31.00, pchg: 0.41, high: 7530.00, low: 7500.00, time: "14:04" },
      { name: "Gold SAR /oz", bid: 7670.00, ask: 7675.00, chg: 32.00, pchg: 0.42, high: 7685.00, low: 7650.00, time: "14:04" },
      { name: "Gold TRY /oz", bid: 63500.00, ask: 63600.00, chg: 850.00, pchg: 1.35, high: 63800.00, low: 63000.00, time: "14:04" },
      { name: "Gold ILS /oz", bid: 7450.00, ask: 7460.00, chg: 25.00, pchg: 0.34, high: 7470.00, low: 7430.00, time: "14:04" },
    ]
  },
  {
    region: "Live Gold Price Australasia",
    data: [
      { name: "Gold AUD /oz", bid: 3120.50, ask: 3125.00, chg: 15.50, pchg: 0.50, high: 3130.00, low: 3110.00, time: "14:04" },
      { name: "Gold NZD /oz", bid: 3340.00, ask: 3345.00, chg: 12.00, pchg: 0.36, high: 3350.00, low: 3330.00, time: "14:04" },
    ]
  }
];

const RATIOS = [
  { pair: "Gold / Silver", ratio: 89.24, change: -0.15 },
  { pair: "Gold / Platinum", ratio: 2.31, change: 0.05 },
  { pair: "Platinum / Palladium", ratio: 0.94, change: -0.01 },
  { pair: "Gold / Oil", ratio: 28.50, change: 1.20 },
];

const STORIES = [
  { title: "Gold prices edge higher as dollar softens ahead of Fed data", time: "2 hours ago" },
  { title: "Central banks continue gold buying spree in Q3", time: "5 hours ago" },
  { title: "Mining output stabilizes in South African sector", time: "8 hours ago" },
  { title: "Silver follows gold's lead, testing resistance at $23", time: "11 hours ago" },
  { title: "Market Analysis: Why $2,100 remains the key psychological level", time: "1 day ago" },
];

const EVENTS = [
  { event: "US CPI Data Release", date: "Feb 13, 08:30 AM" },
  { event: "FOMC Meeting Minutes", date: "Feb 21, 02:00 PM" },
  { event: "ECB President Speech", date: "Feb 23, 10:00 AM" },
  { event: "Non-Farm Payrolls", date: "Mar 08, 08:30 AM" },
];

const PriceTable = ({ title, rows }: { title: string, rows: any[] }) => (
  <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
    <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
      <h3 className="font-bold text-slate-800 text-sm uppercase">{title}</h3>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-xs md:text-sm whitespace-nowrap">
        <thead className="bg-white text-slate-500 border-b border-slate-100">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-right font-semibold">Bid</th>
            <th className="px-4 py-3 text-right font-semibold">Ask</th>
            <th className="px-4 py-3 text-right font-semibold">+/-</th>
            <th className="px-4 py-3 text-right font-semibold">%</th>
            <th className="px-4 py-3 text-right font-semibold hidden sm:table-cell">High</th>
            <th className="px-4 py-3 text-right font-semibold hidden sm:table-cell">Low</th>
            <th className="px-4 py-3 text-right font-medium text-slate-400">Time</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50 transition-colors">
              <td className="px-4 py-3 font-medium text-slate-700">{row.name}</td>
              <td className="px-4 py-3 text-right font-mono text-slate-900">{row.bid.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td className="px-4 py-3 text-right font-mono text-slate-500">{row.ask.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
              <td className={`px-4 py-3 text-right font-semibold ${row.chg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {row.chg > 0 ? '+' : ''}{row.chg.toFixed(2)}
              </td>
              <td className={`px-4 py-3 text-right font-semibold ${row.pchg >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {row.pchg.toFixed(2)}%
              </td>
              <td className="px-4 py-3 text-right text-slate-500 hidden sm:table-cell">{row.high.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-slate-500 hidden sm:table-cell">{row.low.toLocaleString()}</td>
              <td className="px-4 py-3 text-right text-slate-400 text-xs">{row.time}</td>
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

  useEffect(() => {
    const fetchData = async () => {
      if (slug) {
        const data = await api.getItemBySlug(slug);
        setItem(data || null);
      }
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) return <div className="flex h-screen items-center justify-center text-slate-400">Loading...</div>;
  if (!item) return <div className="flex h-screen items-center justify-center text-slate-500">Item not found</div>;

  const isPositive = item.percentChange >= 0;

  // Calculate stats
  const history = item.history || [];
  const latestPrice = item.todayPrice;
  const price7DaysAgo = history[history.length - 8]?.price || latestPrice;
  const price30DaysAgo = history[history.length - 31]?.price || latestPrice;
  
  const change7d = ((latestPrice - price7DaysAgo) / price7DaysAgo) * 100;
  const change30d = ((latestPrice - price30DaysAgo) / price30DaysAgo) * 100;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-accent mb-6 transition-colors">
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-8">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{item.category} • {item.country}</span>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-1">{item.name}</h1>
                <p className="text-slate-500 mt-2 max-w-xl">{item.description}</p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-slate-900">{item.todayPrice.toLocaleString()} <span className="text-lg text-slate-400 font-medium">{item.unit}</span></div>
                <div className={`flex items-center justify-end gap-1 mt-1 text-lg font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                   {isPositive ? '+' : ''}{item.percentChange}%
                   <span className="text-slate-400 text-xs font-normal">Today</span>
                </div>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[400px] w-full mt-10">
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
                    tick={{fontSize: 12, fill: '#94a3b8'}} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={['auto', 'auto']} 
                    tick={{fontSize: 12, fill: '#94a3b8'}}
                    axisLine={false}
                    tickLine={false}
                    width={60}
                  />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                    labelStyle={{color: '#64748b', fontSize: '12px', marginBottom: '4px'}}
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

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Historical Data</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-500">
                <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                  <tr>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Unit</th>
                  </tr>
                </thead>
                <tbody>
                  {[...item.history].reverse().slice(0, 10).map((record, idx) => (
                    <tr key={idx} className="bg-white border-b hover:bg-slate-50">
                      <td className="px-6 py-4">{record.date}</td>
                      <td className="px-6 py-4 font-medium text-slate-900">{record.price}</td>
                      <td className="px-6 py-4">{item.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500">7 Days</span>
                <span className={`font-semibold ${change7d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change7d > 0 ? '+' : ''}{change7d.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-500">30 Days</span>
                <span className={`font-semibold ${change30d >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {change30d > 0 ? '+' : ''}{change30d.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Last Updated</span>
                <span className="font-medium text-slate-900">{new Date(item.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-primary rounded-2xl shadow-lg p-6 text-white text-center">
             <h3 className="text-lg font-bold mb-2">Price Alerts</h3>
             <p className="text-slate-300 text-sm mb-4">Get notified when {item.name} reaches your target price.</p>
             <button disabled className="w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
               Set Alert (Coming Soon)
             </button>
          </div>

          <AdsPlaceholder />
        </div>
      </div>

      {/* --- NEW SECTION: LIVE GLOBAL MARKETS DASHBOARD --- */}
      <div className="mt-16 pt-10 border-t border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-accent rounded-sm"></span>
          Live Global Gold Prices & Market Intelligence
        </h2>

        {/* Global Live Prices Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          {LIVE_TABLES.map((table, idx) => (
            <PriceTable key={idx} title={table.region} rows={table.data} />
          ))}
        </div>

        {/* Bottom Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          
          {/* Column 1: Daily Price & Ratios */}
          <div className="space-y-8">
            {/* Gold Daily Price Highlight */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 uppercase text-sm mb-4 border-b border-slate-100 pb-2">Gold Daily Price</h3>
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 text-sm">AM Fix (USD)</span>
                <span className="font-mono font-bold text-slate-900">2,038.50</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 text-sm">PM Fix (USD)</span>
                <span className="font-mono font-bold text-slate-900">2,042.15</span>
              </div>
            </div>

             {/* Metal Ratios */}
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 uppercase text-sm mb-4 border-b border-slate-100 pb-2">Metal Ratios</h3>
              <div className="space-y-3">
                {RATIOS.map((r, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">{r.pair}</span>
                    <div className="text-right">
                       <span className="font-bold text-slate-900 block">{r.ratio}</span>
                       <span className={`text-xs ${r.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                         {r.change > 0 ? '+' : ''}{r.change}
                       </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: News & Events */}
          <div className="space-y-8">
            {/* Top Stories */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 uppercase text-sm mb-4 border-b border-slate-100 pb-2">Top Stories</h3>
              <ul className="space-y-4">
                {STORIES.map((story, i) => (
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

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5">
              <h3 className="font-bold text-slate-800 uppercase text-sm mb-4 border-b border-slate-100 pb-2">Upcoming Events</h3>
              <ul className="space-y-3">
                 {EVENTS.map((evt, i) => (
                   <li key={i} className="flex justify-between items-start text-sm">
                      <span className="font-medium text-slate-700">{evt.event}</span>
                      <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-xs whitespace-nowrap">{evt.date}</span>
                   </li>
                 ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Charts */}
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 h-64 flex flex-col">
               <h3 className="font-bold text-slate-800 uppercase text-sm mb-4">Gold Euro Chart</h3>
               <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  <span className="text-xs">XAU/EUR Chart Placeholder</span>
               </div>
            </div>
             <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-5 h-64 flex flex-col">
               <h3 className="font-bold text-slate-800 uppercase text-sm mb-4">Gold GBP Chart</h3>
               <div className="flex-1 bg-slate-50 rounded border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                  <svg className="w-10 h-10 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>
                  <span className="text-xs">XAU/GBP Chart Placeholder</span>
               </div>
            </div>
          </div>
        </div>
        
        {/* Info Paragraph */}
        <div className="bg-slate-100 rounded-xl p-6 text-sm text-slate-600 leading-relaxed border border-slate-200">
          <p className="font-semibold text-slate-800 mb-2">About Live Global Prices</p>
          <p>
            Gold price quotes in this table are updated in real-time. The gold price is one of the most widely followed financial benchmarks in the world. As the most popular precious metal, gold is seen as a safe haven asset and a hedge against inflation. This page provides a comprehensive overview of gold prices across major global currencies and regions, allowing investors to track arbitrage opportunities and regional demand fluctuations. All time-stamps are UTC. Bid/Ask spreads represent the wholesale market liquidity.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Detail;