import React from 'react';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { Flame, Star, Award, TrendingUp, History, Bell, ChevronRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { MINI_APPS } from '../constants';
import { motion } from 'motion/react';
import { useProfile } from '../contexts/ProfileContext';

export const Progress: React.FC = () => {
  const { profile } = useProfile();
  
  const completedCount = profile.completedLabs.length;
  const uniqueSkills = new Set(profile.completedLabs.map(l => l.appId)).size;
  const totalXP = profile.xp;

  // Group labs by appId to show skill mastery
  const skillMastery = MINI_APPS.map(app => {
    const labsForSkill = profile.completedLabs.filter(l => l.appId === app.id);
    const bestScore = labsForSkill.length > 0 ? Math.max(...labsForSkill.map(l => l.score)) : 0;
    return {
      ...app,
      mastery: bestScore
    };
  }).filter(s => s.mastery > 0).sort((a, b) => b.mastery - a.mastery);

  return (
    <div className="min-h-screen pb-24 bg-transparent">
      <TopBar title="Your Progress" />
      <main className="px-5 pt-8 space-y-10">
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="col-span-2 md:col-span-4 lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-cpl-border flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Experience</p>
                 <h2 className="font-serif text-3xl text-cpl-blue">{totalXP.toLocaleString()} XP</h2>
              </div>
              <div className="bg-blue-50 p-3 rounded-full relative z-10 group-hover:scale-110 transition-transform duration-500">
                 <Award className="w-8 h-8 text-cpl-blue fill-current" />
              </div>
              <div className="absolute top-[-20px] right-[-20px] w-24 h-24 bg-blue-50/50 rounded-full blur-xl" />
           </div>

           <div className="bg-white p-5 rounded-2xl border border-cpl-border shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Skills Started</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-serif text-cpl-red font-black">{uniqueSkills}</span>
                 <span className="text-xs text-gray-300">/ {MINI_APPS.length}</span>
              </div>
           </div>

           <div className="bg-white p-5 rounded-2xl border border-cpl-border shadow-sm">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Labs Done</p>
              <div className="flex items-baseline gap-2">
                 <span className="text-3xl font-serif text-cpl-blue font-black">{completedCount}</span>
                 <span className="text-xs text-gray-300">total</span>
              </div>
           </div>
        </section>

        {skillMastery.length > 0 ? (
          <section>
             <h3 className="font-serif text-2xl mb-6">Skill Mastery</h3>
             <div className="space-y-4">
                {skillMastery.slice(0, 3).map((skill, i) => (
                  <div key={skill.id} className="bg-white p-5 rounded-2xl border border-cpl-border hover:shadow-md transition-shadow">
                     <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                           <div className="text-cpl-blue opacity-50">
                             <TrendingUp className="w-5 h-5" />
                           </div>
                           <span className="font-bold text-sm">{skill.name}</span>
                        </div>
                        <div className="flex gap-0.5 text-cpl-amber">
                           {[1,2,3,4,5].map(star => (
                             <Star key={star} className={`w-3 h-3 ${star <= Math.ceil(skill.mastery / 20) ? 'fill-current' : 'text-gray-100'}`} />
                           ))}
                        </div>
                     </div>
                     <div className="w-full h-1.5 bg-gray-50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.mastery}%` }}
                          transition={{ duration: 1, delay: i * 0.2 }}
                          className="h-full bg-cpl-blue flex justify-end items-center"
                        />
                     </div>
                     <p className="text-right text-[10px] font-bold text-gray-400 mt-2">{skill.mastery}% Mastered</p>
                  </div>
                ))}
             </div>
             {skillMastery.length > 3 && (
               <button className="w-full mt-4 py-3 text-cpl-blue font-bold text-[10px] uppercase tracking-widest hover:bg-white rounded-xl transition-all">
                 View all {uniqueSkills} Skills
               </button>
             )}
          </section>
        ) : (
          <section className="bg-white/50 border border-dashed border-cpl-border rounded-3xl p-12 text-center">
            <h3 className="font-serif text-xl mb-2">No Practice Recorded Yet</h3>
            <p className="text-sm text-gray-400 mb-6">Complete a lab to see your mastery growth here.</p>
          </section>
        )}

        <section>
           <h3 className="font-serif text-2xl mb-6">Recent Badges</h3>
           <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar -mx-5 px-5">
              {[
                { color: 'bg-amber-400', icon: <Award className="w-10 h-10" />, title: 'First Reflect', active: profile.completedLabs.length >= 1 },
                { color: 'bg-blue-600', icon: <History className="w-10 h-10" />, title: 'Bias Buster', active: profile.completedLabs.length >= 5 },
                { color: 'bg-red-500', icon: <TrendingUp className="w-10 h-10" />, title: 'Empathy Pro', active: profile.completedLabs.length >= 10 },
                { color: 'bg-green-500', icon: <Award className="w-10 h-10" />, title: 'Lab Champ', active: profile.completedLabs.length >= 20 }
              ].map((badge, i) => (
                <div key={i} className={`flex flex-col items-center gap-3 shrink-0 ${badge.active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
                   <div className={`${badge.color} w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white`}>
                      {badge.icon}
                   </div>
                   <span className="text-[10px] font-bold text-center w-20 tracking-tighter uppercase">{badge.title}</span>
                </div>
              ))}
           </div>
        </section>

        <section className="pb-12">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif text-2xl">Practice History</h3>
           </div>
           <div className="bg-white rounded-2xl border border-cpl-border overflow-hidden">
              {profile.completedLabs.length > 0 ? profile.completedLabs.slice(0, 5).map((item, i) => {
                const app = MINI_APPS.find(a => a.id === item.appId);
                return (
                  <React.Fragment key={item.id}>
                    {i > 0 && <div className="h-px bg-gray-50 mx-4" />}
                    <div className="p-4 flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 ${i % 2 === 0 ? 'rounded-xl rounded-tr-none bg-blue-50 text-cpl-blue' : 'rounded-xl rounded-tl-none bg-red-50 text-cpl-red'} flex items-center justify-center transition-transform group-hover:scale-110`}>
                             {i % 2 === 0 ? <CheckCircle2 className="w-5 h-5" strokeWidth={2.5} /> : <MessageCircle className="w-5 h-5" strokeWidth={2.5} />}
                          </div>
                          <div>
                             <h4 className="font-bold text-sm">{app?.name || 'Unknown Lab'}</h4>
                             <p className="text-[10px] text-gray-400 font-medium">{item.date} • {item.duration}</p>
                          </div>
                       </div>
                       <span className={`text-lg font-serif font-black ${item.score >= 90 ? 'text-cpl-blue' : 'text-cpl-red'}`}>
                          {item.score}%
                       </span>
                    </div>
                  </React.Fragment>
                );
              }) : (
                <div className="p-12 text-center text-gray-400 italic text-sm">
                  Complete your first lab to start your history.
                </div>
              )}
           </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};
