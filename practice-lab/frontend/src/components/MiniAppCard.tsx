import React from 'react';
import { ChevronRight, ArrowRight, Ear, Lightbulb, Scale, Heart, Users, ShieldAlert } from 'lucide-react';
import { MiniApp } from '../constants';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const IconMap: Record<string, React.FC<any>> = {
  Ear, Lightbulb, Scale, Heart, Users, ShieldAlert
};

export const MiniAppCard: React.FC<{ app: MiniApp }> = ({ app }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const IconComp = IconMap[app.iconName] || Lightbulb;
  
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate(`/practice/${app.id}`);
    } else {
      navigate(`/login?redirect=/practice/${app.id}`);
    }
  };
  const borderClass = app.accentColor === 'blue' ? 'border-l-cpl-blue' : 'border-l-cpl-red';
  const iconBg = app.accentColor === 'blue' ? 'bg-cpl-blue/10 text-cpl-blue' : 'bg-cpl-red/10 text-cpl-red';
  const bubbleShape = app.accentColor === 'blue' ? 'rounded-2xl rounded-tr-none' : 'rounded-2xl rounded-tl-none';

  return (
    <div 
      onClick={handleCardClick}
      className={`bg-white rounded-xl shadow-sm border-l-4 ${borderClass} p-4 flex items-center justify-between hover:bg-gray-50 transition-all group active:scale-[0.98] cursor-pointer`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 ${bubbleShape} ${iconBg} flex items-center justify-center transition-transform group-hover:scale-110`}>
          <IconComp className="w-6 h-6" strokeWidth={2.5} />
        </div>
        <div>
          <h3 className="font-serif text-lg text-cpl-dark font-bold leading-tight mb-0.5">{app.name}</h3>
          <p className="text-[11px] text-gray-500 line-clamp-1 italic">"{app.description}"</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{app.estimatedTime}</span>
            <div className="w-1 h-1 rounded-full bg-gray-200" />
            <span className={`text-[9px] font-bold uppercase tracking-wider ${app.accentColor === 'blue' ? 'text-cpl-blue' : 'text-cpl-red'}`}>
              {app.accentColor === 'blue' ? 'Mindset' : 'Action'}
            </span>
          </div>
        </div>
      </div>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${app.accentColor === 'blue' ? 'bg-cpl-blue text-white' : 'bg-cpl-red text-white'}`}>
        <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
      </div>
    </div>
  );
};
