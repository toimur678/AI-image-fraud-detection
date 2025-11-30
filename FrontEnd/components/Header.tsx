import React from 'react';
import { Banana, ScanSearch, Globe } from 'lucide-react';
import { Language, translations } from '../translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const t = translations[language].header;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'tr' : 'en');
  };

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
            {t.subtitle}
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-sm text-white/80 text-xs font-medium">
          <ScanSearch size={14} />
          <span>{t.version}</span>
        </div>
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-full border border-white/30 shadow-lg transition-all text-white text-xs font-medium"
          title="Change Language"
        >
          <Globe size={14} />
          <span>{language.toUpperCase()}</span>
        </button>
      </div>
    </header>
  );
};
