import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BrandLogo } from './BrandLogo';

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('cpl_seen_welcome');
    if (!hasSeenWelcome) {
      const timer = setTimeout(() => setIsOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('cpl_seen_welcome', 'true');
  };

  const handleAuth = (type: 'login' | 'signup') => {
    handleClose();
    navigate('/login');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-cpl-dark/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-[380px] bg-white rounded-[32px] overflow-hidden shadow-2xl"
          >
            <button 
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            <div className="pt-12 pb-8 px-8 flex flex-col items-center text-center">
              <div className="mb-6">
                <BrandLogo size="md" />
              </div>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-cpl-blue/10 rounded-full mb-4">
                <Sparkles className="w-3 h-3 text-cpl-blue" />
                <span className="text-[10px] font-black text-cpl-blue uppercase tracking-widest">New Learning Experience</span>
              </div>

              <h2 className="font-serif text-2xl text-cpl-dark font-bold mb-3">Welcome to the Lab</h2>
              
              <p className="text-sm text-gray-500 leading-relaxed mb-8">
                CPL Practice Lab is your space to master high-stakes conversations through AI-powered micro-exercises. Build the bridges that connect us all.
              </p>

              <div className="w-full space-y-3">
                <button 
                  onClick={() => handleAuth('login')}
                  className="w-full bg-cpl-blue text-white font-bold py-4 rounded-2xl shadow-lg shadow-cpl-blue/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={handleClose}
                  className="w-full bg-white text-gray-400 font-bold py-3 rounded-2xl text-xs hover:text-gray-600 transition-colors"
                >
                  Maybe later
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 flex justify-center gap-4 border-t border-gray-100">
               <div className="flex -space-x-2">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" />
                   </div>
                 ))}
               </div>
               <p className="text-[10px] text-gray-400 font-bold self-center uppercase tracking-tighter">Joined by 2k+ learners</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
