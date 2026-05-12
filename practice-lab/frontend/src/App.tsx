/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
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
          <div className="max-w-[480px] mx-auto min-h-screen shadow-2xl bg-white/90 backdrop-blur-sm overflow-x-hidden relative">
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  );
}
