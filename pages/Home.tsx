
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Item, Category, NewsItem, Benchmark } from '../types';
import { api } from '../services/dataService';
import PriceCard from '../components/PriceCard';
import AdsPlaceholder from '../components/AdsPlaceholder';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

const MARKET_FILTERS: { label: string; value: Category | 'all' }[] = [
  { label: 'All Markets', value: 'all' },
  { label: 'Metals', value: 'metal' },
  { label: 'Energy', value: 'energy' },
  { label: 'Lubricants', value: 'lubricant' },
];

const TIME_RANGES = ['1D', '1W', '1M', '6M', 'YTD', '1Y', '5Y'];

interface HomeProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onOpenChat: () => void;
}

const Home: React.FC<HomeProps> = ({ searchTerm, setSearchTerm, onOpenChat }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [benchmarks, setBenchmarks] = useState<Benchmark[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'popular' | 'top' | 'under'>('popular');
  const [marketCategoryFilter, setMarketCategoryFilter] = useState<Category | 'all'>('all');
  const [timeRange, setTimeRange] = useState('1D');
  const [isUpdatingRange, setIsUpdatingRange] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getDashboardData();
      setItems(data.items);
      setNews(data.news);
      setBenchmarks(data.benchmarks);
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleTimeRangeChange = (range: string) => {
    setTimeRange(range);
    setIsUpdatingRange(true);
    // Simulate data refresh for visual feedback
    setTimeout(() => {
        setIsUpdatingRange(false);
    }, 400);
  };

  const globalFilteredItems = items.filter(item => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase().trim();
    return (
      item.name.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.country.toLowerCase().includes(term) ||
      (item.symbol && item.symbol.toLowerCase().includes(term)) ||
      (item.subcategory && item.subcategory.toLowerCase().includes(term))
    );
  });
  
  const getTodayMarketItems = () => {
    let filtered = globalFilteredItems;
    
    // 1. Filter by category
    if (marketCategoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === marketCategoryFilter);
    }

    // 2. Sort by Tab
    if (activeTab === 'top') {
        // Sort descending by percentChange
        return [...filtered].sort((a, b) => b.percentChange - a.percentChange).slice(0, 10);
    } else if (activeTab === 'under') {
        // Sort ascending by percentChange
        return [...filtered].sort((a, b) => a.percentChange - b.percentChange).slice(0, 10);
    }

    // Popular (default - just list order for now or randomized "popular" simulation)
    return filtered.slice(0, 10);
  };

  const todayMarketItems = getTodayMarketItems();

  const preciousMetals = globalFilteredItems.filter(i => i.subcategory === 'Precious Metals');
  const industrialMetals = globalFilteredItems.filter(i => i.subcategory === 'Industrial Metals');
  const energyItems = globalFilteredItems.filter(i => i.category === 'energy');
  const lubricantItems = globalFilteredItems.filter(i => i.category === 'lubricant');
  const agricultureItems = globalFilteredItems.filter(i => i.category === 'agriculture');

  const trendingItems = [...items].sort((a, b) => b.percentChange - a.percentChange).slice(0, 5);

  const MarketSection = ({ title, data }: { title: string, data: Item[] }) => {
    if (data.length === 0) return null;
    return (
      <div className="mb-10 animate-fade-in">
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-accent rounded-sm"></span>
          {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {data.map(item => <PriceCard key={item.id} item={item} />)}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* --- HERO HEADER --- */}
      <div className="relative bg-slate-900 text-white pt-12 pb-32 overflow-hidden">
        {/* Decorative background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4"></div>
        </div>

        <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-xs font-medium text-accent mb-6 backdrop-blur-sm">
                 <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
                Live Market Data
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-5 leading-tight">
                Global Commodity <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-slate-400">Price Intelligence</span>
              </h1>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl leading-relaxed">
                Real-time tracking for Metals, Energy, and Lubricants. 
                Access live prices, historical data, and AI-driven insights to make smarter decisions.
              </p>
            </div>
            
            <div className="hidden md:block text-right self-center md:self-end mb-2">
               <div className="bg-slate-800/40 border border-slate-700/50 backdrop-blur-md rounded-2xl p-5 text-left min-w-[240px] shadow-xl">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold">Market Status</p>
                    <div className="animate-pulse w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">Open</div>
                  <p className="text-slate-500 text-xs pt-2 border-t border-slate-700/50 mt-2">
                    {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </p>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[95%] mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        
        {/* Ads Placeholder wrapped in a card to pop against the hero */}
        <div className="bg-white p-1 rounded-xl shadow-lg shadow-slate-200/50 mb-8 border border-slate-100">
            <AdsPlaceholder />
        </div>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
             <p>Fetching live market data...</p>
          </div>
        ) : (
          <>
            {globalFilteredItems.length === 0 && (
               <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
                 <div className="text-slate-300 text-6xl mb-4">🔍</div>
                 <h3 className="text-xl font-semibold text-slate-600">No items found</h3>
                 <p className="text-slate-400 mt-2">Try adjusting your search terms.</p>
                 <button onClick={() => setSearchTerm('')} className="mt-4 text-accent font-medium hover:underline">Clear Search</button>
               </div>
            )}

            {globalFilteredItems.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* --- LEFT MAIN COLUMN --- */}
                <div className="lg:col-span-3 space-y-10">
                  
                  {/* --- TOP ROW: BENCHMARKS + TODAY MARKETS --- */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      
                      {/* --- BENCHMARKS (LEFT) --- */}
                      <div className="xl:col-span-1 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                        <div className="flex justify-between items-center mb-4">
                           <h2 className="text-lg font-bold text-slate-800">Benchmarks</h2>
                           <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-md font-medium">Global</span>
                        </div>
                        
                        {/* TIME RANGE FILTER BAR */}
                        <div className="flex flex-wrap gap-1.5 mb-5">
                           {TIME_RANGES.map(range => (
                               <button
                                   key={range}
                                   onClick={() => handleTimeRangeChange(range)}
                                   className={`px-2 py-1 text-[10px] font-bold rounded-md transition-all ${
                                       timeRange === range
                                           ? 'bg-slate-800 text-white shadow-sm'
                                           : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                                   }`}
                               >
                                   {range}
                               </button>
                           ))}
                        </div>

                        <div className={`h-[180px] w-full mb-4 transition-opacity duration-300 ${isUpdatingRange ? 'opacity-50' : 'opacity-100'}`}>
                           <ResponsiveContainer width="100%" height="100%">
                             <LineChart>
                               <Tooltip 
                                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                                 labelStyle={{fontSize: '12px', color: '#64748b'}}
                               />
                               <XAxis dataKey="date" hide />
                               <YAxis domain={['auto', 'auto']} hide />
                               {benchmarks.map((bench, idx) => (
                                 <Line 
                                   key={bench.name}
                                   type="monotone" 
                                   data={bench.data} 
                                   dataKey="price" 
                                   name={bench.name}
                                   stroke={['#0ea5e9', '#ef4444', '#eab308'][idx % 3]} 
                                   strokeWidth={2}
                                   dot={false}
                                 />
                               ))}
                             </LineChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col gap-3 mt-auto">
                           {benchmarks.map((bench, idx) => (
                              <div key={bench.name} className="flex items-center justify-between text-sm pb-2 border-b border-slate-50 last:border-0 hover:bg-slate-50 p-1 rounded transition-colors">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full" style={{backgroundColor: ['#0ea5e9', '#ef4444', '#eab308'][idx % 3]}}></span>
                                    <span className="text-slate-600 font-medium">{bench.name}</span>
                                </div>
                                <div className="text-right">
                                    <span className="font-mono text-slate-900 block font-semibold">{bench.value.toLocaleString()}</span>
                                    <span className={`text-[10px] font-bold ${bench.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {bench.change > 0 ? '+' : ''}{bench.change}%
                                    </span>
                                </div>
                              </div>
                           ))}
                        </div>
                      </div>

                      {/* --- TODAY IN THE MARKETS (RIGHT) --- */}
                      <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                        
                        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                             <h2 className="text-lg font-bold text-slate-800 mb-3 flex items-center gap-2">
                                Today in the Markets
                             </h2>
                             <div className="flex flex-wrap gap-2">
                                {MARKET_FILTERS.map((filter) => (
                                  <button
                                    key={filter.value}
                                    onClick={() => setMarketCategoryFilter(filter.value)}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                                      marketCategoryFilter === filter.value 
                                        ? 'bg-accent text-white shadow-sm' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {filter.label}
                                  </button>
                                ))}
                             </div>
                          </div>
                          {/* Tabs */}
                          <div className="flex bg-slate-100 rounded-lg p-1 self-start sm:self-end">
                            {(['popular', 'top', 'under'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                                    activeTab === tab 
                                        ? 'bg-white text-slate-900 shadow-sm' 
                                        : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                    {tab === 'popular' ? 'Popular' : tab === 'top' ? 'Top' : 'Under'}
                                </button>
                            ))}
                          </div>
                        </div>
                        
                        <div className="overflow-x-auto flex-1">
                          <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
                              <tr>
                                <th className="px-6 py-3 font-semibold">Name</th>
                                <th className="px-6 py-3 font-semibold text-right">Price</th>
                                <th className="px-6 py-3 font-semibold text-right">Unit</th>
                                <th className="px-6 py-3 font-semibold text-right">% Change</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {todayMarketItems.map(item => (
                                <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => window.location.hash = `#/product/${item.slug}`}>
                                  <td className="px-6 py-4 font-medium text-slate-800">
                                    {item.name}
                                    {item.subcategory && <span className="block text-[10px] text-slate-400 font-normal">{item.subcategory}</span>}
                                  </td>
                                  <td className="px-6 py-4 text-right font-mono text-slate-900 font-medium">
                                    {item.todayPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                  </td>
                                  <td className="px-6 py-4 text-right text-slate-500 text-xs">
                                    {item.unit}
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                     <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${item.percentChange >= 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                       {item.percentChange > 0 ? '+' : ''}{item.percentChange}%
                                     </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                  </div>

                  {/* --- CATEGORY SECTIONS --- */}
                  <MarketSection title="Precious Metals" data={preciousMetals} />
                  <MarketSection title="Energy" data={energyItems} />
                  <MarketSection title="Industrial Metals" data={industrialMetals} />
                  <MarketSection title="Lubricants" data={lubricantItems} />
                  <MarketSection title="Agriculture" data={agricultureItems} />

                </div>

                {/* --- RIGHT SIDEBAR --- */}
                <div className="space-y-8">
                  
                  {/* 1. Trending Box (Moved to Top) */}
                  <div className="bg-gradient-to-br from-primary to-slate-800 rounded-xl shadow-lg p-6 text-white">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                       <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                       Trending Now
                    </h3>
                    <ul className="space-y-3">
                      {trendingItems.map((item, i) => (
                        <li key={i} className="flex justify-between items-center text-sm border-b border-white/10 pb-2 last:border-0 last:pb-0">
                          <span className="font-medium text-slate-200">{item.name}</span>
                          <span className={`${item.percentChange >= 0 ? 'text-green-400' : 'text-red-400'} font-mono`}>
                            {item.percentChange > 0 ? '+' : ''}{item.percentChange}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 2. MetalTrack AI (Moved Below Trending) */}
                  <div 
                    onClick={onOpenChat}
                    className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 cursor-pointer group hover:shadow-md transition-all relative overflow-hidden"
                  >
                     <div className="absolute top-0 right-0 p-3 opacity-10">
                        <svg className="w-16 h-16 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                     </div>
                     <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                        <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">AI</span>
                        MetalTrack AI
                     </h3>
                     <p className="text-sm text-slate-500 mb-4">Get instant analysis, price forecasts, and market insights.</p>
                     
                     <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-400 flex items-center justify-between group-hover:border-indigo-300 group-hover:bg-white transition-colors">
                        <span>Ask me anything...</span>
                        <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </div>
                     
                     <p className="text-[10px] text-center text-indigo-500 font-medium mt-3">Click to open chat widget</p>
                  </div>

                  {/* 3. Latest News (Below AI, Not Sticky, Natural Scroll) */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-5">Latest News</h3>
                    <div className="space-y-6 relative">
                       {news.map((n) => (
                         <Link to={`/news/${n.id}`} key={n.id} className="block group">
                            <div className="flex gap-3 items-start">
                                {n.imageUrl && (
                                    <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden">
                                        <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] text-slate-400 font-medium mb-1 uppercase">{n.source} • {n.time}</p>
                                    <h4 className="text-sm font-semibold text-slate-800 group-hover:text-accent transition-colors leading-snug">
                                        {n.title}
                                    </h4>
                                </div>
                            </div>
                         </Link>
                       ))}
                    </div>
                    <button className="w-full mt-6 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                      View All News
                    </button>
                  </div>

                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
