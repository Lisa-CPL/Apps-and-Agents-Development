import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProfileData {
  name: string;
  pronouns: string;
  bio: string;
  avatarUrl: string;
  memberSince: string;
}

interface ProfileContextType {
  profile: ProfileData;
  updateProfile: (updates: Partial<ProfileData>) => void;
}

const DEFAULT_PROFILE: ProfileData = {
  name: 'John Doe',
  pronouns: '',
  bio: 'Learning to cross lines and build bridges.',
  avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  memberSince: 'Oct 2023'
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(() => {
    const saved = localStorage.getItem('cpl_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('cpl_profile', JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
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
