import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { User, Bell, Settings as SettingsIcon, ChevronRight, LogOut, Download, Edit3 } from 'lucide-react';
import { motion } from 'motion/react';
import { useProfile } from '../contexts/ProfileContext';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useProfile();

  return (
    <div className="min-h-screen pb-24 bg-transparent">
      <TopBar title="Profile" showSettings={true} />
      <main className="px-5 pt-8">
        <section className="flex flex-col items-center text-center mb-10">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
               <img 
                 src={profile.avatarUrl} 
                 alt={profile.name}
                 className="w-full h-full object-cover"
               />
            </div>
            <button 
              onClick={() => navigate('/profile/edit')}
              className="absolute bottom-0 right-0 bg-cpl-blue text-white p-1.5 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform"
            >
               <Edit3 className="w-3 h-3" />
            </button>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-serif text-2xl font-bold text-cpl-dark">{profile.name}</h2>
            {profile.pronouns && (
              <span className="text-[10px] bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {profile.pronouns}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 font-medium mb-4">Member since {profile.memberSince}</p>
          
          <div className="flex gap-4 mb-6">
            <div className="bg-white px-4 py-2 rounded-2xl border border-cpl-border shadow-sm flex flex-col items-center">
              <span className="text-lg font-serif font-black text-cpl-blue">{profile.xp.toLocaleString()}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">XP Earned</span>
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl border border-cpl-border shadow-sm flex flex-col items-center">
              <span className="text-lg font-serif font-black text-cpl-red">{profile.completedLabs.length}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Labs Done</span>
            </div>
          </div>
          
          {profile.bio && (
            <div className="max-w-[280px] mx-auto">
              <p className="text-sm text-gray-500 italic leading-relaxed">
                "{profile.bio}"
              </p>
            </div>
          )}
        </section>

        <section className="space-y-6">
           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Account & Settings</h3>
           <div className="bg-white rounded-2xl shadow-sm border border-cpl-border overflow-hidden">
             {[
               { icon: <User className="w-5 h-5" strokeWidth={2.5} />, title: 'Account Details' },
               { icon: <Bell className="w-5 h-5" strokeWidth={2.5} />, title: 'Notification Preferences' },
               { icon: <div className="w-5 h-5 rounded-full border-[2.5px] border-cpl-blue" />, title: 'App Appearance', extra: 'Light Mode' },
               { icon: <SettingsIcon className="w-5 h-5" strokeWidth={2.5} />, title: 'Privacy & Security' }
             ].map((item, i) => (
               <React.Fragment key={item.title}>
                 {i > 0 && <div className="h-px bg-gray-100 mx-4" />}
                 <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className="text-cpl-blue opacity-85 transition-transform group-hover:scale-110">{item.icon}</div>
                       <div className="text-left">
                          <span className="text-sm font-bold block">{item.title}</span>
                          {item.extra && <span className="text-[10px] text-gray-400 font-medium">{item.extra}</span>}
                       </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                 </button>
               </React.Fragment>
             ))}
           </div>

           <div className="bg-cpl-blue text-white p-6 rounded-2xl flex items-center justify-between shadow-lg relative overflow-hidden group cursor-pointer">
              <div className="relative z-10 pr-12">
                 <h4 className="font-bold text-sm mb-1">CPL Practice Lab Web App</h4>
                 <p className="text-[10px] opacity-80 mb-3">Install on your home screen for faster access.</p>
                 <button className="bg-white text-cpl-blue px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider active:scale-95 transition-all">Install Now</button>
              </div>
              <Download className="w-16 h-16 absolute right-[-10px] bottom-[-10px] opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
           </div>

           <button className="w-full py-4 border border-cpl-red/20 text-cpl-red font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-red-50 transition-all active:scale-[0.98] mt-8">
              <LogOut className="w-4 h-4" /> Sign Out
           </button>
        </section>

        <div className="mt-12 text-center pb-8 opacity-30">
           <p className="text-[10px] font-bold uppercase mb-1">App Version 2.4.0 (Build 1205)</p>
           <p className="text-[10px]">© 2024 CPL LABS. ALL RIGHTS RESERVED.</p>
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
