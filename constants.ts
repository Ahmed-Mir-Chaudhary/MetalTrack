
import { Item, NewsItem } from './types';

export const ADMIN_PASSWORD = "admin"; // Simple password for MVP

// Helper to generate mock history
const generateHistory = (basePrice: number, volatility: number = 0.05): { date: string; price: number }[] => {
  const history = [];
  const today = new Date();
  for (let i = 90; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const randomChange = 1 + (Math.random() * volatility * 2 - volatility);
    history.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(basePrice * randomChange * 100) / 100,
    });
  }
  return history;
};

export const INITIAL_ITEMS: Item[] = [
  // Precious Metals
  {
    id: '1',
    name: 'Gold (24K)',
    slug: 'gold-24k',
    category: 'metal',
    subcategory: 'Precious Metals',
    country: 'Global',
    todayPrice: 2045.50,
    unit: 'USD/oz',
    percentChange: 0.45,
    history: generateHistory(2045.50),
    lastUpdated: new Date().toISOString(),
    description: 'Gold is a precious metal used for coinage, jewelry, and other arts throughout recorded history.',
    symbol: 'GC1:COM',
    contract: 'Feb 2026'
  },
  {
    id: '2',
    name: 'Silver',
    slug: 'silver',
    category: 'metal',
    subcategory: 'Precious Metals',
    country: 'Global',
    todayPrice: 22.85,
    unit: 'USD/oz',
    percentChange: 1.2,
    history: generateHistory(22.85, 0.08),
    lastUpdated: new Date().toISOString(),
    description: 'Silver is a chemical element with the symbol Ag. It exhibits the highest electrical conductivity.',
    symbol: 'SI1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '3',
    name: 'Platinum',
    slug: 'platinum',
    category: 'metal',
    subcategory: 'Precious Metals',
    country: 'Global',
    todayPrice: 980.10,
    unit: 'USD/oz',
    percentChange: -0.5,
    history: generateHistory(980.10, 0.06),
    lastUpdated: new Date().toISOString(),
    symbol: 'PL1:COM',
    contract: 'Apr 2026'
  },
  {
    id: '4',
    name: 'Palladium',
    slug: 'palladium',
    category: 'metal',
    subcategory: 'Precious Metals',
    country: 'Global',
    todayPrice: 1105.40,
    unit: 'USD/oz',
    percentChange: 0.15,
    history: generateHistory(1105.40, 0.07),
    lastUpdated: new Date().toISOString(),
    symbol: 'PA1:COM',
    contract: 'Mar 2026'
  },

  // Industrial Metals
  {
    id: '5',
    name: 'Aluminium',
    slug: 'aluminium',
    category: 'metal',
    subcategory: 'Industrial Metals',
    country: 'Global',
    todayPrice: 2897.50,
    unit: 'USD/MT',
    percentChange: 0.22,
    history: generateHistory(2897.50, 0.03),
    lastUpdated: new Date().toISOString(),
    symbol: 'LMAHDS03',
    contract: 'Spot'
  },
  {
    id: '6',
    name: 'Copper',
    slug: 'copper',
    category: 'metal',
    subcategory: 'Industrial Metals',
    country: 'Global',
    todayPrice: 546.20,
    unit: 'USd/lb',
    percentChange: 1.65,
    history: generateHistory(546.20, 0.04),
    lastUpdated: new Date().toISOString(),
    symbol: 'HG1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '7',
    name: 'Zinc',
    slug: 'zinc',
    category: 'metal',
    subcategory: 'Industrial Metals',
    country: 'Global',
    todayPrice: 3098.00,
    unit: 'USD/MT',
    percentChange: 0.24,
    history: generateHistory(3098.00, 0.04),
    lastUpdated: new Date().toISOString(),
    symbol: 'LMZSDS03',
    contract: 'Spot'
  },
  {
    id: '8',
    name: 'Nickel',
    slug: 'nickel',
    category: 'metal',
    subcategory: 'Industrial Metals',
    country: 'Global',
    todayPrice: 16500.00,
    unit: 'USD/MT',
    percentChange: -1.1,
    history: generateHistory(16500.00, 0.05),
    lastUpdated: new Date().toISOString(),
    symbol: 'LMNIDS03',
    contract: 'Spot'
  },
  {
    id: '9',
    name: 'Tin',
    slug: 'tin',
    category: 'metal',
    subcategory: 'Industrial Metals',
    country: 'Global',
    todayPrice: 40068.00,
    unit: 'USD/MT',
    percentChange: 0.77,
    history: generateHistory(40068.00, 0.05),
    lastUpdated: new Date().toISOString(),
    symbol: 'LMSNDS03',
    contract: 'Spot'
  },

  // Energy
  {
    id: '10',
    name: 'Crude Oil (WTI)',
    slug: 'crude-oil-wti',
    category: 'energy',
    subcategory: 'Crude Oil & Natural Gas',
    country: 'Global',
    todayPrice: 60.08,
    unit: 'USD/bbl',
    percentChange: 0.69,
    history: generateHistory(60.08, 0.08),
    lastUpdated: new Date().toISOString(),
    symbol: 'CL1:COM',
    contract: 'Jan 2026'
  },
  {
    id: '11',
    name: 'Brent Oil',
    slug: 'brent-oil',
    category: 'energy',
    subcategory: 'Crude Oil & Natural Gas',
    country: 'Global',
    todayPrice: 65.50,
    unit: 'USD/bbl',
    percentChange: 0.55,
    history: generateHistory(65.50, 0.08),
    lastUpdated: new Date().toISOString(),
    symbol: 'CO1:COM',
    contract: 'Apr 2026'
  },
  {
    id: '12',
    name: 'Natural Gas',
    slug: 'natural-gas',
    category: 'energy',
    subcategory: 'Crude Oil & Natural Gas',
    country: 'USA',
    todayPrice: 2.50,
    unit: 'USD/MMBtu',
    percentChange: -1.2,
    history: generateHistory(2.50, 0.15),
    lastUpdated: new Date().toISOString(),
    symbol: 'NG1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '13',
    name: 'Diesel',
    slug: 'diesel',
    category: 'energy',
    subcategory: 'Refined Products',
    country: 'Global',
    todayPrice: 2.85,
    unit: 'USD/Gal',
    percentChange: 0.05,
    history: generateHistory(2.85, 0.02),
    lastUpdated: new Date().toISOString(),
    symbol: 'HO1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '25',
    name: 'Heating Oil',
    slug: 'heating-oil',
    category: 'energy',
    subcategory: 'Refined Products',
    country: 'USA',
    todayPrice: 2.80,
    unit: 'USD/Gal',
    percentChange: 0.35,
    history: generateHistory(2.80, 0.03),
    lastUpdated: new Date().toISOString(),
    symbol: 'HO1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '26',
    name: 'Gasoline (RBOB)',
    slug: 'gasoline',
    category: 'energy',
    subcategory: 'Refined Products',
    country: 'USA',
    todayPrice: 2.10,
    unit: 'USD/Gal',
    percentChange: 0.85,
    history: generateHistory(2.10, 0.04),
    lastUpdated: new Date().toISOString(),
    symbol: 'XB1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '27',
    name: 'Carbon Emissions',
    slug: 'carbon-emissions',
    category: 'energy',
    subcategory: 'Emissions',
    country: 'EU',
    todayPrice: 65.00,
    unit: 'EUR/MT',
    percentChange: -0.45,
    history: generateHistory(65.00, 0.10),
    lastUpdated: new Date().toISOString(),
    symbol: 'MO1:COM',
    contract: 'Dec 2026'
  },

  // Lubricants
  {
    id: '14',
    name: 'Synthetic Oil 5W-30',
    slug: 'synthetic-oil-5w30',
    category: 'lubricant',
    country: 'USA',
    todayPrice: 35.50,
    unit: 'USD/Gal',
    percentChange: 0.1,
    history: generateHistory(35.50, 0.01),
    lastUpdated: new Date().toISOString(),
    description: 'Full synthetic motor oil designed to keep your engine running like new.',
    symbol: 'SYN-5W30',
    contract: 'Retail'
  },
  {
    id: '15',
    name: 'Industrial Grease EP-2',
    slug: 'grease-ep2',
    category: 'lubricant',
    country: 'Germany',
    todayPrice: 12.75,
    unit: 'EUR/kg',
    percentChange: -0.5,
    history: generateHistory(12.75, 0.02),
    lastUpdated: new Date().toISOString(),
    symbol: 'GRE-EP2',
    contract: 'Wholesale'
  },
  {
    id: '16',
    name: 'Hydraulic Oil AW-68',
    slug: 'hydraulic-oil-aw68',
    category: 'lubricant',
    country: 'Global',
    todayPrice: 18.20,
    unit: 'USD/Gal',
    percentChange: 0.0,
    history: generateHistory(18.20, 0.01),
    lastUpdated: new Date().toISOString(),
    symbol: 'HYD-AW68',
    contract: 'Wholesale'
  },

  // Agriculture - Grains
  {
    id: '17',
    name: 'Wheat (CBOT)',
    slug: 'wheat',
    category: 'agriculture',
    subcategory: 'Grains',
    country: 'Global',
    todayPrice: 535.75,
    unit: 'USd/bu',
    percentChange: 0.83,
    history: generateHistory(535.75, 0.04),
    lastUpdated: new Date().toISOString(),
    symbol: 'W1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '18',
    name: 'Corn (CBOT)',
    slug: 'corn',
    category: 'agriculture',
    subcategory: 'Grains',
    country: 'Global',
    todayPrice: 444.75,
    unit: 'USd/bu',
    percentChange: 0.56,
    history: generateHistory(444.75, 0.04),
    lastUpdated: new Date().toISOString(),
    symbol: 'C1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '20',
    name: 'Soybean (CBOT)',
    slug: 'soybean',
    category: 'agriculture',
    subcategory: 'Grains',
    country: 'Global',
    todayPrice: 1185.00,
    unit: 'USd/bu',
    percentChange: 0.25,
    history: generateHistory(1185.00, 0.05),
    lastUpdated: new Date().toISOString(),
    symbol: 'S1:COM',
    contract: 'Mar 2026'
  },

  // Agriculture - Softs
  {
    id: '19',
    name: 'Cotton',
    slug: 'cotton',
    category: 'agriculture',
    subcategory: 'Softs',
    country: 'Global',
    todayPrice: 92.50,
    unit: 'USd/lb',
    percentChange: 0.45,
    history: generateHistory(92.50, 0.03),
    lastUpdated: new Date().toISOString(),
    symbol: 'CT1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '21',
    name: 'Cocoa (ICE)',
    slug: 'cocoa',
    category: 'agriculture',
    subcategory: 'Softs',
    country: 'Global',
    todayPrice: 4200.00,
    unit: 'USD/MT',
    percentChange: 1.55,
    history: generateHistory(4200.00, 0.15),
    lastUpdated: new Date().toISOString(),
    symbol: 'CC1:COM',
    contract: 'Mar 2026'
  },
  {
    id: '22',
    name: 'Coffee (Arabica)',
    slug: 'coffee',
    category: 'agriculture',
    subcategory: 'Softs',
    country: 'Global',
    todayPrice: 185.50,
    unit: 'USd/lb',
    percentChange: -0.75,
    history: generateHistory(185.50, 0.08),
    lastUpdated: new Date().toISOString(),
    symbol: 'KC1:COM',
    contract: 'May 2026'
  },
  {
    id: '28',
    name: 'Sugar (No. 11)',
    slug: 'sugar',
    category: 'agriculture',
    subcategory: 'Softs',
    country: 'Global',
    todayPrice: 22.45,
    unit: 'USd/lb',
    percentChange: 0.12,
    history: generateHistory(22.45, 0.06),
    lastUpdated: new Date().toISOString(),
    symbol: 'SB1:COM',
    contract: 'Mar 2026'
  },

  // Agriculture - Livestock
  {
    id: '23',
    name: 'Live Cattle',
    slug: 'live-cattle',
    category: 'agriculture',
    subcategory: 'Livestock',
    country: 'USA',
    todayPrice: 175.25,
    unit: 'USd/lb',
    percentChange: 0.35,
    history: generateHistory(175.25, 0.03),
    lastUpdated: new Date().toISOString(),
    symbol: 'LC1:COM',
    contract: 'Apr 2026'
  },
  {
    id: '24',
    name: 'Lean Hogs',
    slug: 'lean-hogs',
    category: 'agriculture',
    subcategory: 'Livestock',
    country: 'USA',
    todayPrice: 85.50,
    unit: 'USd/lb',
    percentChange: -0.25,
    history: generateHistory(85.50, 0.04),
    lastUpdated: new Date().toISOString(),
    symbol: 'LH1:COM',
    contract: 'Apr 2026'
  }
];

