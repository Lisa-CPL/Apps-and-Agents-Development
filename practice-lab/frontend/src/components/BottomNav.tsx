import React from 'react';
import { LayoutGrid, Award, MessageSquareText, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { motion } from 'motion/react';

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl z-50 bg-white/95 backdrop-blur-md border-t border-cpl-border px-6 py-2 flex justify-between items-center shadow-[0_-4px_12px_rgba(26,26,46,0.05)] transition-all duration-400">
      <NavLink 
        to="/hub" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue' : 'text-gray-400 opacity-70 hover:opacity-100'}`}
      >
        {({ isActive }) => (
          <>
            <motion.div
              animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <LayoutGrid className="w-5 h-5" strokeWidth={isActive ? 3 : 2.5} />
            </motion.div>
            <span className={`text-[9px] uppercase font-bold tracking-wider transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>Hub</span>
          </>
        )}
      </NavLink>
      <NavLink 
        to="/progress" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue' : 'text-gray-400 opacity-70 hover:opacity-100'}`}
      >
        {({ isActive }) => (
          <>
            <motion.div
              animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Award className="w-5 h-5" strokeWidth={isActive ? 3 : 2.5} />
            </motion.div>
            <span className={`text-[9px] uppercase font-bold tracking-wider transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>Progress</span>
          </>
        )}
      </NavLink>
      <NavLink 
        to="/help" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue' : 'text-gray-400 opacity-70 hover:opacity-100'}`}
      >
        {({ isActive }) => (
          <>
            <motion.div
              animate={{ scale: isActive ? 1.2 : 1, rotate: isActive ? 10 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 15 }}
            >
              <MessageSquareText className="w-5 h-5" strokeWidth={isActive ? 3 : 2.5} />
            </motion.div>
            <span className={`text-[9px] uppercase font-bold tracking-wider transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>Help</span>
          </>
        )}
      </NavLink>
      <NavLink 
        to="/profile" 
        className={({ isActive }) => `flex flex-col items-center gap-1 transition-all ${isActive ? 'text-cpl-blue' : 'text-gray-400 opacity-70 hover:opacity-100'}`}
      >
        {({ isActive }) => (
          <>
            <motion.div
              animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <User className="w-5 h-5" strokeWidth={isActive ? 3 : 2.5} />
            </motion.div>
            <span className={`text-[9px] uppercase font-bold tracking-wider transition-all ${isActive ? 'opacity-100' : 'opacity-0 scale-75'}`}>Profile</span>
          </>
        )}
      </NavLink>
    </nav>
  );
};
