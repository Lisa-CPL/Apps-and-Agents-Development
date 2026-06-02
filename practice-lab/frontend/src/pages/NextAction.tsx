import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { FeedbackPayload } from '../api';
import { motion } from 'motion/react';
import { Trophy, ArrowRight, MessageSquare, BookOpen, Star, Lock, ChevronRight } from 'lucide-react';

export const NextAction: React.FC = () => {
  const { appId } = useParams<{ appId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { feedback?: FeedbackPayload; scenario?: string } | null;

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <TopBar
        title="Next Steps"
        showBack
        onBack={() => navigate(`/practice/${appId}/feedback`, { state })}
      />

      <main className="flex-1 px-6 pt-10 pb-24 overflow-y-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-cpl-amber/20 p-6 rounded-full border-4 border-white shadow-xl mb-6"
          >
            <Trophy className="w-12 h-12 text-cpl-amber fill-current" />
          </motion.div>
          <h2 className="font-serif text-3xl font-black text-cpl-dark mb-2">Bridge Built.</h2>
          <p className="text-gray-400 text-sm max-w-[280px]">You've completed the core exercise. What would you like to do next?</p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate(`/practice/${appId}/complete`)}
            className="w-full bg-white p-6 rounded-3xl border border-cpl-border shadow-sm flex items-center justify-between group hover:border-cpl-blue transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl rounded-tr-none flex items-center justify-center text-cpl-blue group-hover:scale-110 transition-transform">
                <Star className="w-6 h-6 fill-current" strokeWidth={2.5} />
              </div>
              <div className="text-left font-bold">
                <p className="text-sm">Finish & Collect XP</p>
                <p className="text-[10px] text-gray-400 font-medium">Add +240 to your mastery streak.</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>

          <button
            disabled
            className="w-full bg-white p-6 rounded-3xl border border-cpl-border shadow-sm flex items-center justify-between opacity-60 cursor-not-allowed"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-50 rounded-2xl rounded-tl-none flex items-center justify-center text-cpl-red">
                <MessageSquare className="w-6 h-6" strokeWidth={2.5} />
              </div>
              <div className="text-left font-bold">
                <p className="text-sm">Go Deeper (Coming Soon)</p>
                <p className="text-[10px] text-gray-400 font-medium">Simulate a full back-and-forth talk.</p>
              </div>
            </div>
            <Lock className="w-4 h-4 text-gray-300" strokeWidth={2.5} />
          </button>

          <div className="bg-cpl-blue/5 p-8 rounded-3xl flex flex-col items-center text-center">
            <BookOpen className="w-8 h-8 text-cpl-blue mb-4 opacity-30" />
            <h4 className="font-bold text-sm mb-1 text-cpl-blue">Reading Corner</h4>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">Want the companion guide to deepen this skill?</p>
            <button className="text-[10px] font-black uppercase text-cpl-blue tracking-widest border-b border-transparent hover:border-cpl-blue pb-1 transition-colors">Download PDF</button>
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-6 bg-white border-t border-cpl-border transition-all duration-300">
        <button
          onClick={() => navigate(`/practice/${appId}/complete`)}
          className="w-full bg-cpl-blue text-white font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all group"
        >
          Complete Session
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
};
