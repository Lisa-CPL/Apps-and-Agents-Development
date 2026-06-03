import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { MiniAppCard } from '../components/MiniAppCard';
import { MiniApp } from '../constants';
import { fetchMiniApps, MiniAppResponse } from '../api';
import { motion } from 'motion/react';
import { WelcomeModal } from '../components/WelcomeModal';
import { MessageSquare, MessageCircle, Send, Loader2, AlertCircle } from 'lucide-react';

/**
 * Presentation-layer defaults for mini-apps.
 * accentColor and iconName are UI concerns not stored in the backend.
 * Falls back to sensible defaults for any new mini-app added on the backend.
 */
const APP_DISPLAY_OVERRIDES: Record<string, { accentColor: 'blue' | 'red'; iconName: string }> = {
  'reflect-and-check':       { accentColor: 'blue', iconName: 'Ear' },
  'follow-the-thread':       { accentColor: 'red',  iconName: 'Lightbulb' },
  'read-between-the-lines':  { accentColor: 'blue', iconName: 'Scale' },
  'say-it-with-context':     { accentColor: 'red',  iconName: 'Heart' },
  'under-the-surface':       { accentColor: 'blue', iconName: 'Users' },
  'what-did-you-mean':       { accentColor: 'red',  iconName: 'ShieldAlert' },
};

function toMiniApp(raw: MiniAppResponse, index: number): MiniApp {
  const overrides = APP_DISPLAY_OVERRIDES[raw.id] ?? {
    accentColor: index % 2 === 0 ? 'blue' as const : 'red' as const,
    iconName: 'Lightbulb',
  };
  return {
    id: raw.id,
    name: raw.name,
    description: raw.skill_one_liner,
    estimatedTime: raw.estimated_time,
    ...overrides,
  };
}

export const Hub: React.FC = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState<MiniApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchMiniApps()
      .then((data) => {
        if (!cancelled) {
          setApps(data.map(toMiniApp));
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message || 'Failed to load mini-apps');
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen pb-24 bg-transparent">
      <TopBar />
      <WelcomeModal />
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 py-10 bg-gradient-to-br from-[#F0F4FF] to-[#FFF5F5] relative overflow-hidden"
      >
        <div className="max-w-[80%] relative z-10">
          <h2 className="font-serif text-3xl leading-tight text-cpl-blue mb-4">Build the skills that bridge divides.</h2>
          <p className="text-gray-500 text-sm leading-relaxed">Short AI-powered exercises to strengthen your conversation skills — one at a time.</p>
        </div>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col -space-y-3 opacity-90 drop-shadow-xl z-20">
          <motion.div 
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="w-12 h-12 rounded-full bg-cpl-blue flex items-center justify-center text-white shadow-lg border-2 border-white z-10"
          >
            <MessageSquare className="w-5 h-5" strokeWidth={2.5} />
          </motion.div>
          <motion.div 
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="w-12 h-12 rounded-full bg-cpl-red flex items-center justify-center text-white shadow-lg border-2 border-white z-20 ml-2"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={2.5} />
          </motion.div>
          <motion.div 
            initial={{ scale: 0, x: 20 }}
            animate={{ scale: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-cpl-blue shadow-lg border-2 border-white z-30"
          >
            <Send className="w-4 h-4 rotate-[-12deg]" strokeWidth={2.5} />
          </motion.div>
        </div>
      </motion.section>

      <div className="px-6 py-8">
        <h3 className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mb-6">Choose a skill to practice</h3>

        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <Loader2 className="w-8 h-8 text-cpl-blue animate-spin" />
            <p className="text-sm text-gray-400">Loading mini-apps…</p>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <AlertCircle className="w-8 h-8 text-cpl-red" />
            <p className="text-sm text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 text-sm font-medium text-white bg-cpl-blue rounded-lg hover:bg-cpl-blue/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MiniAppCard app={app} />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 mb-12">
        <motion.div 
          onClick={() => navigate('/community')}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl p-6 border border-cpl-border relative overflow-hidden group hover:border-cpl-blue transition-colors cursor-pointer shadow-sm active:scale-[0.98]"
        >
           <div className="flex items-center justify-between mb-4">
              <div className="flex -space-x-2">
                 {[1,2,3,4].map(i => (
                   <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                     <img src={`https://i.pravatar.cc/100?img=${i+14}`} alt="User" />
                   </div>
                 ))}
              </div>
              <span className="text-[10px] font-black text-cpl-blue px-2 py-0.5 bg-cpl-blue/10 rounded uppercase tracking-widest">Community</span>
           </div>
           <h4 className="font-serif text-lg text-cpl-dark mb-1">Weekly Challenge</h4>
           <p className="text-xs text-gray-500 leading-relaxed">Join 120+ others in this week's de-escalation workshop.</p>
           
           <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-cpl-blue/5 rounded-full blur-2xl group-hover:bg-cpl-blue/10 transition-colors" />
        </motion.div>
      </div>

      <BottomNav />
    </div>
  );
};
