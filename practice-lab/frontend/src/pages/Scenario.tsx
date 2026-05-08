import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { MINI_APPS } from '../constants';
import { motion } from 'motion/react';
import { MessageSquare, User, Info, ChevronRight } from 'lucide-react';

export const Scenario: React.FC = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const app = MINI_APPS.find(a => a.id === appId);

  if (!app) return null;

  return (
    <div className="min-h-screen bg-cpl-bg flex flex-col">
      <TopBar title="The Scenario" showBack onBack={() => navigate(`/practice/${appId}`)} />
      
      <main className="flex-1 px-6 pt-10 pb-24 overflow-y-auto">
         <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-cpl-red overflow-hidden flex items-center justify-center text-white font-bold text-xs">
                  A
               </div>
               <span className="text-xs font-bold text-gray-500">Alex • Counter-perspective</span>
            </div>
            <div className="bg-white px-2 py-1 rounded-md border border-cpl-border flex items-center gap-1.5 cursor-pointer hover:bg-gray-50">
               <Info className="w-3 h-3 text-gray-400" strokeWidth={2.5} />
               <span className="text-[10px] font-bold text-gray-400">CONTEXT</span>
            </div>
         </div>

         <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="bg-white rounded-3xl p-8 shadow-xl border border-cpl-border relative mb-10"
         >
            <div className="absolute -top-6 -left-2 w-12 h-12 bg-red-100 rounded-2xl rounded-tr-none flex items-center justify-center text-cpl-red opacity-80 rotate-[-12deg]">
              <MessageSquare className="w-6 h-6" strokeWidth={2.5} />
            </div>
           
           <p className="font-lora text-xl italic leading-relaxed text-cpl-dark mb-8">
             "I just don't see how your proposal helps anyone except the people at the top. It feels like we're being sidelined again, and honestly, I'm tired of making excuses for this leadership team."
           </p>

           <div className="flex gap-2">
              <span className="bg-red-50 text-cpl-red text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">Tone: Defensive</span>
              <span className="bg-red-50 text-cpl-red text-[9px] font-black px-2 py-1 rounded uppercase tracking-wider">Intensity: High</span>
           </div>
         </motion.div>

         <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Your Objective</h3>
            <div className="bg-white/50 border border-cpl-border rounded-2xl p-5 flex items-start gap-4">
               <div className="bg-cpl-blue text-white w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  1
               </div>
               <p className="text-sm font-medium text-gray-600">Acknowledge Alex's feelings without agreeing or disagreeing with the leadership critique.</p>
            </div>
            <div className="bg-white/50 border border-cpl-border rounded-2xl p-5 flex items-start gap-4">
               <div className="bg-cpl-blue text-white w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                  2
               </div>
               <p className="text-sm font-medium text-gray-600">De-escalate the intensity using one of your practiced reflection tools.</p>
            </div>
         </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-cpl-border max-w-[480px] mx-auto">
        <button 
          onClick={() => navigate(`/practice/${appId}/response`)}
          className="w-full bg-cpl-blue text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
        >
          Continue to Response
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
