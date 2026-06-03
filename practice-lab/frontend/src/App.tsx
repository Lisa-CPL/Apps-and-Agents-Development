/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';

// Import Pages
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';
import { Hub } from './pages/Hub';
import { Orientation } from './pages/Orientation';
import { Scenario } from './pages/Scenario';
import { ResponseInput } from './pages/ResponseInput';
import { Feedback } from './pages/Feedback';
import { NextAction } from './pages/NextAction';
import { LabComplete } from './pages/LabComplete';
import { Progress } from './pages/Progress';
import { Help } from './pages/Help';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { EditProfile } from './pages/EditProfile';
import { Community } from './pages/Community';
import { ProfileProvider } from './contexts/ProfileContext';
import { AuthProvider } from './contexts/AuthContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageWrapper><Splash /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/hub" element={<PageWrapper><Hub /></PageWrapper>} />
        <Route path="/progress" element={<PageWrapper><Progress /></PageWrapper>} />
        <Route path="/help" element={<PageWrapper><Help /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
        <Route path="/profile/edit" element={<PageWrapper><EditProfile /></PageWrapper>} />
        <Route path="/settings" element={<PageWrapper><Settings /></PageWrapper>} />
        <Route path="/community" element={<PageWrapper><Community /></PageWrapper>} />
        
        {/* Practice Flow */}
        <Route path="/practice/:appId" element={<PageWrapper><Orientation /></PageWrapper>} />
        <Route path="/practice/:appId/scenario" element={<PageWrapper><Scenario /></PageWrapper>} />
        <Route path="/practice/:appId/response" element={<PageWrapper><ResponseInput /></PageWrapper>} />
        <Route path="/practice/:appId/feedback" element={<PageWrapper><Feedback /></PageWrapper>} />
        <Route path="/practice/:appId/next" element={<PageWrapper><NextAction /></PageWrapper>} />
        <Route path="/practice/:appId/complete" element={<PageWrapper><LabComplete /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.23, 1, 0.32, 1] // More organic easing
      }}
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="w-full max-w-4xl mx-auto min-h-screen shadow-2xl bg-white/90 backdrop-blur-sm overflow-x-hidden relative transition-all duration-300">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  );
}
