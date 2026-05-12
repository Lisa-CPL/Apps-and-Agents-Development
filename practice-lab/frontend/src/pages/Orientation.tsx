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

  return (
    <div className="min-h-screen bg-cpl-bg flex flex-col">
      <TopBar title="Orientation" showBack onBack={() => navigate('/hub')} />
      
      <main className="flex-1 px-6 pt-10 pb-24 overflow-y-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 shadow-sm border border-cpl-border relative overflow-hidden"
        >
          <div className="flex justify-between items-start mb-8">
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
          </div>

          <h1 className="font-serif text-3xl text-cpl-dark mb-4 leading-tight">{app.name}</h1>
          <p className="text-gray-500 leading-relaxed mb-10">{app.description}</p>

          <div className="space-y-6">
             <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-2">What you'll practice</h3>
             {[
               "Identifying emotional cues in high-stakes dialogue.",
               "Using neutral language to de-escalate tension.",
               "Maintaining presence while under social pressure."
             ].map((goal, i) => (
               <div key={i} className="flex gap-4">
                  <div className="bg-cpl-blue/10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                     <Target className="w-3 h-3 text-cpl-blue" />
                  </div>
                  <p className="text-sm text-gray-600 font-medium leading-tight">{goal}</p>
               </div>
             ))}
          </div>

          <div className="mt-12 p-6 bg-blue-50/50 rounded-2xl border border-cpl-blue/10">
             <p className="text-xs text-cpl-blue font-serif italic mb-0">"The quality of a conversation is determined by the listener's ability to hear what isn't being said."</p>
          </div>
        </motion.div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-cpl-border max-w-[480px] mx-auto">
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
