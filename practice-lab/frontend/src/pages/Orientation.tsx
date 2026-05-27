import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { MINI_APPS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Play, BookOpen, Clock, Target } from 'lucide-react';

export const Orientation: React.FC = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const app = MINI_APPS.find(a => a.id === appId);

  if (!app) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <TopBar title="Orientation" showBack onBack={() => navigate('/hub')} />
      
      <main className="flex-1 px-6 pt-10 pb-24 overflow-y-auto">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-3xl p-8 shadow-sm border border-cpl-border relative overflow-hidden"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-start mb-8">
            <div className="bg-blue-50 p-4 rounded-2xl">
               <BookOpen className="w-8 h-8 text-cpl-blue" />
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Est. Duration</span>
               <div className="flex items-center gap-1 text-cpl-blue font-bold">
                  <Clock className="w-3 h-3" />
                  <span className="text-sm">12 mins</span>
               </div>
            </div>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-serif text-3xl text-cpl-dark mb-4 leading-tight">{app.name}</motion.h1>
          <motion.p variants={itemVariants} className="text-gray-500 leading-relaxed mb-10">{app.description}</motion.p>

          <div className="space-y-6">
             <motion.h3 variants={itemVariants} className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">What you'll practice</motion.h3>
             {[
               "Identifying emotional cues in high-stakes dialogue.",
               "Using neutral language to de-escalate tension.",
               "Maintaining presence while under social pressure."
             ].map((goal, i) => (
               <motion.div key={i} variants={itemVariants} className="flex gap-4">
                  <div className="bg-cpl-blue/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                     <Target className="w-3 h-3 text-cpl-blue" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-tight">{goal}</p>
               </motion.div>
             ))}
          </div>

          <motion.div variants={itemVariants} className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-cpl-blue/10">
             <p className="text-xs text-cpl-blue font-serif italic mb-0">"The quality of a conversation is determined by the listener's ability to hear what isn't being said."</p>
          </motion.div>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-6 bg-white border-t border-cpl-border transition-all duration-300">
        <button 
          onClick={() => navigate(`/practice/${appId}/scenario`)}
          className="w-full bg-cpl-blue text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Practice Lab
        </button>
      </div>
    </div>
  );
};
