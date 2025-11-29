import React, { useState } from 'react';
import { Send, User, Bot, MoreHorizontal } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export const ChatSection: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I've uploaded the image for verification.", sender: 'bot', timestamp: new Date() },
    { id: 2, text: "Can you check if this is AI generated?", sender: 'bot', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Mock bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: "I'm analyzing the file now. Please wait a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-transparent">
        <div>
          <h3 className="text-lg font-bold text-white">Customer Support</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            <p className="text-xs text-white/70 font-medium">Active Now</p>
          </div>
        </div>
        <button className="p-2 hover:bg-white/10 rounded-full text-white/50 transition-colors">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-transparent">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${(
              msg.sender === 'user' ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white' : 'bg-white/10 text-white border border-white/10'
            )}`}>
              {msg.sender === 'user' ? <User size={15} /> : <Bot size={15} />}
            </div>
            <div className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${(
              msg.sender === 'user' 
                ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-tr-none' 
                : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
            )}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-transparent border-t border-white/10">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full pl-5 pr-12 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="absolute right-1.5 top-1.5 p-2 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white rounded-full hover:from-indigo-500 hover:to-indigo-400 disabled:opacity-50 disabled:hover:from-indigo-600 disabled:hover:to-indigo-500 transition-all shadow-md hover:shadow-lg"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};
