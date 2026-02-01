
import React from 'react';
import { ICONS } from '../constants';
import { User } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  user: User;
  onToggleTheme: () => void;
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, user, onToggleTheme, onOpenSettings }) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 safe-top">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#6C63FF] rounded-lg flex items-center justify-center text-white font-black italic">T</div>
          <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-[#6C63FF] to-indigo-400 bg-clip-text text-transparent">ThinkFlow</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-2 mr-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            <img src={user.avatar} className="w-5 h-5 rounded-full" />
            <span className="text-xs font-bold hidden sm:inline">@{user.username}</span>
          </div>
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Toggle Theme"
          >
            {theme === 'light' ? <ICONS.Moon className="w-5 h-5 text-slate-600" /> : <ICONS.Sun className="w-5 h-5 text-amber-400" />}
          </button>
          <button 
            onClick={onOpenSettings}
            className="hidden md:flex p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Settings"
          >
            <ICONS.Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
