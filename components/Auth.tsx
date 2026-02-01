
import React, { useState } from 'react';
import { User } from '../types';
import { ICONS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin, theme, onToggleTheme }) => {
  const [username, setUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().length < 2) return;
    
    const newUser: User = {
      id: crypto.randomUUID(),
      username: username.trim(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      joinedAt: Date.now(),
    };
    onLogin(newUser);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-gray-100 transition-colors">
      <button 
        onClick={onToggleTheme}
        className="absolute top-8 right-8 p-3 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700"
      >
        {theme === 'light' ? <ICONS.Moon className="w-5 h-5" /> : <ICONS.Sun className="w-5 h-5" />}
      </button>

      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-[#6C63FF] rounded-3xl mx-auto flex items-center justify-center text-white text-4xl font-black italic shadow-xl shadow-indigo-500/20">T</div>
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-[#6C63FF] to-indigo-400 bg-clip-text text-transparent">ThinkFlow</h1>
          <p className="text-slate-500 dark:text-slate-400">Capture your flow, share your light.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/5 border border-slate-100 dark:border-slate-700 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
            <input 
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. Dreamer2025"
              className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border-none focus:ring-2 focus:ring-[#6C63FF] text-lg font-medium transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-[#6C63FF] text-white font-black rounded-2xl shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            Enter the Flow <ICONS.Check className="w-5 h-5" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-400 leading-relaxed">
          By entering, you start your personal local session.<br/>No data leaves your device unless you choose to share.
        </p>
      </div>
    </div>
  );
};

export default Auth;
