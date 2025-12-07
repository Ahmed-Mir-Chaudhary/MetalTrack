import React from 'react';
import { Item } from '../types';
import { Link } from 'react-router-dom';

interface PriceCardProps {
  item: Item;
}

const PriceCard: React.FC<PriceCardProps> = ({ item }) => {
  const isPositive = item.percentChange >= 0;

  let badgeColor = 'bg-slate-100 text-slate-700';
  switch (item.category) {
    case 'metal': badgeColor = 'bg-orange-100 text-orange-700'; break;
    case 'lubricant': badgeColor = 'bg-blue-100 text-blue-700'; break;
    case 'energy': badgeColor = 'bg-red-100 text-red-700'; break;
    case 'agriculture': badgeColor = 'bg-green-100 text-green-700'; break;
    case 'commodity': badgeColor = 'bg-yellow-100 text-yellow-700'; break;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-200 p-5 flex flex-col h-full animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-2 ${badgeColor}`}>
            {item.category}
          </span>
          <h3 className="text-lg font-bold text-slate-800 leading-tight">{item.name}</h3>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-slate-300"></span>
            {item.country}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">
            {item.todayPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs font-medium text-slate-400">{item.unit}</span>
        </div>

        <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
          )}
          <span>{Math.abs(item.percentChange)}%</span>
          <span className="text-slate-400 text-xs font-normal ml-1">vs yesterday</span>
        </div>

        <Link 
          to={`/product/${item.slug}`}
          className="mt-4 block w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-center rounded-lg text-sm font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default PriceCard;