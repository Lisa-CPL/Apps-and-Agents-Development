import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { Users, Trophy, Calendar, MessageSquare, ArrowRight, Star } from 'lucide-react';

export const Community: React.FC = () => {
  const navigate = useNavigate();

  const workshops = [
    { title: "De-escalation Workshop", date: "May 2, 6:00 PM", participants: 124, type: "Live" },
    { title: "Active Listening Lab", date: "May 5, 12:00 PM", participants: 89, type: "Workshop" }
  ];

  return (
    <div className="min-h-screen pb-24 bg-transparent">
      <TopBar title="Community" showBack onBack={() => navigate('/hub')} />
      
      <main className="px-5 pt-8 space-y-8">
        {/* Weekly Challenge Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cpl-blue rounded-3xl p-8 text-white relative overflow-hidden shadow-xl"
        >
          <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-white/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-cpl-amber" />
              <span className="text-[10px] font-black uppercase tracking-widest text-cpl-blue-light/80">Weekly Challenge</span>
            </div>
            <h2 className="font-serif text-2xl mb-2">Mastering De-escalation</h2>
            <p className="text-sm text-cpl-blue-light mb-6 leading-relaxed">
              Join 120+ others in this week's workshop. Practice diffusing tension with empathy and clear boundaries.
            </p>
            <button className="bg-white text-cpl-blue px-6 py-3 rounded-2xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center gap-2">
              Join Workshop <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.section>

        {/* Community Stats */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-cpl-border shadow-sm flex flex-col gap-1">
            <span className="text-2xl font-serif text-cpl-blue">1.2k+</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active Learners</span>
          </div>
          <div className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-cpl-border shadow-sm flex flex-col gap-1">
            <span className="text-2xl font-serif text-cpl-red">482</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Global BRIDGES</span>
          </div>
        </section>

        {/* Upcoming Workshops */}
        <section className="space-y-4">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Upcoming Events</h3>
          <div className="space-y-3">
            {workshops.map((w, i) => (
              <div key={i} className="bg-white/90 backdrop-blur-sm p-5 rounded-2xl border border-cpl-border flex items-center justify-between group cursor-pointer hover:border-cpl-blue transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-cpl-blue">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-cpl-dark">{w.title}</h4>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5">{w.date} • {w.participants} Joined</p>
                  </div>
                </div>
                <Star className="w-5 h-5 text-gray-200 group-hover:text-cpl-amber transition-colors" />
              </div>
            ))}
          </div>
        </section>

        {/* Discussion Forum Card */}
        <section className="bg-white/90 backdrop-blur-sm p-6 rounded-3xl border border-cpl-border shadow-sm flex items-center justify-between group cursor-pointer hover:border-cpl-red transition-colors">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-cpl-red/10 flex items-center justify-center text-cpl-red">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-cpl-dark">Learner Forum</h4>
              <p className="text-xs text-gray-500">Discuss scenarios with peers</p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-cpl-red group-hover:translate-x-1 transition-all" />
        </section>
      </main>
    </div>
  );
};
