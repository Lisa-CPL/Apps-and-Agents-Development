import React, { createContext, useContext, useState, useEffect } from 'react';

interface CompletedLab {
  id: string;
  appId: string;
  score: number;
  date: string;
  duration: string;
}

interface ProfileData {
  name: string;
  pronouns: string;
  bio: string;
  avatarUrl: string;
  memberSince: string;
  xp: number;
  completedLabs: CompletedLab[];
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
  completeLab: (appId: string, score: number, duration: string) => void;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'John Doe',
  pronouns: '',
  bio: 'Learning to cross lines and build bridges.',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  memberSince: 'Oct 2023',
  xp: 0,
  completedLabs: []
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('cpl_profile');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrating old profiles to include new fields if they don't exist
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        completedLabs: parsed.completedLabs || [],
        xp: parsed.xp || 0
      };
    }
    return DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('cpl_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const completeLab = (appId: string, score: number, duration: string) => {
    const newLab: CompletedLab = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      score,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration
    };

    setProfile(prev => ({
      ...prev,
      xp: prev.xp + 240, // Base XP as seen in UI
      completedLabs: [newLab, ...prev.completedLabs]
    }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, completeLab }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
