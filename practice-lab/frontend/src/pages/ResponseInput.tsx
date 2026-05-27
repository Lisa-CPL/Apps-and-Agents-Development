import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { MINI_APPS } from '../constants';
import { motion } from 'motion/react';
import { Send, Sparkles, MessageCircle, MoreHorizontal } from 'lucide-react';

export const ResponseInput: React.FC = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState('');
  const app = MINI_APPS.find(a => a.id === appId);

  if (!app) return null;

  return (
    <div className="min-h-screen bg-transparent flex flex-col">
      <TopBar title="Your Response" showBack onBack={() => navigate(`/practice/${appId}/scenario`)} />
      
      <main className="flex-1 px-6 pt-6 pb-24 overflow-y-auto">
         <div className="bg-white rounded-2xl p-4 border border-cpl-border mb-6 border-l-4 border-l-cpl-red/50 shadow-sm opacity-60">
            <p className="text-xs italic text-gray-500 font-lora">"I just don't see how your proposal helps anyone except the people at the top..."</p>
         </div>

         <div className="mb-6 flex justify-between items-center px-1">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type your response</h3>
            <div className="flex items-center gap-2">
               <span className="text-[10px] font-bold text-cpl-blue bg-blue-50 px-2 py-0.5 rounded">TIPS ACTIVE</span>
               <Sparkles className="w-3 h-3 text-cpl-amber" />
            </div>
         </div>

         <motion.div 
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="relative mb-8"
         >
            <textarea 
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="w-full h-48 bg-white border border-cpl-border rounded-3xl p-6 text-sm font-medium shadow-sm focus:ring-4 focus:ring-cpl-blue/5 focus:border-cpl-blue outline-none transition-all resize-none leading-relaxed"
              placeholder="How would you respond to Alex?"
            />
            <div className="absolute top-[-10px] right-6 bg-white px-3 py-1 rounded-full border border-cpl-border shadow-sm flex items-center gap-2">
               <motion.div 
                 animate={{ 
                   scale: response.length > 0 ? [1, 1.2, 1] : 1,
                   backgroundColor: response.length > 0 ? "#1E4FA3" : "#9CA3AF"
                 }}
                 transition={{ repeat: response.length > 0 ? Infinity : 0, duration: 1.5 }}
                 className="w-2 h-2 rounded-full" 
               />
               <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                 {response.length > 0 ? 'Analyzing Drift' : 'Ready for input'}
               </span>
            </div>
            <div className="absolute bottom-4 right-6 text-[10px] font-bold text-gray-300">
              {response.length} characters
            </div>
         </motion.div>

         <div className="bg-white p-5 rounded-2xl border border-cpl-border border-b-4 border-b-cpl-blue/20">
            <div className="flex items-center gap-2 mb-3">
               <Sparkles className="w-4 h-4 text-cpl-amber" />
               <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pro Tip</h4>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">
               Try beginning with "I hear your concern about who this benefits..." to validate without taking sides.
            </p>
         </div>
      </main>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl p-6 bg-white border-t border-cpl-border transition-all duration-300">
        <button 
          disabled={!response.trim()}
          onClick={() => navigate(`/practice/${appId}/feedback`)}
          className={`w-full font-bold py-5 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all ${
            response.trim() 
              ? 'bg-cpl-blue text-white active:scale-[0.98]' 
              : 'bg-gray-100 text-gray-300 cursor-not-allowed'
          }`}
        >
          Submit Response
          <Send className={`w-4 h-4 ${response.trim() ? 'fill-current' : ''}`} />
        </button>
      </div>
    </div>
  );
};
