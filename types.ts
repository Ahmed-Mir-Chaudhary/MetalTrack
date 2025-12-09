
export type Category = 'metal' | 'lubricant' | 'energy' | 'agriculture' | 'commodity' | 'index' | 'crypto' | 'forex';

export interface PriceHistory {
  date: string;
  price: number;
}

export interface Item {
  id: string;
  name: string;
  slug: string;
  category: Category;
  subcategory?: string;
  country: string;
  todayPrice: number;
  unit: string;
  percentChange: number;
  history: PriceHistory[];
  lastUpdated: string;
  description?: string;
  symbol?: string;
  contract?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  imageUrl?: string;
  description: string;
  content: string;
  author: string;
  publishedAt: string;
}

export interface Benchmark {
  name: string;
  value: number;
  change: number;
  data: PriceHistory[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface PriceAlert {
  id: string;
  email: string;
  commoditySlug: string;
  commodityName: string;
  targetPrice: number;
  status: 'active' | 'triggered';
  createdAt: string;
}
