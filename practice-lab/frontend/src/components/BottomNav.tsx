import React from 'react';
import { LayoutGrid, Award, MessageSquareText, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-cpl-border px-6 py-2 flex justify-between items-center shadow-[0_-4px_12px_rgba(26,26,46,0.05)] max-w-[480px] mx-auto">
      <NavLink 
        to="/hub" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue scale-110' : 'text-gray-400 opacity-70'}`}
      >
        <LayoutGrid className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] uppercase font-bold tracking-tighter">Hub</span>
      </NavLink>
      <NavLink 
        to="/progress" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue scale-110' : 'text-gray-400 opacity-70'}`}
      >
        <Award className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] uppercase font-bold tracking-tighter">Progress</span>
      </NavLink>
      <NavLink 
        to="/help" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue scale-110' : 'text-gray-400 opacity-70'}`}
      >
        <MessageSquareText className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] uppercase font-bold tracking-tighter">Help</span>
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue scale-110' : 'text-gray-400 opacity-70'}`}
      >
        <User className="w-5 h-5" strokeWidth={2.5} />
        <span className="text-[10px] uppercase font-bold tracking-tighter">Profile</span>
      </NavLink>
    </nav>
  );
};
