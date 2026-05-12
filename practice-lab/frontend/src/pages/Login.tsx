import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { TopBar } from '../components/TopBar';
import { BrandLogo } from '../components/BrandLogo';
import { useAuth } from '../contexts/AuthContext';
import { useProfile } from '../contexts/ProfileContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { profile } = useProfile();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get('redirect') || '/hub';
  const showWelcome = queryParams.get('msg') === 'welcome';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login();
    navigate(redirectPath);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <TopBar title="Log In" showBack onBack={() => navigate('/hub')} />
      <main className="px-6 py-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm flex flex-col items-center gap-10"
        >
          <BrandLogo size="md" />

          <div className="text-center">
            <h2 className="font-serif text-3xl text-cpl-dark mb-2">
              {showWelcome ? `Welcome, ${profile.name}!` : 'Welcome back.'}
            </h2>
            <p className="text-gray-500 text-sm">
              {showWelcome 
                ? "Your persona is set. Sign in to save your progress and begin practicing." 
                : "Sign in to continue your growth journey."}
            </p>
          </div>

          <form className="w-full space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                type="email" 
                className="w-full p-4 rounded-xl border border-cpl-border focus:border-cpl-blue focus:ring-1 focus:ring-cpl-blue outline-none bg-white transition-all" 
                placeholder="Email address"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Password</label>
                <button type="button" className="text-xs font-bold text-cpl-blue hover:underline">Forgot password?</button>
              </div>
              <input 
                type="password" 
                className="w-full p-4 rounded-xl border border-cpl-border focus:border-cpl-blue focus:ring-1 focus:ring-cpl-blue outline-none bg-white transition-all" 
                placeholder="Password"
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-cpl-blue text-white font-bold py-4 rounded-xl shadow-md active:scale-[0.98] transition-all mt-4"
            >
              Log In
            </button>
          </form>

          <div className="w-full relative flex items-center justify-center">
             <div className="w-full border-t border-cpl-border"></div>
             <span className="bg-cpl-bg px-4 text-xs italic text-gray-400 absolute">or</span>
          </div>

          <button onClick={handleLogin} className="w-full py-4 border border-cpl-border rounded-xl flex items-center justify-center gap-3 font-bold text-sm bg-white hover:bg-gray-50 transition-all">
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Sign in with Google
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? <span className="font-bold text-cpl-blue cursor-pointer hover:underline">Sign up</span>
          </p>
        </motion.div>
      </main>

      <footer className="mt-auto px-6 py-8 border-t border-cpl-border flex flex-col items-center gap-4">
        <div className="flex gap-6 text-xs text-gray-500 font-serif">
          <button className="hover:text-cpl-blue">Privacy Policy</button>
          <button className="hover:text-cpl-blue">Terms of Service</button>
          <button className="hover:text-cpl-blue">Help Center</button>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-gray-300 mb-1">Version 1.0.4-stable</p>
          <p className="text-[10px] text-gray-400">© 2024 CPL Practice Lab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
