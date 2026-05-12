import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '../components/TopBar';
import { useProfile } from '../contexts/ProfileContext';
import { useAuth } from '../contexts/AuthContext';
import { Camera, Check } from 'lucide-react';
import { motion } from 'motion/react';

const AVATAR_OPTIONS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1552058544-1271d756a184?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1544717297-fa154da09f9b?auto=format&fit=crop&q=80&w=200'
];

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile } = useProfile();
  const { isAuthenticated } = useAuth();
  
  const [name, setName] = useState(profile.name);
  const [pronouns, setPronouns] = useState(profile.pronouns);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);

  const handleSave = () => {
    updateProfile({ name, pronouns, bio, avatarUrl });
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login?msg=welcome');
    }
  };

  return (
    <div className="min-h-screen bg-cpl-bg pb-12">
      <TopBar title="Edit Profile" showBack onBack={() => navigate('/profile')} />
      
      <main className="px-6 py-8">
        <div className="flex flex-col items-center mb-10">
          <div className="relative group cursor-pointer">
            <div className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
              <img src={avatarUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="text-white w-8 h-8" />
            </div>
          </div>
          <p className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Select Avatar</p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {AVATAR_OPTIONS.map((url) => (
              <button 
                key={url}
                onClick={() => setAvatarUrl(url)}
                className={`w-12 h-12 rounded-full border-2 overflow-hidden transition-all ${avatarUrl === url ? 'border-cpl-blue scale-110 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
              >
                <img src={url} alt="Option" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white border border-cpl-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cpl-blue/20 transition-all font-bold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Preferred Pronouns</label>
            <div className="flex flex-wrap gap-2">
              {['he/him', 'she/her', 'they/them', 'Other'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPronouns(p === 'Other' ? '' : p)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                    (pronouns === p) || (p === 'Other' && pronouns && !['he/him', 'she/her', 'they/them'].includes(pronouns))
                      ? 'bg-cpl-blue text-white border-cpl-blue'
                      : 'bg-white text-gray-500 border-cpl-border hover:border-gray-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {!['he/him', 'she/her', 'they/them'].includes(pronouns) && pronouns !== '' && (
              <input 
                type="text" 
                value={pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="Enter custom pronouns"
                className="w-full bg-white border border-cpl-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cpl-blue/20 transition-all mt-2"
              />
            )}
            {pronouns === '' && (
              <input 
                type="text" 
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="Enter custom pronouns"
                className="w-full bg-white border border-cpl-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cpl-blue/20 transition-all mt-2"
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Brief Bio</label>
            <textarea 
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell others about yourself..."
              rows={4}
              className="w-full bg-white border border-cpl-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cpl-blue/20 transition-all resize-none"
            />
            <p className="text-[10px] text-gray-400 text-right italic">Max 150 characters recommended</p>
          </div>

          <motion.button 
            whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="w-full bg-cpl-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-cpl-blue/20 mt-4"
          >
            <Check className="w-5 h-5" /> Save Changes
          </motion.button>
        </div>
      </main>
    </div>
  );
};
