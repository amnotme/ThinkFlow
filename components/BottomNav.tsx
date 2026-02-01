
import React from 'react';
import { ICONS } from '../constants';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onSetView: (view: View) => void;
  hasRequests?: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onSetView, hasRequests }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 safe-bottom">
      <div className="max-w-2xl mx-auto px-2 h-16 md:h-20 flex items-center justify-between safe-bottom-mb">
        <button 
          onClick={() => onSetView('feed')}
          className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeView === 'feed' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.Home className={`w-6 h-6 transition-transform ${activeView === 'feed' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Flow</span>
        </button>

        <button 
          onClick={() => onSetView('community')}
          className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeView === 'community' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.Community className={`w-6 h-6 transition-transform ${activeView === 'community' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Stream</span>
        </button>

        <button 
          onClick={() => onSetView('friends')}
          className={`flex-1 flex flex-col items-center gap-1 transition-all relative ${activeView === 'friends' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.Users className={`w-6 h-6 transition-transform ${activeView === 'friends' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Circle</span>
          {hasRequests && (
              <span className="absolute top-0 right-1/4 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#0F172A]"></span>
          )}
        </button>

        <button 
          onClick={() => onSetView('stats')}
          className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeView === 'stats' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.Stats className={`w-6 h-6 transition-transform ${activeView === 'stats' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Stats</span>
        </button>

        <button 
          onClick={() => onSetView('profile')}
          className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeView === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.User className={`w-6 h-6 transition-transform ${activeView === 'profile' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">You</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
