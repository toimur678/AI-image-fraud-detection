import React, { useEffect, useState, useRef } from 'react';
import { Send, User, Bot, MoreHorizontal, Paperclip, Plus, X, Trash2, ShoppingBag, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { messageBus } from '../services/messageBus';
import { Language, translations } from '../translations';
import { AnalysisResult, ExifAnalysis, DetectionVerdict } from '../types';

interface IncomingMessage {
  id: number;
  text: string;
  sender: 'customer' | 'agent';
  timestamp: string | Date;
  image?: {
    base64: string;
    fileName: string;
    mimeType: string;
  };
}

interface Message {
  id: number;
  text: string;
  sender: 'customer' | 'agent';
  timestamp: Date;
  image?: {
    base64: string;
    fileName: string;
    mimeType: string;
  };
}

interface ChatSectionProps {
  currentUser: 'customer' | 'agent';
  onScanImage?: (file: File, base64: string, mimeType: string) => void;
  language: Language;
  result?: AnalysisResult | null;
  exifInfo?: ExifAnalysis | null;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ currentUser, onScanImage, language, result, exifInfo }) => {
  const t = translations[language].chatSection;
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const raw = localStorage.getItem('support_messages');
      if (raw) {
        const parsed = JSON.parse(raw);
        // Fix legacy messages
        return parsed.map((m: any) => ({
          ...m,
          sender: m.sender === 'user' ? 'customer' : (m.sender === 'bot' ? 'agent' : m.sender)
        }));
      }
    } catch (e) {}
    return [];
  });
  
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ file: File, base64: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 10 * 1024 * 1024) {
        alert("File is too large. Please upload an image under 10MB.");
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setSelectedImage({
            file,
            base64: ev.target.result as string
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const newMessage: Message = {
      id: Date.now(),
      text: input,
      sender: currentUser,
      timestamp: new Date(),
      image: selectedImage ? {
        base64: selectedImage.base64,
        fileName: selectedImage.file.name,
        mimeType: selectedImage.file.type
      } : undefined
    };

    setMessages(prev => {
      const next = [...prev, newMessage];
      try { localStorage.setItem('support_messages', JSON.stringify(next)); } catch(e){}
      return next;
    });
    
    setInput('');
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';

    // Broadcast to other windows
    messageBus.post({ type: 'chat-message', payload: newMessage });
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      localStorage.removeItem('support_messages');
      messageBus.post({ type: 'clear-chat' });
    }
  };

  useEffect(() => {
    const unsubscribe = messageBus.subscribe((msg) => {
      if (msg.type === 'chat-message') {
        const incoming: IncomingMessage = msg.payload;
        const shaped: Message = {
          id: incoming.id || Date.now(),
          text: incoming.text,
          sender: incoming.sender,
          timestamp: new Date(incoming.timestamp),
          image: incoming.image
        };
        setMessages(prev => {
          if (prev.some(m => m.id === shaped.id)) return prev;
          const next = [...prev, shaped];
          try { localStorage.setItem('support_messages', JSON.stringify(next)); } catch(e){}
          return next;
        });
      } else if (msg.type === 'clear-chat') {
        setMessages([]);
        localStorage.removeItem('support_messages');
      }
    });

    return () => { if (unsubscribe) unsubscribe(); };
  }, []);

  const handleScanClick = async (imgData: { base64: string, fileName: string, mimeType: string }) => {
    if (onScanImage) {
      // Convert base64 back to file for the handler
      const res = await fetch(imgData.base64);
      const blob = await res.blob();
      const file = new File([blob], imgData.fileName, { type: imgData.mimeType });
      onScanImage(file, imgData.base64, imgData.mimeType);
    }
  };

  // Determine styles based on user type (agent vs customer)
  // Agent view: Dark theme (default in App.tsx)
  // Customer view: Light theme (in CustomerSimulation.tsx)
  // We can infer theme from currentUser or pass a prop, but let's use currentUser for now.
  // Actually, the parent container sets the theme (dark/light). We just need to make sure text colors are readable.
  // Since ChatSection is reused, we should use neutral or variable-based colors, or check context.
  // However, the request asked for specific logos.

  // Determine popup state
  let popupAction: 'report' | 'refund' | null = null;
  if (currentUser === 'agent' && (result || exifInfo)) {
    const isAiGenerated = result?.verdict === DetectionVerdict.YES;
    const isEdited = exifInfo && !exifInfo.isOriginal;
    
    if (isAiGenerated || isEdited) {
      popupAction = 'report';
    } else {
      popupAction = 'refund';
    }
  }

  return (
    <div className="flex flex-col h-full font-sans relative">
      {/* Header */}
      <div className={`p-4 border-b flex justify-between items-center ${currentUser === 'agent' ? 'border-white/10 bg-transparent' : 'border-slate-100 bg-white'}`}>
        <div>
          <h3 className={`text-lg font-bold ${currentUser === 'agent' ? 'text-white' : 'text-slate-800'}`}>
            {currentUser === 'agent' ? t.customerChat : t.supportAgent}
          </h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 bg-green-400 rounded-full shadow-[0_0_8px_rgba(74,222,128,0.5)]"></span>
            <p className={`text-xs font-medium ${currentUser === 'agent' ? 'text-white/70' : 'text-slate-500'}`}>{t.activeNow}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleClearChat}
            className={`p-2 rounded-full transition-colors ${currentUser === 'agent' ? 'hover:bg-white/10 text-white/50' : 'hover:bg-slate-100 text-slate-400'}`}
            title={t.clearChat}
          >
            <Trash2 size={18} />
          </button>
          <button className={`p-2 rounded-full transition-colors ${currentUser === 'agent' ? 'hover:bg-white/10 text-white/50' : 'hover:bg-slate-100 text-slate-400'}`}>
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${currentUser === 'agent' ? 'bg-transparent' : 'bg-slate-50'}`}>
        {messages.map((msg) => {
          const isMe = msg.sender === currentUser;
          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${(
                isMe 
                  ? (currentUser === 'agent' ? 'bg-indigo-600 text-white' : 'bg-[#d70f64] text-white')
                  : (currentUser === 'agent' ? 'bg-white/10 text-white border border-white/10' : 'bg-white text-slate-600 border border-slate-200')
              )}`}>
                {msg.sender === 'customer' ? <ShoppingBag size={16} /> : <ShieldCheck size={16} />}
              </div>
              
              <div className={`flex flex-col gap-2 max-w-[75%] ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm break-words ${(
                  isMe 
                    ? (currentUser === 'agent' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-[#d70f64] text-white rounded-tr-none')
                    : (currentUser === 'agent' ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none')
                )}`}>
                  {msg.image && (
                    <div className="mb-2 relative group">
                      <img 
                        src={msg.image.base64} 
                        alt="attachment" 
                        className="max-w-full rounded-lg max-h-48 object-cover"
                      />
                      {/* Show scan button only for agent when viewing customer image */}
                      {currentUser === 'agent' && msg.sender === 'customer' && onScanImage && (
                        <button 
                          onClick={() => msg.image && handleScanClick(msg.image)}
                          className="absolute top-2 right-2 p-1.5 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-500 transition-all opacity-0 group-hover:opacity-100"
                          title="Scan this image"
                        >
                          <Plus size={16} />
                        </button>
                      )}
                    </div>
                  )}
                  {msg.text && <p>{msg.text}</p>}
                </div>
                <span className={`text-[10px] px-1 ${currentUser === 'agent' ? 'text-white/40' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={`p-4 border-t ${currentUser === 'agent' ? 'bg-transparent border-white/10' : 'bg-white border-slate-100'} relative`}>
        
        {/* Action Popup */}
        {popupAction && (
          <div className={`absolute bottom-full left-4 right-4 mb-2 p-3 rounded-xl shadow-lg backdrop-blur-md border flex items-center justify-between animate-fade-in-up z-10 ${
            popupAction === 'report' 
              ? 'bg-red-500/20 border-red-500/50 text-red-200' 
              : 'bg-green-500/20 border-green-500/50 text-green-200'
          }`}>
            <div className="flex items-center gap-2">
              {popupAction === 'report' ? <AlertTriangle size={18} /> : <CheckCircle size={18} />}
              <span className="font-bold text-sm">
                {popupAction === 'report' ? 'Report Customer' : 'Refund Customer'}
              </span>
            </div>
            <button 
              onClick={() => setInput(popupAction === 'report' ? "We have detected irregularities in the provided evidence. We cannot process this request." : "We have verified your evidence. Processing your refund now.")}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${
                popupAction === 'report' 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              Apply
            </button>
          </div>
        )}

        {selectedImage && (
          <div className={`mb-2 flex items-center gap-2 p-2 rounded-lg w-fit ${currentUser === 'agent' ? 'bg-white/10' : 'bg-slate-100'}`}>
            <img src={selectedImage.base64} alt="preview" className="w-10 h-10 object-cover rounded" />
            <span className={`text-xs truncate max-w-[150px] ${currentUser === 'agent' ? 'text-white/70' : 'text-slate-600'}`}>{selectedImage.file.name}</span>
            <button onClick={() => setSelectedImage(null)} className={`${currentUser === 'agent' ? 'text-white/50 hover:text-white' : 'text-slate-400 hover:text-slate-600'}`}>
              <X size={14} />
            </button>
          </div>
        )}
        <form onSubmit={handleSend} className="relative flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-3 rounded-full transition-colors ${currentUser === 'agent' ? 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10' : 'bg-slate-100 border border-slate-200 text-slate-500 hover:bg-slate-200'}`}
          >
            <Paperclip size={20} />
          </button>
          
          <div className="relative flex-1">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.typeMessage}
              className={`w-full pl-5 pr-12 py-3 rounded-full text-sm focus:outline-none focus:ring-2 transition-all ${
                currentUser === 'agent' 
                  ? 'bg-white/5 border border-white/10 text-white placeholder:text-white/40 focus:ring-indigo-500/50 focus:border-indigo-500/50' 
                  : 'bg-slate-100 border border-slate-200 text-slate-800 placeholder:text-slate-400 focus:ring-[#d70f64]/30 focus:border-[#d70f64]'
              }`}
            />
            <button
              type="submit"
              disabled={!input.trim() && !selectedImage}
              className={`absolute right-1.5 top-1.5 p-2 rounded-full text-white transition-all shadow-md hover:shadow-lg disabled:opacity-50 ${
                currentUser === 'agent'
                  ? 'bg-gradient-to-br from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400'
                  : 'bg-[#d70f64] hover:bg-[#b00c52]'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
