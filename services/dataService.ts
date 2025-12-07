import { Item, Category } from '../types';
import { INITIAL_ITEMS } from '../constants';

// Simple in-memory storage simulation for MVP
const STORAGE_KEY = 'metal_lubricant_data_v1';

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

export const api = {
  getAllItems: async (): Promise<Item[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredItems();
  },

  getItemBySlug: async (slug: string): Promise<Item | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const items = getStoredItems();
    return items.find(item => item.slug === slug);
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
      // For MVP simplicity we just push a new entry or update the last one
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
  }
};
