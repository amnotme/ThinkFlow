
import React, { useRef } from 'react';
import { ICONS } from '../constants';
import { Thought } from '../types';

interface SettingsModalProps {
  thoughts: Thought[];
  onClearAll: () => void;
  onImport: (thoughts: Thought[]) => void;
  onClose: () => void;
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ thoughts, onClearAll, onImport, onClose, theme, onSetTheme }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(thoughts, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        onImport(json);
      } catch (err) {
        alert("Invalid flow file. Please check your backup.");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const clearWithConfirmation = () => {
    if (confirm("Are you sure you want to clear all thoughts? This cannot be undone.")) {
      onClearAll();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-2xl font-black">Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors haptic">
            <ICONS.X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Appearance</h4>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1.5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800">
              <button 
                onClick={() => onSetTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all haptic ${theme === 'light' ? 'bg-white dark:bg-slate-700 shadow-xl font-black' : 'text-slate-500'}`}
              >
                <ICONS.Sun className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => onSetTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl transition-all haptic ${theme === 'dark' ? 'bg-white dark:bg-slate-700 shadow-xl font-black' : 'text-slate-500'}`}
              >
                <ICONS.Moon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Data Portability</h4>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleExport}
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 haptic hover:border-primary/50"
              >
                <span className="text-xl">📤</span>
                <span className="text-[10px] font-black uppercase">Export</span>
              </button>
              <button 
                onClick={handleImportClick}
                className="flex flex-col items-center gap-2 p-4 bg-slate-50 dark:bg-slate-900 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 haptic hover:border-primary/50"
              >
                <span className="text-xl">📥</span>
                <span className="text-[10px] font-black uppercase">Import</span>
                <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept=".json" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Danger Zone</h4>
            <button 
              onClick={clearWithConfirmation}
              className="w-full flex items-center justify-between p-5 bg-red-50 dark:bg-red-900/10 rounded-[1.5rem] hover:bg-red-100 dark:hover:bg-red-900/20 transition-all border border-red-100 dark:border-red-900/20 haptic"
            >
              <div className="text-left">
                <p className="font-bold text-red-600">Reset Local Data</p>
                <p className="text-[10px] text-red-500/80 font-bold uppercase mt-0.5">Wipe all thoughts</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                <ICONS.Trash className="w-5 h-5" />
              </div>
            </button>
          </div>

          <div className="pt-4 text-center space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">ThinkFlow Engine v1.2.0</p>
            <p className="text-[9px] text-slate-400/60 uppercase">Personal Privacy First</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
