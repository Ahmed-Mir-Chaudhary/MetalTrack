import React from 'react';

const TICKER_ITEMS = [
  { pair: "Gold / USD", price: "$2,045.50", change: "-5.65", pchg: "-0.28%" },
  { pair: "Gold / GBP", price: "£1,615.80", change: "-1.81", pchg: "-0.11%" },
  { pair: "Gold / EUR", price: "€1,885.20", change: "+9.87", pchg: "+0.52%" },
  { pair: "Silver / USD", price: "$22.85", change: "+0.25", pchg: "+1.10%" },
  { pair: "Crude Oil WTI", price: "$76.50", change: "-0.45", pchg: "-0.58%" },
  { pair: "Natural Gas", price: "$2.50", change: "-0.03", pchg: "-1.20%" },
  { pair: "Bitcoin / USD", price: "$52,150.00", change: "+1200.00", pchg: "+2.35%" },
];

const Ticker: React.FC = () => {
  return (
    <div className="w-full bg-slate-900 text-white overflow-hidden py-2 border-b border-slate-800 sticky top-16 z-30">
      <div className="flex animate-marquee whitespace-nowrap hover:[animation-play-state:paused]">
        {/* Quadruple the items to ensure smooth infinite scroll on wide screens */}
        {[...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS].map((item, index) => (
          <div key={index} className="flex items-center mx-6 text-xs font-mono">
            <span className="font-bold text-slate-400 mr-2">{item.pair}</span>
            <span className="mr-2">{item.price}</span>
            <span className={item.pchg.startsWith('+') ? 'text-green-400' : 'text-red-400'}>
              {item.change} ({item.pchg})
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-25%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Ticker;