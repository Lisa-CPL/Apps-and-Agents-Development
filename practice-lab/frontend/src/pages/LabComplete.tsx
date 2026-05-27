import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { MINI_APPS } from '../constants';
import { motion } from 'motion/react';
import { Sparkles, Trophy, Star, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

export const LabComplete: React.FC = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { completeLab } = useProfile();
  const hasRecorded = useRef(false);
  const app = MINI_APPS.find(a => a.id === appId);

  useEffect(() => {
    if (appId && !hasRecorded.current) {
      completeLab(appId, 92, '12 mins');
      hasRecorded.current = true;
    }
  }, [appId, completeLab]);

  if (!app) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 200, damping: 20 }
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col relative overflow-hidden">
      {/* Background celebration shapes */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-cpl-blue rounded-full blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-64 h-64 bg-cpl-red rounded-full blur-[100px]" />
      </motion.div>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-8 flex flex-col items-center justify-center pb-24 overflow-y-auto relative z-10"
      >
         <motion.div 
            variants={itemVariants}
            className="mb-10 relative"
         >
            <div className="absolute inset-0 bg-cpl-blue/10 blur-3xl rounded-full scale-150 animate-pulse" />
            <div className="bg-cpl-blue text-white w-32 h-32 rounded-full flex items-center justify-center shadow-2xl border-4 border-white relative z-10">
               <Trophy className="w-14 h-14" />
            </div>
            <motion.div 
               animate={{ rotate: 360 }} 
               transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
               className="absolute top-0 left-0 w-32 h-32 pointer-events-none"
            >
               <Star className="w-6 h-6 text-cpl-amber absolute -top-4 left-12 fill-current" />
               <Sparkles className="w-4 h-4 text-cpl-blue absolute top-6 -left-6" />
               <Star className="w-3 h-3 text-cpl-red absolute top-20 -right-4 fill-current" />
            </motion.div>
         </motion.div>

         <motion.div variants={itemVariants} className="text-center mb-12">
            <h1 className="font-serif text-4xl font-black text-cpl-blue mb-4">Lab Complete!</h1>
            <p className="text-gray-400 font-medium leading-relaxed max-w-[280px] mx-auto">You've successfully finished the <strong>{app.name}</strong> practice module.</p>
         </motion.div>

         <div className="w-full space-y-4 mb-20 max-w-md">
            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl flex justify-between items-center border border-cpl-border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-cpl-blue">
                     <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Mastery Gained</p>
                    <p className="font-serif text-lg text-cpl-dark">+240 XP</p>
                  </div>
               </div>
               <span className="text-cpl-blue font-black font-serif text-xl">12% ▲</span>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl flex justify-between items-center border border-cpl-border shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-cpl-amber">
                     <AwardIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Growth Points</p>
                    <p className="font-serif text-lg text-cpl-dark">Reflector Level 2</p>
                  </div>
               </div>
               <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-cpl-amber" />
                  <div className="w-2 h-2 rounded-full bg-cpl-amber" />
                  <div className="w-2 h-2 rounded-full bg-gray-200" />
               </div>
            </motion.div>
         </div>
      </motion.main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-8 bg-white transition-all duration-300">
        <button 
          onClick={() => navigate('/hub')}
          className="w-full bg-cpl-blue text-white font-bold py-5 rounded-2xl shadow-xl active:scale-[0.98] transition-all mb-4"
        >
          Return to Hub
        </button>
        <button 
          onClick={() => navigate('/progress')}
          className="w-full py-2 text-cpl-blue font-bold text-[10px] uppercase tracking-widest hover:underline"
        >
          View Full Progress Report
        </button>
      </div>
    </div>
  );
};

const AwardIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/></svg>
)