export const MOCK_NEWS: NewsItem[] = [
  { 
    id: '101',
    title: "Gold rises as dollar weakens ahead of Fed meeting", 
    source: "Bloomberg", 
    time: "2h ago",
    description: "Gold prices saw a significant uptick in early Asian trading as the dollar index softened.",
    imageUrl: "https://images.unsplash.com/photo-1610375460969-d9586c72f081?auto=format&fit=crop&q=80&w=400",
    author: "Sarah Jenkins",
    publishedAt: "2024-02-12T08:00:00Z",
    content: "Gold prices surged on Monday as the dollar weakened, with investors awaiting key inflation data that could influence the Federal Reserve's interest rate path. Spot gold rose 0.5% to $2,045.50 per ounce..."
  },
  { 
    id: '102',
    title: "Crude oil drops amid supply concerns in Middle East", 
    source: "Reuters", 
    time: "4h ago",
    description: "Oil futures dipped as geopolitical tensions seemed to ease slightly, shifting focus back to demand.",
    imageUrl: "https://images.unsplash.com/photo-1596707333555-e41da928b122?auto=format&fit=crop&q=80&w=400",
    author: "Michael Chen",
    publishedAt: "2024-02-12T06:00:00Z",
    content: "Global oil benchmarks fell on Tuesday as easing geopolitical concerns in the Middle East led traders to take profits from last week's rally. Brent crude futures were down 60 cents..."
  },
  { 
    id: '103',
    title: "Copper hits 4-week high due to China demand resurgence", 
    source: "CNBC", 
    time: "5h ago",
    description: "Industrial metal prices are rallying on hopes of stimulus measures from the world's largest consumer.",
    imageUrl: "https://images.unsplash.com/photo-1629196914375-f7e48f477b6d?auto=format&fit=crop&q=80&w=400",
    author: "Elena Rossi",
    publishedAt: "2024-02-12T05:00:00Z",
    content: "Copper prices advanced to their highest in four weeks as inventories in Shanghai Exchange warehouses dropped and data showed resilient manufacturing activity in China..."
  },
  { 
    id: '104',
    title: "Agricultural commodities see volatility as harvest season begins", 
    source: "AgriNews", 
    time: "8h ago",
    description: "Unpredictable weather patterns in South America are causing jitters in soybean and corn markets.",
    imageUrl: "https://images.unsplash.com/photo-1499529112042-b365039428cf?auto=format&fit=crop&q=80&w=400",
    author: "David Miller",
    publishedAt: "2024-02-12T02:00:00Z",
    content: "Soybean and corn futures traded with high volatility on Monday. The market is reacting to mixed weather forecasts in Brazil, where heavy rains are delaying the harvest in some key regions..."
  },
];

export const MOCK_TRENDING = {
  commodities: ["Gold", "Silver", "Copper", "Aluminium", "Crude Oil"],
  stocks: ["TSLA", "AAPL", "MSFT", "NVDA", "AMZN"],
  crypto: ["BTC", "ETH", "BNB", "SOL", "XRP"]
};

export const MOCK_BENCHMARKS = [
  { name: 'S&P 500', value: 5000, change: 0.5, data: generateHistory(5000) },
  { name: 'NASDAQ', value: 16000, change: 0.8, data: generateHistory(16000, 0.08) },
  { name: 'Gold Spot', value: 2045, change: 0.45, data: generateHistory(2045) },
  { name: 'Crude Oil', value: 76, change: -0.15, data: generateHistory(76, 0.08) },
];
