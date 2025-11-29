import React from 'react';
import { Banana, ScanSearch } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-3 px-6 flex items-center justify-between z-50">
      <div className="flex items-center gap-3">
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md border border-white/30 shadow-lg">
          <Banana size={24} className="text-yellow-300" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight drop-shadow-sm">
            FNB<span className="font-light text-white/90">AI</span>
          </h1>
          <p className="text-[10px] text-white/70 font-medium tracking-widest uppercase">
            Next-Gen Fraud Detection
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm text-white/80 text-xs font-medium">
          <ScanSearch size={14} />
          <span>v1.1.0-beta</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 border-2 border-white/30 shadow-lg"></div>
      </div>
    </header>
  );
};
