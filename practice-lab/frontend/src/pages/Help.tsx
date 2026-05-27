import React from 'react';
import { TopBar } from '../components/TopBar';
import { BottomNav } from '../components/BottomNav';
import { Search, ChevronDown, MessageCircle, HelpCircle, ShieldCheck, Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';

export const Help: React.FC = () => {
  return (
    <div className="min-h-screen pb-24 bg-transparent">
      <TopBar title="Help & Support" />
      <main className="px-5 pt-6">
        <div className="relative mb-10 max-w-2xl mx-auto">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            className="w-full py-4 pl-12 pr-4 bg-white border border-cpl-border rounded-xl shadow-sm outline-none focus:ring-2 focus:ring-cpl-blue/10 focus:border-cpl-blue transition-all"
            placeholder="Search for help topics..."
          />
        </div>

        <section className="mb-10">
          <h2 className="font-serif text-2xl text-cpl-blue mb-6">Quick Guides</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="md:col-span-2 lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border-l-4 border-cpl-blue relative overflow-hidden group cursor-pointer active:scale-[0.98] transition-all">
                <div className="flex justify-between items-start mb-3">
                   <div className="p-2 rounded-xl rounded-tr-none bg-blue-50 text-cpl-blue group-hover:scale-110 transition-transform">
                     <MessageCircle className="w-8 h-8" strokeWidth={2.5} />
                   </div>
                   <span className="text-[9px] font-black bg-blue-50 text-cpl-blue px-3 py-1 rounded-full uppercase tracking-widest">MOST POPULAR</span>
                </div>
                <h3 className="font-bold text-sm mb-1 group-hover:text-cpl-blue transition-colors">How the AI coaching works</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed italic opacity-85">Understand the science behind our adaptive practice loops and real-time feedback.</p>
             </div>
             
             <div className="bg-white p-5 rounded-2xl shadow-sm group cursor-pointer active:scale-[0.98] transition-all border border-transparent hover:border-cpl-amber/30">
                <div className="w-10 h-10 rounded-xl rounded-tl-none bg-amber-50 text-cpl-amber flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                   <Lightbulb className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-[13px] leading-tight mb-2 group-hover:text-cpl-amber transition-colors">Using "Try it this way" tips</h3>
                <p className="text-[10px] text-gray-400 opacity-80">Learn how to apply micro-suggestions.</p>
             </div>

             <div className="bg-white p-5 rounded-2xl shadow-sm group cursor-pointer active:scale-[0.98] transition-all border border-transparent hover:border-cpl-red/30">
                <div className="w-10 h-10 rounded-xl rounded-tl-none bg-red-50 text-cpl-red flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm">
                   <MessageCircle className="w-6 h-6" strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-[13px] leading-tight mb-2 group-hover:text-cpl-red transition-colors">Navigating tough topics</h3>
                <p className="text-[10px] text-gray-400 opacity-80">Best practices for high-stakes talks.</p>
             </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-serif text-2xl text-cpl-blue mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {[
              { q: 'Is my data private?', a: "Absolutely. Practice sessions are end-to-end encrypted and never shared with 3rd parties." },
              { q: 'Can I practice on desktop?', a: "Yes, our PWA works on any device's web browser." },
              { q: 'Who created these labs?', a: "Labs are co-designed by expert facilitators and behavioral psychologists." }
            ].map((faq, i) => (
              <details key={i} className="group bg-white rounded-xl border border-cpl-border transition-all overflow-hidden" open={i === 0}>
                <summary className="flex items-center justify-between p-4 cursor-pointer font-bold text-sm list-none select-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-gray-300 group-open:rotate-180 transition-transform" />
                </summary>
                <div className="px-4 pb-4 text-xs text-gray-500 leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="bg-cpl-blue p-8 rounded-3xl text-center shadow-xl relative overflow-hidden group">
           <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
           <h4 className="font-serif text-2xl text-white mb-2">Still need help?</h4>
           <p className="text-blue-100 text-sm mb-6 max-w-[280px] mx-auto opacity-80">Our facilitators are available Mon-Fri to help with your journey.</p>
           <button className="bg-white text-cpl-blue px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto">
             <MessageCircle className="w-4 h-4" /> Message a Facilitator
           </button>
        </div>

        <div className="mt-12 opacity-5 pointer-events-none absolute right-0">
           <HelpCircle className="w-64 h-64" />
        </div>
      </main>
      <BottomNav />
    </div>
  );
};
