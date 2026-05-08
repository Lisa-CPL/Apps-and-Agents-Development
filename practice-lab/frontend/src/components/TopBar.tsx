import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface TopBarProps {
  showBack?: boolean;
  showSettings?: boolean;
  title?: string;
  onBack?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ showBack, showSettings, title, onBack }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-cpl-border px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        {showBack ? (
          <button 
            onClick={onBack || (() => navigate(-1))}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors active:scale-90"
          >
            <ArrowLeft className="w-5 h-5 text-cpl-blue" strokeWidth={2.5} />
          </button>
        ) : (
          <div className="group cursor-pointer">
            <BrandLogo size="sm" iconOnly className="group-hover:scale-110 transition-transform" />
          </div>
        )}
        <h1 className="font-serif text-lg text-cpl-blue font-bold truncate">
          {title || 'Practice Lab'}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-cpl-blue text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">
          BETA
        </div>
        {showSettings && (
          <button 
            onClick={() => navigate('/settings')}
            className="p-1 hover:bg-gray-100 rounded-full transition-all active:scale-95 group"
          >
             <Settings className="w-5 h-5 text-gray-400 group-hover:text-cpl-blue group-hover:rotate-45 transition-all" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </header>
  );
};
