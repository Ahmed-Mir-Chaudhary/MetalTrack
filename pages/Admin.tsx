import React, { useEffect, useState } from 'react';
import { api } from '../services/dataService';
import { Item, Category } from '../types';
import { ADMIN_PASSWORD } from '../constants';

const Admin: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    slug: '',
    category: 'metal' as Category,
    country: '',
    todayPrice: 0,
    unit: '',
    description: ''
  });

  const checkAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchItems();
    } else {
      alert("Invalid password (hint: admin)");
    }
  };

  const fetchItems = async () => {
    setLoading(true);
    const data = await api.getAllItems();
    setItems(data);
    setLoading(false);
  };

  const handlePriceUpdate = async (id: string, newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;
    
    setLoading(true);
    await api.updatePrice(id, price);
    await fetchItems();
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if(!window.confirm("Are you sure?")) return;
    setLoading(true);
    await api.deleteItem(id);
    await fetchItems();
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name || !newItem.slug) return;
    setLoading(true);
    await api.addItem(newItem);
    setNewItem({
        name: '',
        slug: '',
        category: 'metal',
        country: '',
        todayPrice: 0,
        unit: '',
        description: ''
    });
    await fetchItems();
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form onSubmit={checkAuth} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-primary outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full bg-primary text-white p-3 rounded-lg font-bold hover:bg-slate-800 transition">
            Login
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <button onClick={() => setIsAuthenticated(false)} className="text-red-500 hover:text-red-700">Logout</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Item Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border h-fit">
          <h2 className="text-xl font-bold mb-4">Add New Item</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Name</label>
              <input type="text" required className="w-full border p-2 rounded text-sm" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Slug (unique)</label>
                    <input type="text" required className="w-full border p-2 rounded text-sm" value={newItem.slug} onChange={e => setNewItem({...newItem, slug: e.target.value})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Category</label>
                    <select className="w-full border p-2 rounded text-sm" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as Category})}>
                        <option value="metal">Metal</option>
                        <option value="lubricant">Lubricant</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Price</label>
                    <input type="number" step="0.01" required className="w-full border p-2 rounded text-sm" value={newItem.todayPrice} onChange={e => setNewItem({...newItem, todayPrice: parseFloat(e.target.value)})} />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Unit</label>
                    <input type="text" required className="w-full border p-2 rounded text-sm" value={newItem.unit} onChange={e => setNewItem({...newItem, unit: e.target.value})} />
                </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Country</label>
              <input type="text" required className="w-full border p-2 rounded text-sm" value={newItem.country} onChange={e => setNewItem({...newItem, country: e.target.value})} />
            </div>
             <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
              <textarea className="w-full border p-2 rounded text-sm" rows={2} value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium transition">
               {loading ? 'Adding...' : 'Add Item'}
            </button>
          </form>
        </div>

        {/* Item List */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border overflow-hidden">
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold">Manage Items</h2>
             <button className="text-sm bg-gray-100 px-3 py-1 rounded hover:bg-gray-200" onClick={() => alert("CSV Upload not implemented in demo")}>Upload CSV</button>
           </div>
           
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                   <th className="p-3">Name</th>
                   <th className="p-3">Price</th>
                   <th className="p-3">Update Price</th>
                   <th className="p-3 text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="text-sm divide-y">
                 {items.map(item => (
                   <tr key={item.id}>
                     <td className="p-3 font-medium">
                       {item.name} <br/> 
                       <span className="text-gray-400 text-xs font-normal">{item.country}</span>
                     </td>
                     <td className="p-3">{item.todayPrice.toLocaleString()}</td>
                     <td className="p-3">
                       <input 
                         type="number" 
                         step="0.01"
                         placeholder="New Price"
                         className="border w-24 p-1 rounded text-xs mr-2"
                         onKeyDown={(e) => {
                             if(e.key === 'Enter') {
                                 handlePriceUpdate(item.id, (e.target as HTMLInputElement).value);
                                 (e.target as HTMLInputElement).value = '';
                             }
                         }}
                       />
                     </td>
                     <td className="p-3 text-right">
                       <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;