
import { Item, Category, NewsItem, Benchmark, PriceAlert } from '../types';
import { INITIAL_ITEMS, MOCK_NEWS, MOCK_BENCHMARKS } from '../constants';

// Simple in-memory storage simulation for MVP
const STORAGE_KEY = 'metal_lubricant_data_v1';
const ALERTS_KEY = 'price_alerts_v1';
const SUBSCRIBERS_KEY = 'subscribers_v1';

const getStoredItems = (): Item[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ITEMS));
    return INITIAL_ITEMS;
  }
  return JSON.parse(stored);
};

const setStoredItems = (items: Item[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const getStoredAlerts = (): PriceAlert[] => {
  const stored = localStorage.getItem(ALERTS_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
};

const setStoredAlerts = (alerts: PriceAlert[]) => {
  localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts));
};

export const api = {
  getAllItems: async (): Promise<Item[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredItems();
  },

  getDashboardData: async (): Promise<{ items: Item[]; news: NewsItem[]; benchmarks: Benchmark[] }> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const items = getStoredItems();
    return {
      items,
      news: MOCK_NEWS,
      benchmarks: MOCK_BENCHMARKS
    };
  },

  getItemBySlug: async (slug: string): Promise<Item | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const items = getStoredItems();
    return items.find(item => item.slug === slug);
  },

  getNewsById: async (id: string): Promise<NewsItem | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_NEWS.find(n => n.id === id);
  },

  updatePrice: async (id: string, newPrice: number): Promise<Item | null> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const items = getStoredItems();
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;

    const oldPrice = items[index].todayPrice;
    const percentChange = ((newPrice - oldPrice) / oldPrice) * 100;

    items[index] = {
      ...items[index],
      todayPrice: newPrice,
      percentChange: parseFloat(percentChange.toFixed(2)),
      lastUpdated: new Date().toISOString(),
      // Add today's price to history if it's a new day, or update last entry
      history: [
        ...items[index].history,
        { date: new Date().toISOString().split('T')[0], price: newPrice }
      ]
    };
    setStoredItems(items);
    return items[index];
  },

  addItem: async (newItem: Omit<Item, 'id' | 'history' | 'lastUpdated' | 'percentChange'>): Promise<Item> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    const items = getStoredItems();
    
    const item: Item = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      percentChange: 0,
      history: [{ date: new Date().toISOString().split('T')[0], price: newItem.todayPrice }],
      lastUpdated: new Date().toISOString()
    };
    
    items.push(item);
    setStoredItems(items);
    return item;
  },

  deleteItem: async (id: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    const items = getStoredItems();
    const filtered = items.filter(item => item.id !== id);
    setStoredItems(filtered);
  },

  // --- ALERT & NEWSLETTER SYSTEM ---

  subscribeNewsletter: async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate request
    const subscribers = JSON.parse(localStorage.getItem(SUBSCRIBERS_KEY) || '[]');
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem(SUBSCRIBERS_KEY, JSON.stringify(subscribers));
    }
    console.log(`[NEWSLETTER] Subscribed: ${email}`);
  },

  createAlert: async (email: string, slug: string, targetPrice: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate POST request
    const items = getStoredItems();
    const item = items.find(i => i.slug === slug);
    if (!item) throw new Error("Item not found");

    const alerts = getStoredAlerts();
    const newAlert: PriceAlert = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      commoditySlug: slug,
      commodityName: item.name,
      targetPrice,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    alerts.push(newAlert);
    setStoredAlerts(alerts);
    console.log("Alert Created:", newAlert);
  },

  // Background worker simulation
  checkAlerts: async (): Promise<void> => {
    const alerts = getStoredAlerts();
    const items = getStoredItems();
    let hasUpdates = false;

    const activeAlerts = alerts.filter(a => a.status === 'active');
    
    for (const alert of activeAlerts) {
      const item = items.find(i => i.slug === alert.commoditySlug);
      if (item) {
        // Simple logic: if price is >= target, trigger alert
        if (item.todayPrice >= alert.targetPrice) {
          alert.status = 'triggered';
          hasUpdates = true;
          // Simulate sending email
          console.log(`[EMAIL SENT] To: ${alert.email} | Subject: ${alert.commodityName} Price Alert | Body: ${alert.commodityName} has reached your target of ${alert.targetPrice}. Current: ${item.todayPrice}`);
          // Visual feedback for demo purposes
          if (typeof window !== 'undefined') {
             console.info(`🔔 Alert Triggered! ${alert.commodityName} hit ${alert.targetPrice}`);
          }
        }
      }
    }

    if (hasUpdates) {
      setStoredAlerts(alerts);
    }
  }
};
