import React from 'react';
import { Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 border-b border-slate-200 bg-white sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-blue-500 to-violet-500 p-2 rounded-lg text-white">
            <Sparkles size={20} />
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
            AI Detector
          </h1>
        </div>
        <div className="text-sm font-medium text-slate-500">
          Powered by Gemini
        </div>
      </div>
    </header>
  );
};
