import React from 'react';
import { CustomerHeader } from './CustomerHeader';
import { ChatSection } from './ChatSection';

export const CustomerSimulation: React.FC = () => {
  return (
    <div className="h-screen w-full bg-[#f7f7f7] flex flex-col overflow-hidden font-sans text-slate-800">
      <CustomerHeader />

      <main className="flex-1 flex gap-4 px-6 pb-6 pt-6 min-h-0 justify-center">
        <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 overflow-hidden flex flex-col h-full shadow-xl">
          <div className="p-4 border-b border-slate-100 bg-white">
            <h2 className="text-lg font-bold text-[#d70f64]">Customer Support</h2>
            <p className="text-sm text-slate-500">Chat with support and upload images directly in the chat.</p>
          </div>
          <ChatSection currentUser="customer" />
        </div>
      </main>
    </div>
  );
};

export default CustomerSimulation;
