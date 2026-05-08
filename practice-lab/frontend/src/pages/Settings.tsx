import React from 'react';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { Settings as SettingsIcon, Bell, Moon, Sun, Shield, Lock, Trash2, ChevronRight, Smartphone } from 'lucide-react';
import { motion } from 'motion/react';

export const Settings: React.FC = () => {
  return (
    <div className="min-h-screen pb-24 bg-transparent">
      <TopBar title="Settings" />
      <main className="px-5 pt-8 space-y-10">
        <section className="space-y-4">
           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Notifications</h3>
           <div className="bg-white rounded-2xl shadow-sm border border-cpl-border overflow-hidden">
             {[
               { icon: <Bell className="w-5 h-5" />, title: 'Push Notifications', type: 'toggle', enabled: true },
               { icon: <Bell className="w-5 h-5" />, title: 'Email Updates', type: 'toggle', enabled: false }
             ].map((item, i) => (
               <React.Fragment key={item.title}>
                 {i > 0 && <div className="h-px bg-gray-100 mx-4" />}
                 <div className="p-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="text-cpl-blue opacity-50">{item.icon}</div>
                       <span className="text-sm font-bold">{item.title}</span>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 cursor-pointer transition-colors ${item.enabled ? 'bg-cpl-blue' : 'bg-gray-200'}`}>
                       <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${item.enabled ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                 </div>
               </React.Fragment>
             ))}
           </div>
        </section>

        <section className="space-y-4">
           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Privacy & Data</h3>
           <div className="bg-white rounded-2xl shadow-sm border border-cpl-border overflow-hidden">
             {[
               { icon: <Lock className="w-5 h-5" />, title: 'Change Password' },
               { icon: <Shield className="w-5 h-5" />, title: 'Privacy Settings' },
               { icon: <Trash2 className="w-5 h-5" />, title: 'Delete History', red: true }
             ].map((item, i) => (
               <React.Fragment key={item.title}>
                 {i > 0 && <div className="h-px bg-gray-100 mx-4" />}
                 <button className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center gap-4">
                       <div className={`${item.red ? 'text-cpl-red' : 'text-cpl-blue'} opacity-50`}>{item.icon}</div>
                       <span className={`text-sm font-bold ${item.red ? 'text-cpl-red' : ''}`}>{item.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:translate-x-1 transition-transform" />
                 </button>
               </React.Fragment>
             ))}
           </div>
        </section>

        <section className="space-y-4">
           <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Device</h3>
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-cpl-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                    <Smartphone className="w-5 h-5" />
                 </div>
                 <div>
                    <h4 className="font-bold text-sm">Offline Mode</h4>
                    <p className="text-[10px] text-gray-400">Download labs for local practice.</p>
                 </div>
              </div>
              <span className="text-[10px] font-bold text-cpl-blue border border-cpl-blue/30 px-3 py-1 rounded-full uppercase tracking-widest">Enable</span>
           </div>
        </section>
      </main>
      <BottomNav />
    </div>
  );
};
