
import React, { useState } from 'react';
import { Thought } from '../types';
import { TAGS, ICONS } from '../constants';

interface ThoughtCardProps {
  thought: Thought;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

const ThoughtCard: React.FC<ThoughtCardProps> = ({ thought, onEdit, onDelete, onTogglePin }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const tagConfig = TAGS.find(t => t.name === thought.tag) || TAGS[0];

  const formatTime = (ts: number) => {
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className={`group relative bg-white dark:bg-slate-800 p-5 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-all hover:shadow-md hover:border-indigo-200 dark:hover:border-indigo-900/50 animate-in slide-in-from-bottom-2 ${thought.pinned ? 'ring-2 ring-indigo-500/10' : ''}`}>
      <div className="flex justify-between items-start mb-3">
        <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagConfig.colorClass}`}>
          {tagConfig.icon} {tagConfig.name}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={onTogglePin}
            className={`p-1.5 rounded-full transition-colors ${thought.pinned ? 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30' : 'text-slate-300 hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
          >
            <ICONS.Pin className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-slate-800 dark:text-slate-200 text-lg leading-relaxed whitespace-pre-wrap break-words">
        {thought.text}
      </p>

      <div className="mt-5 pt-4 border-t border-slate-50 dark:border-slate-700 flex items-center justify-between">
        <span className="text-xs text-slate-400 font-medium">
          {formatTime(thought.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          {isDeleting ? (
            <div className="flex items-center gap-2 animate-in slide-in-from-right-2">
              <span className="text-xs font-bold text-red-500">Delete?</span>
              <button 
                onClick={onDelete}
                className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <ICONS.Check className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsDeleting(false)}
                className="p-1.5 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-lg hover:bg-slate-200"
              >
                <ICONS.X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <button 
                onClick={onEdit}
                className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                aria-label="Edit"
              >
                <ICONS.Edit className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setIsDeleting(true)}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-slate-700 rounded-xl transition-all"
                aria-label="Delete"
              >
                <ICONS.Trash className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ThoughtCard;
