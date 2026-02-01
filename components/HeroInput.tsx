
import React, { useState, useRef } from 'react';
import { TagType } from '../types';
import { TAGS, ICONS } from '../constants';

interface HeroInputProps {
  onAdd: (text: string, tag: TagType) => void;
}

const HeroInput: React.FC<HeroInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagType>('Ideas');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [flash, setFlash] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;
    setIsCapturing(true);
    setTimeout(() => {
      onAdd(text.trim(), selectedTag);
      setText('');
      setIsExpanded(false);
      setIsCapturing(false);
      setFlash(true);
      setTimeout(() => setFlash(false), 600);
    }, 400);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="mt-4 mb-8">
      <div 
        className={`bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-700 transition-all duration-500 ${isExpanded ? 'ring-4 ring-primary/10 -translate-y-1' : ''} ${isCapturing ? 'opacity-50 scale-95' : ''} ${flash ? 'animate-success-flash' : ''}`}
      >
        <div className="p-6">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="Capture your flow..."
            className="w-full bg-transparent border-none focus:ring-0 text-xl font-medium resize-none placeholder:text-slate-300 dark:placeholder:text-slate-600 min-h-[50px] max-h-[400px] leading-relaxed"
            rows={isExpanded ? 3 : 1}
          />
          
          <div className={`flex items-center justify-between mt-4 overflow-hidden transition-all duration-500 ${isExpanded ? 'h-12 opacity-100' : 'h-0 opacity-0'}`}>
            <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pr-4">
              {TAGS.filter(t => t.name !== 'All').map(tag => (
                <button
                  key={tag.name}
                  onClick={() => setSelectedTag(tag.name)}
                  className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border haptic ${selectedTag === tag.name ? 'bg-primary border-primary text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-700 text-slate-500 hover:border-primary/50'}`}
                >
                  {tag.icon} {tag.name}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || isCapturing}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 active:scale-90 transition-all shrink-0 shadow-xl shadow-indigo-500/30 haptic"
              aria-label="Capture Thought"
            >
              {isCapturing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <ICONS.Plus className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      
      {!isExpanded && (
        <p className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-slate-600 mt-4 animate-pulse">
          Click to start your session
        </p>
      )}
    </div>
  );
};

export default HeroInput;
