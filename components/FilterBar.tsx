
import React from 'react';
import { TagType } from '../types';
import { TAGS } from '../constants';

interface FilterBarProps {
  activeTag: TagType;
  onTagSelect: (tag: TagType) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ activeTag, onTagSelect }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto py-4 custom-scrollbar sticky top-16 bg-gray-50/80 dark:bg-[#1A1A2E]/80 backdrop-blur-sm z-30">
      {TAGS.map(tag => (
        <button
          key={tag.name}
          onClick={() => onTagSelect(tag.name)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-semibold transition-all duration-200 border ${activeTag === tag.name 
            ? 'bg-[#6C63FF] border-[#6C63FF] text-white shadow-md' 
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-[#6C63FF]'}`}
        >
          <span>{tag.icon}</span>
          <span>{tag.name}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
