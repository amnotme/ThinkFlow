
import React from 'react';
import { User, Thought } from '../types';
import { ICONS } from '../constants';

interface ProfileViewProps {
  user: User;
  thoughts: Thought[];
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ user, thoughts, onLogout }) => {
  const userThoughts = thoughts.filter(t => t.userId === user.id);
  const publicCount = userThoughts.filter(t => t.isPublic).length;

  return (
    <div className="py-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img src={user.avatar} className="w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-800 border-4 border-[#6C63FF]/20 p-2 shadow-2xl shadow-indigo-500/10" />
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-full border-4 border-gray-50 dark:border-[#0F172A]">
            <ICONS.Check className="w-4 h-4" />
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black">@{user.username}</h2>
          <p className="text-slate-500 font-medium">Joined {new Date(user.joinedAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-3xl font-black text-[#6C63FF]">{userThoughts.length}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Thoughts</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
          <p className="text-3xl font-black text-emerald-500">{publicCount}</p>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Shared</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold px-2">Account Actions</h3>
        <button 
          onClick={onLogout}
          className="w-full flex items-center justify-between p-5 bg-red-50 dark:bg-red-900/10 rounded-3xl text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/20"
        >
          <span className="font-bold">Log out of session</span>
          <ICONS.Trash className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ProfileView;
