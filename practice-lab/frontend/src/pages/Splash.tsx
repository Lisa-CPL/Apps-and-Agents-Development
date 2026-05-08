import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { BrandLogo } from '../components/BrandLogo';
import { ChevronRight } from 'lucide-react';

export const Splash: React.FC = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/hub');
  };

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen bg-transparent cursor-pointer select-none"
      onClick={handleStart}
    >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <BrandLogo size="lg" layout="vertical" className="mb-8" />
        <div className="bg-cpl-blue text-white px-4 py-1.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">
          Practice Lab
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-24 flex flex-col items-center gap-2"
      >
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] ml-1">Tap to Start</span>
        <ChevronRight className="w-5 h-5 text-cpl-blue" strokeWidth={2.5} />
      </motion.div>

      <div className="absolute bottom-16 flex gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-cpl-blue" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
        <div className="w-1.5 h-1.5 rounded-full bg-gray-100" />
      </div>
    </div>
  );
};
