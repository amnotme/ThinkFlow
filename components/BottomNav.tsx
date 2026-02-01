
import React from 'react';
import { ICONS } from '../constants';
import { View } from '../types';

interface BottomNavProps {
  activeView: View;
  onSetView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, onSetView }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-100 dark:border-slate-800 safe-bottom">
      <div className="max-w-2xl mx-auto px-6 h-16 md:h-20 flex items-center justify-around safe-bottom-mb">
        <button 
          onClick={() => onSetView('feed')}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === 'feed' ? 'text-[#6C63FF]' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.Home className={`w-6 h-6 transition-transform ${activeView === 'feed' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Home</span>
        </button>

        <button 
          onClick={() => onSetView('stats')}
          className={`flex flex-col items-center gap-1 transition-all ${activeView === 'stats' ? 'text-[#6C63FF]' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.Stats className={`w-6 h-6 transition-transform ${activeView === 'stats' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Stats</span>
        </button>

        <button 
          onClick={() => onSetView('settings')}
          className={`md:hidden flex flex-col items-center gap-1 transition-all ${activeView === 'settings' ? 'text-[#6C63FF]' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <ICONS.Settings className={`w-6 h-6 transition-transform ${activeView === 'settings' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-bold uppercase tracking-tight">Setup</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
