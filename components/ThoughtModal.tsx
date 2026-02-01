
import React, { useState, useEffect } from 'react';
import { Thought, TagType, User } from '../types';
import { TAGS, ICONS } from '../constants';

interface ThoughtModalProps {
  thought: Thought;
  onSave: (updated: Thought) => void;
  onClose: () => void;
  friends: User[];
}

const ThoughtModal: React.FC<ThoughtModalProps> = ({ thought, onSave, onClose, friends }) => {
  const [text, setText] = useState(thought.text);
  const [tag, setTag] = useState<TagType>(thought.tag);
  const [sharedIds, setSharedIds] = useState<string[]>(thought.sharedWithFriendIds || []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const handleSave = () => {
    if (!text.trim()) return;
    onSave({ ...thought, text: text.trim(), tag, sharedWithFriendIds: sharedIds });
  };

  const toggleFriendSharing = (id: string) => {
    setSharedIds(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h3 className="text-2xl font-black">Edit Thought</h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-colors">
            <ICONS.X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Content</label>
            <textarea
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full min-h-[160px] bg-slate-50 dark:bg-slate-900 rounded-[2rem] p-6 border-none focus:ring-4 focus:ring-primary/20 text-lg font-medium leading-relaxed resize-none transition-all"
              placeholder="Refine your thought..."
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {TAGS.filter(t => t.name !== 'All').map(t => (
                <button
                  key={t.name}
                  onClick={() => setTag(t.name)}
                  className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all border ${tag === t.name ? 'bg-primary border-primary text-white shadow-xl shadow-indigo-500/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary'}`}
                >
                  {t.icon} {t.name}
                </button>
              ))}
            </div>
          </div>

          {friends.length > 0 && (
            <div className="space-y-4">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Direct Sharing</label>
              <div className="grid grid-cols-2 gap-3">
                {friends.map(friend => (
                  <button
                    key={friend.id}
                    onClick={() => toggleFriendSharing(friend.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${sharedIds.includes(friend.id) ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/50' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'}`}
                  >
                    <img src={friend.avatar} className="w-8 h-8 rounded-full" />
                    <span className={`text-xs font-bold ${sharedIds.includes(friend.id) ? 'text-emerald-600' : ''}`}>{friend.username}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-8 bg-slate-50 dark:bg-slate-900/50 flex gap-4">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black rounded-2xl border border-slate-200 dark:border-slate-700 active:scale-95 transition-all shadow-sm"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            disabled={!text.trim()}
            className="flex-1 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-indigo-500/30 active:scale-95 transition-all disabled:opacity-50"
          >
            Save Flow
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThoughtModal;
