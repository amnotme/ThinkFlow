
import React, { useEffect, useRef } from 'react';
import { ICONS } from '../constants';

interface AuthProps {
  onSuccess: (userData: { email: string, name: string, picture: string }) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const Auth: React.FC<AuthProps> = ({ onSuccess, theme, onToggleTheme }) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogle = () => {
      if (!(window as any).google) {
        setTimeout(initializeGoogle, 200);
        return;
      }

      try {
        (window as any).google.accounts.id.initialize({
          client_id: "680879505876-0f8n3716oohv3o1u0016m1823o1u0016.apps.googleusercontent.com",
          callback: (response: any) => {
            const payload = JSON.parse(atob(response.credential.split('.')[1]));
            onSuccess({
              email: payload.email,
              name: payload.name,
              picture: payload.picture,
            });
          },
        });

        if (googleButtonRef.current) {
          (window as any).google.accounts.id.renderButton(googleButtonRef.current, {
            theme: theme === 'dark' ? 'filled_blue' : 'outline',
            size: 'large',
            width: 280,
            shape: 'pill'
          });
        }
      } catch (e) {
        console.warn("Google Auth initialization failed (likely due to invalid Client ID). Use Demo mode instead.");
      }
    };

    initializeGoogle();
  }, [theme]);

  const demoSignIn = (name: string) => {
    onSuccess({
      email: `${name.toLowerCase()}@demo.local`,
      name: name,
      picture: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
    });
  };

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
            <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Your mental workspace, synced.</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-2xl shadow-indigo-500/5 space-y-8">
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Connect your account</p>
            <div className="flex justify-center">
              <div ref={googleButtonRef} className="rounded-full overflow-hidden transition-all duration-300"></div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-700"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-300 dark:text-slate-600 bg-white dark:bg-slate-800 px-4">or enter as a guest</div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => demoSignIn('Alex')}
              className="py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >
              👤 Alex
            </button>
            <button 
              onClick={() => demoSignIn('Jordan')}
              className="py-4 bg-slate-50 dark:bg-slate-900 rounded-2xl font-bold hover:bg-slate-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
            >
              👤 Jordan
            </button>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto">
          Sign in to secure your thoughts. Use "Guest" to test friendships and sharing locally.
        </p>
      </div>
    </div>
  );
};

export default Auth;
