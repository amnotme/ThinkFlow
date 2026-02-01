
import React from 'react';
import { Thought } from '../types';
import ThoughtCard from './ThoughtCard';

interface ThoughtListProps {
  thoughts: Thought[];
  onEdit: (thought: Thought) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
}

const ThoughtList: React.FC<ThoughtListProps> = ({ thoughts, onEdit, onDelete, onTogglePin }) => {
  if (thoughts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-4xl">
          🍃
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">Quiet in here...</h3>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-[250px]">Try clearing your mind by capturing your first thought above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {thoughts.map((thought) => (
        <ThoughtCard 
          key={thought.id} 
          thought={thought} 
          onEdit={() => onEdit(thought)}
          onDelete={() => onDelete(thought.id)}
          onTogglePin={() => onTogglePin(thought.id)}
        />
      ))}
    </div>
  );
};

export default ThoughtList;
