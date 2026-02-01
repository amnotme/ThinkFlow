
import React from 'react';
import { ICONS } from '../constants';

interface AuthProps {
  onSuccess: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  error?: string | null;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, theme, onToggleTheme, error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-50 dark:bg-[#0F172A] text-slate-900 dark:text-gray-100 transition-all duration-300">
      <button 
        onClick={onToggleTheme}
        className="absolute top-8 right-8 p-3 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 hover:scale-110 active:scale-95 transition-all z-50"
      >
        {theme === 'light' ? <ICONS.Moon className="w-5 h-5 text-slate-600" /> : <ICONS.Sun className="w-5 h-5 text-amber-400" />}
      </button>

      <div className="w-full max-w-md space-y-10 animate-in fade-in zoom-in-95 duration-700 text-center">
        <div className="space-y-6">
          <div className="w-24 h-24 bg-primary rounded-[2.5rem] mx-auto flex items-center justify-center text-white text-5xl font-black italic shadow-2xl shadow-indigo-500/30">T</div>
          <div className="space-y-2">
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">ThinkFlow</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Cloud mental workspace.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-indigo-500/5 space-y-8">
          <div className="space-y-6">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Secure Cloud Sync</p>
            
            <button 
              onClick={onSuccess}
              className="w-full flex items-center justify-center gap-4 py-4 bg-slate-900 dark:bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              <svg className="w-6 h-6" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-red-600 dark:text-red-400 text-sm font-medium animate-in slide-in-from-top-2">
              <p>{error}</p>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto uppercase font-bold tracking-wider">
          Your thoughts are private by default.
        </p>
      </div>
    </div>
  );
};

export default Auth;
