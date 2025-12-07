import React, { useEffect, useState } from 'react';
import { Item, Category } from '../types';
import { api } from '../services/dataService';
import PriceCard from '../components/PriceCard';
import AdsPlaceholder from '../components/AdsPlaceholder';
import { MOCK_NEWS, MOCK_TRENDING, MOCK_BENCHMARKS } from '../constants';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';

// Updated Filters to match requirement: All Markets | Metals | Energy | Lubricants
const MARKET_FILTERS: { label: string; value: Category | 'all' }[] = [
  { label: 'All Markets', value: 'all' },
  { label: 'Metals', value: 'metal' },
  { label: 'Energy', value: 'energy' },
  { label: 'Lubricants', value: 'lubricant' },
];

const Home: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for "Today in the Markets"
  const [activeTab, setActiveTab] = useState<'popular' | 'top' | 'under'>('popular');
  const [marketCategoryFilter, setMarketCategoryFilter] = useState<Category | 'all'>('all');
  
  const [comparisonRange, setComparisonRange] = useState('1M');

  useEffect(() => {
    const fetchData = async () => {
      const data = await api.getAllItems();
      setItems(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  // --- GLOBAL SEARCH FILTER LOGIC ---
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
  
  // --- LOGIC FOR TODAY IN THE MARKETS ---
  const getTodayMarketItems = () => {
    // 1. Filter by category (applied on top of global search)
    let filtered = globalFilteredItems;
    if (marketCategoryFilter !== 'all') {
      filtered = filtered.filter(i => i.category === marketCategoryFilter);
    }

    // 2. Sort based on tab
    let sorted = [...filtered];
    
    if (activeTab === 'popular') {
      // For "Popular", we stick to the default order which is roughly prioritized in constants
      return sorted.slice(0, 10);
    } else if (activeTab === 'top') {
      // Descending % change
      return sorted.sort((a, b) => b.percentChange - a.percentChange).slice(0, 10);
    } else if (activeTab === 'under') {
      // Ascending % change
      return sorted.sort((a, b) => a.percentChange - b.percentChange).slice(0, 10);
    }
    
    return sorted.slice(0, 10);
  };

  const todayMarketItems = getTodayMarketItems();

  // Group items for "Market Overview" using globalFilteredItems
  const preciousMetals = globalFilteredItems.filter(i => i.subcategory === 'Precious Metals');
  const industrialMetals = globalFilteredItems.filter(i => i.subcategory === 'Industrial Metals');
  const energyItems = globalFilteredItems.filter(i => i.category === 'energy');
  const lubricantItems = globalFilteredItems.filter(i => i.category === 'lubricant');
  const agricultureItems = globalFilteredItems.filter(i => i.category === 'agriculture');

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
      
      {/* --- HERO SECTION --- */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
            Live <span className="text-accent">Metal</span> & <span className="text-orange-400">Lubricant</span> Prices
          </h1>
          <p className="text-slate-300 mb-6">Real-time global & local market insights.</p>
          
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search gold, oil, copper, USA..."
              className="w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-accent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-5 h-5 absolute left-3 top-3.5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs font-medium text-slate-300">
             <span>Quick Links:</span>
             {['Gold', 'Silver', 'Crude Oil', 'Copper', 'Grease'].map(tag => (
               <span 
                 key={tag} 
                 className="bg-white/10 hover:bg-white/20 px-2 py-1 rounded cursor-pointer transition-colors"
                 onClick={() => setSearchTerm(tag)}
               >
                 {tag}
               </span>
             ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <AdsPlaceholder />
        
        {globalFilteredItems.length === 0 && !loading && (
           <div className="text-center py-20">
             <div className="text-slate-300 text-6xl mb-4">🔍</div>
             <h3 className="text-xl font-semibold text-slate-600">No items found</h3>
             <p className="text-slate-400 mt-2">Try adjusting your search terms or filters.</p>
             <button onClick={() => setSearchTerm('')} className="mt-4 text-accent font-medium hover:underline">Clear Search</button>
           </div>
        )}

        {globalFilteredItems.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* --- LEFT MAIN COLUMN --- */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* --- SECTION 2: TODAY IN THE MARKETS (UPDATED) --- */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                {/* Header with Title and Category Filters */}
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                     <h2 className="text-lg font-bold text-slate-800 mb-3">Today in the Markets</h2>
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
                  <div className="flex bg-slate-100 rounded-lg p-1 self-start md:self-end">
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
                
                {/* Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 bg-slate-50 uppercase border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-3 font-semibold">Name</th>
                        <th className="px-6 py-3 font-semibold hidden sm:table-cell">Symbol</th>
                        <th className="px-6 py-3 font-semibold text-right">Price</th>
                        <th className="px-6 py-3 font-semibold text-right">Unit</th>
                        <th className="px-6 py-3 font-semibold text-right">% Change</th>
                        <th className="px-6 py-3 font-semibold text-right hidden md:table-cell">Contract</th>
                        <th className="px-6 py-3 font-semibold text-right hidden lg:table-cell">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {todayMarketItems.length > 0 ? (
                        todayMarketItems.map(item => (
                          <tr key={item.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => window.location.hash = `#/product/${item.slug}`}>
                            <td className="px-6 py-4 font-medium text-slate-800">
                              {item.name}
                              {item.subcategory && <span className="block text-[10px] text-slate-400 font-normal">{item.subcategory}</span>}
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-mono text-xs hidden sm:table-cell">{item.symbol || '-'}</td>
                            <td className="px-6 py-4 text-right font-mono text-slate-900">{item.todayPrice.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-slate-500 text-xs">{item.unit}</td>
                            <td className={`px-6 py-4 text-right font-semibold ${item.percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {item.percentChange > 0 ? '+' : ''}{item.percentChange}%
                            </td>
                            <td className="px-6 py-4 text-right text-slate-500 text-xs hidden md:table-cell">{item.contract || 'N/A'}</td>
                            <td className="px-6 py-4 text-right text-slate-400 text-xs hidden lg:table-cell">
                              {new Date(item.lastUpdated).toLocaleDateString()}
                            </td>
                          </tr>
                        ))
                      ) : (
                         <tr>
                           <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                             No data available for this selection.
                           </td>
                         </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* --- SECTION 3: MARKET OVERVIEW (EXPANDED) --- */}
              <div>
                <MarketSection title="Precious Metals" data={preciousMetals} />
                <MarketSection title="Industrial Metals" data={industrialMetals} />
                <MarketSection title="Energy" data={energyItems} />
                <MarketSection title="Lubricants" data={lubricantItems} />
                <MarketSection title="Agriculture" data={agricultureItems} />
              </div>

               {/* --- SECTION 4: COMPARE TO BENCHMARKS --- */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-800">Compare to Benchmarks</h2>
                  <div className="flex gap-1 text-xs font-semibold text-slate-500">
                    {['1D', '1W', '1M', '6M', 'YTD', '1Y', '5Y'].map(r => (
                      <button 
                        key={r} 
                        onClick={() => setComparisonRange(r)}
                        className={`px-2 py-1 rounded hover:bg-slate-100 ${comparisonRange === r ? 'bg-slate-100 text-slate-900' : ''}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="h-[300px] w-full">
                   <ResponsiveContainer width="100%" height="100%">
                     <LineChart>
                       <Tooltip 
                         contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                         labelStyle={{fontSize: '12px', color: '#64748b'}}
                       />
                       <XAxis dataKey="date" hide />
                       <YAxis domain={['auto', 'auto']} hide />
                       {MOCK_BENCHMARKS.map((bench, idx) => (
                         <Line 
                           key={bench.name}
                           type="monotone" 
                           data={bench.data} 
                           dataKey="price" 
                           name={bench.name}
                           stroke={['#0ea5e9', '#ef4444', '#eab308', '#22c55e'][idx]} 
                           strokeWidth={2}
                           dot={false}
                         />
                       ))}
                     </LineChart>
                   </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap gap-4 mt-4 justify-center">
                   {MOCK_BENCHMARKS.map((bench, idx) => (
                      <div key={bench.name} className="flex items-center gap-1.5 text-sm">
                        <span className="w-3 h-3 rounded-full" style={{backgroundColor: ['#0ea5e9', '#ef4444', '#eab308', '#22c55e'][idx]}}></span>
                        <span className="text-slate-600 font-medium">{bench.name}</span>
                        <span className={`text-xs ${bench.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {bench.change > 0 ? '+' : ''}{bench.change}%
                        </span>
                      </div>
                   ))}
                </div>
              </div>

            </div>

            {/* --- RIGHT SIDEBAR --- */}
            <div className="space-y-8">
              
              {/* --- SECTION 5: TRENDING MARKETS --- */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-100 pb-2">Trending Commodities</h3>
                <ul className="space-y-2 mb-6">
                  {MOCK_TRENDING.commodities.map((item, i) => (
                    <li key={i} className="flex justify-between items-center text-sm group cursor-pointer hover:bg-slate-50 p-1 rounded">
                      <span className="font-medium text-slate-700 group-hover:text-accent">{item}</span>
                      <span className="text-green-600 text-xs font-semibold">+{(Math.random() * 2).toFixed(2)}%</span>
                    </li>
                  ))}
                </ul>
                
                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-100 pb-2">Trending Stocks</h3>
                <ul className="space-y-2 mb-6">
                  {MOCK_TRENDING.stocks.map((item, i) => (
                    <li key={i} className="flex justify-between items-center text-sm group cursor-pointer hover:bg-slate-50 p-1 rounded">
                       <span className="font-medium text-slate-700 group-hover:text-accent">{item}</span>
                       <span className={Math.random() > 0.5 ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>
                         {Math.random() > 0.5 ? '+' : '-'}{(Math.random() * 3).toFixed(2)}%
                       </span>
                    </li>
                  ))}
                </ul>

                <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4 border-b border-slate-100 pb-2">Crypto</h3>
                <ul className="space-y-2">
                   {MOCK_TRENDING.crypto.map((item, i) => (
                    <li key={i} className="flex justify-between items-center text-sm group cursor-pointer hover:bg-slate-50 p-1 rounded">
                       <span className="font-medium text-slate-700 group-hover:text-accent">{item}</span>
                       <span className={Math.random() > 0.4 ? 'text-green-600 text-xs' : 'text-red-600 text-xs'}>
                         {Math.random() > 0.4 ? '+' : '-'}{(Math.random() * 5).toFixed(2)}%
                       </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* --- SECTION 6: MARKET NEWS --- */}
               <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                 <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-4">Latest Market News</h3>
                 <div className="space-y-4">
                   {MOCK_NEWS.map((news, i) => (
                     <div key={i} className="group cursor-pointer">
                       <h4 className="text-sm font-semibold text-slate-800 leading-snug group-hover:text-accent transition-colors">
                         {news.title}
                       </h4>
                       <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                         <span className="font-medium text-slate-500">{news.source}</span>
                         <span>•</span>
                         <span>{news.time}</span>
                       </div>
                     </div>
                   ))}
                 </div>
                 <button className="w-full mt-4 py-2 text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded transition-colors">
                   View All News
                 </button>
               </div>

               {/* --- SECTION 8: SIDE ADS --- */}
               <div className="w-full h-[250px] bg-slate-200 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 relative overflow-hidden">
                  <span className="text-xs font-bold uppercase">Ad Space</span>
                  <span className="text-[10px]">300x250</span>
               </div>

               {/* --- SECTION 7: AI ASSISTANT PROMO --- */}
               <div className="bg-gradient-to-br from-primary to-slate-900 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-accent opacity-20 rounded-full blur-2xl -translate-y-4 translate-x-4"></div>
                  <h3 className="text-lg font-bold mb-2 relative z-10">MetalTrack AI</h3>
                  <p className="text-sm text-slate-300 mb-4 relative z-10">Get instant analysis, price forecasts, and market insights.</p>
                  <div className="relative z-10">
                     <input 
                       type="text" 
                       readOnly 
                       placeholder="Ask me anything..." 
                       className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-400 mb-2 cursor-pointer hover:bg-white/20 transition-colors"
                       onClick={() => document.querySelector<HTMLButtonElement>('.fixed.bottom-6.right-6 button')?.click()}
                     />
                     <p className="text-[10px] text-slate-400 text-center">Click to open chat widget</p>
                  </div>
               </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;