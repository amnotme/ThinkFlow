
import React, { useState, useEffect } from 'react';
import { Thought, TagType } from '../types';
import { TAGS, ICONS } from '../constants';

interface ThoughtModalProps {
  thought: Thought;
  onSave: (updated: Thought) => void;
  onClose: () => void;
}

const ThoughtModal: React.FC<ThoughtModalProps> = ({ thought, onSave, onClose }) => {
  const [text, setText] = useState(thought.text);
  const [tag, setTag] = useState<TagType>(thought.tag);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ ...thought, text: text.trim(), tag });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-xl font-bold">Edit Thought</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full">
            <ICONS.X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Content</label>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[150px] bg-slate-50 dark:bg-slate-900 rounded-2xl p-4 border-none focus:ring-2 focus:ring-[#6C63FF] text-lg resize-none"
              placeholder="What's changing?"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Category</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.filter(t => t.name !== 'All').map(t => (
                <button
                  key={t.name}
                  onClick={() => setTag(t.name)}
                  className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${tag === t.name ? 'bg-[#6C63FF] text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>
          
          <div className="pt-2 text-xs text-slate-400">
            Created on {new Date(thought.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-3 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-700 active:scale-95 transition-transform"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!text.trim()}
            className="flex-1 py-3 bg-[#6C63FF] text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-transform disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThoughtModal;
