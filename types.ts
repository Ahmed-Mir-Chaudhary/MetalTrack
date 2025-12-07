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

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}