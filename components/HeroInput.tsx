
import React, { useState, useRef, useEffect } from 'react';
import { TagType } from '../types';
import { TAGS, ICONS } from '../constants';

interface HeroInputProps {
  onAdd: (text: string, tag: TagType) => void;
}

const HeroInput: React.FC<HeroInputProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [selectedTag, setSelectedTag] = useState<TagType>('Ideas');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = () => {
    if (!text.trim()) return;
    onAdd(text.trim(), selectedTag);
    setText('');
    setIsExpanded(false);
    // Visual feedback "haptic style" flash could be implemented with a state-driven class
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
        className={`bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 transition-all duration-300 ${isExpanded ? 'ring-2 ring-[#6C63FF]/20' : ''}`}
      >
        <div className="p-4">
          <textarea
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            onKeyDown={handleKeyDown}
            placeholder="What's on your mind?"
            className="w-full bg-transparent border-none focus:ring-0 text-lg resize-none placeholder:text-slate-400 min-h-[60px] max-h-[300px]"
            rows={isExpanded ? 3 : 1}
          />
          
          <div className={`flex items-center justify-between mt-2 overflow-hidden transition-all duration-300 ${isExpanded ? 'h-10 opacity-100' : 'h-0 opacity-0'}`}>
            <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar">
              {TAGS.filter(t => t.name !== 'All').map(tag => (
                <button
                  key={tag.name}
                  onClick={() => setSelectedTag(tag.name)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${selectedTag === tag.name ? 'bg-[#6C63FF] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'}`}
                >
                  {tag.icon} {tag.name}
                </button>
              ))}
            </div>
            
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="ml-2 w-10 h-10 flex items-center justify-center rounded-full bg-[#6C63FF] text-white disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform shrink-0 shadow-md"
            >
              <ICONS.Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
      
      {!isExpanded && (
        <p className="text-center text-xs text-slate-400 mt-3 animate-pulse">
          Tip: Press Enter to capture instantly
        </p>
      )}
    </div>
  );
};

export default HeroInput;
