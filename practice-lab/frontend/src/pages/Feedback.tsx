import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { MINI_APPS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ChevronRight, AlertCircle, TrendingUp, Sparkles, RotateCcw } from 'lucide-react';

export const Feedback: React.FC = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const app = MINI_APPS.find(a => a.id === appId);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!app) return null;

  return (
    <div className="min-h-screen bg-cpl-bg flex flex-col">
      <TopBar title="Feedback" showBack onBack={() => navigate(`/practice/${appId}/response`)} />
      
      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="w-16 h-16 border-4 border-cpl-blue/20 border-t-cpl-blue rounded-full animate-spin mb-6" />
              <p className="font-serif text-xl text-gray-400">Coaching AI is analyzing...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 pb-8"
            >
              <div className="bg-cpl-blue p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
                 <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                       <CheckCircle2 className="w-5 h-5 text-blue-200" />
                       <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-70">Impact Score</span>
                    </div>
                    <h2 className="font-serif text-6xl font-black mb-4">92</h2>
                    <p className="text-sm opacity-80 max-w-[200px]">Great work! Your response successfully lowered the conversational temperature.</p>
                 </div>
                 <div className="absolute right-[-20%] bottom-[-20%] w-48 h-48 bg-white/10 rounded-full blur-3xl" />
              </div>

              <div className="bg-white rounded-2xl p-6 border border-cpl-border shadow-sm">
                 <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Key Insights</h3>
                 <div className="space-y-4">
                    <div className="flex gap-4">
                       <div className="text-green-500 shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4" /></div>
                       <div>
                          <p className="text-sm font-bold mb-0.5">Neutral Validation</p>
                          <p className="text-xs text-gray-500 leading-relaxed">You acknowledged the emotion without validating the attack on leadership.</p>
                       </div>
                    </div>
                    <div className="h-px bg-gray-50" />
                    <div className="flex gap-4">
                       <div className="text-cpl-amber shrink-0 mt-0.5"><AlertCircle className="w-4 h-4" /></div>
                       <div>
                          <p className="text-sm font-bold mb-0.5">Refinement Opportunity</p>
                          <p className="text-xs text-gray-500 leading-relaxed">Consider removing "I think" to make your reflection feel more like a direct mirror.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-cpl-border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                   <Sparkles className="w-4 h-4 text-cpl-amber" />
                   <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth Tip</h3>
                </div>
                <p className="text-xs font-medium text-gray-600 italic leading-relaxed">
                   "A lower score isn't a failure, it’s a clear map of where your next bridge needs to be built."
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!loading && (
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-cpl-border max-w-[480px] mx-auto flex gap-4">
          <button 
            onClick={() => navigate(`/practice/${appId}/response`)}
            className="flex-1 border border-cpl-border font-bold py-5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all hover:bg-gray-50"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2.5} />
            Retry
          </button>
          <button 
            onClick={() => navigate(`/practice/${appId}/next`)}
            className="flex-[2] bg-cpl-blue text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
          >
            See Next Step
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </div>
  );
};
