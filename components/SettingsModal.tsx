
import React from 'react';
import { ICONS } from '../constants';
import { Thought } from '../types';

interface SettingsModalProps {
  thoughts: Thought[];
  onClearAll: () => void;
  onClose: () => void;
  theme: 'light' | 'dark';
  onSetTheme: (theme: 'light' | 'dark') => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ thoughts, onClearAll, onClose, theme, onSetTheme }) => {
  const handleExport = () => {
    const text = thoughts.map(t => `[${new Date(t.createdAt).toLocaleString()}] (${t.tag}) ${t.pinned ? '[PINNED] ' : ''}\n${t.text}\n---\n`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thinkflow_export_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearWithConfirmation = () => {
    if (confirm("Are you sure you want to clear all thoughts? This cannot be undone.")) {
      onClearAll();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold">Settings</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
            <ICONS.X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Appearance</h4>
            <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl">
              <button 
                onClick={() => onSetTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${theme === 'light' ? 'bg-white shadow-sm font-bold' : 'text-slate-500'}`}
              >
                <ICONS.Sun className="w-4 h-4" /> Light
              </button>
              <button 
                onClick={() => onSetTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl transition-all ${theme === 'dark' ? 'bg-slate-800 shadow-sm font-bold' : 'text-slate-500'}`}
              >
                <ICONS.Moon className="w-4 h-4" /> Dark
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Data Management</h4>
            <div className="space-y-2">
              <button 
                onClick={handleExport}
                className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl hover:bg-slate-100 transition-colors"
              >
                <div className="text-left">
                  <p className="font-bold">Export Thoughts</p>
                  <p className="text-xs text-slate-500">Download your thoughts as a text file</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
                  ⬇️
                </div>
              </button>

              <button 
                onClick={clearWithConfirmation}
                className="w-full flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/10 rounded-2xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors"
              >
                <div className="text-left">
                  <p className="font-bold text-red-600">Clear Workspace</p>
                  <p className="text-xs text-red-500/80">Permanently delete all data</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
                  🗑️
                </div>
              </button>
            </div>
          </div>

          <div className="pt-4 text-center">
            <p className="text-xs text-slate-400">ThinkFlow v1.0.0</p>
            <p className="text-[10px] text-slate-400/60 mt-1 uppercase tracking-tighter">Handcrafted for Focused Minds</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
