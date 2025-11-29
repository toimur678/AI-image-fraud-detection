import React from 'react';
import { ShoppingBag } from 'lucide-react';

export const CustomerHeader: React.FC = () => {
  return (
    <header className="w-full py-3 px-6 flex items-center justify-between z-50 bg-[#d70f64] shadow-md">
      <div className="flex items-center gap-3">
        <div className="bg-white p-2 rounded-full shadow-sm">
          <ShoppingBag size={24} className="text-[#d70f64]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            foodieMart
          </h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-white/20 border-2 border-white/30 shadow-lg flex items-center justify-center text-white font-bold text-xs">
          U
        </div>
      </div>
    </header>
  );
};
