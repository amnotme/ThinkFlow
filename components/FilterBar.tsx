
import React from 'react';
import { TagType } from '../types';
import { TAGS } from '../constants';

interface FilterBarProps {
  activeTag: TagType;
  onTagSelect: (tag: TagType) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeTag, onTagSelect }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-6 custom-scrollbar sticky top-16 bg-gray-50/95 dark:bg-[#0F172A]/95 backdrop-blur-md z-30 -mx-4 px-4 transition-colors">
      {TAGS.map(tag => (
        <button
          key={tag.name}
          onClick={() => onTagSelect(tag.name)}
          className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${activeTag === tag.name 
            ? 'bg-primary border-primary text-white shadow-xl shadow-indigo-500/20 scale-105' 
            : 'bg-white dark:bg-slate-800 border-white dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-primary/20 hover:text-primary shadow-sm'}`}
        >
          <span className="text-sm">{tag.icon}</span>
          <span>{tag.name}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
