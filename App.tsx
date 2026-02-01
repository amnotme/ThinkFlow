
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Thought, TagType, View } from './types';
import { TAGS, ICONS } from './constants';
import Header from './components/Header';
import HeroInput from './components/HeroInput';
import FilterBar from './components/FilterBar';
import ThoughtList from './components/ThoughtList';
import BottomNav from './components/BottomNav';
import ThoughtModal from './components/ThoughtModal';
import SettingsModal from './components/SettingsModal';

const SEED_DATA: Thought[] = [
  { id: '1', text: 'Welcome to ThinkFlow! Tap the + to add your first thought.', tag: 'Inspiration', createdAt: Date.now() - 1000 * 60 * 5, pinned: true },
  { id: '2', text: 'Remember to buy groceries: Milk, Eggs, Bread.', tag: 'To Do', createdAt: Date.now() - 1000 * 60 * 60 * 2, pinned: false },
  { id: '3', text: 'Why do we dream?', tag: 'Questions', createdAt: Date.now() - 1000 * 60 * 60 * 24, pinned: false },
];

const STORAGE_KEY = 'thinkflow_thoughts';
const THEME_KEY = 'thinkflow_theme';

const App: React.FC = () => {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [activeTag, setActiveTag] = useState<TagType>('All');
  const [activeView, setActiveView] = useState<View>('feed');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize data
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setThoughts(JSON.parse(saved));
    } else {
      setThoughts(SEED_DATA);
    }

    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Sync with Local Storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  }, [thoughts]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addThought = useCallback((text: string, tag: TagType) => {
    const newThought: Thought = {
      id: crypto.randomUUID(),
      text,
      tag,
      createdAt: Date.now(),
      pinned: false,
    };
    setThoughts(prev => [newThought, ...prev]);
  }, []);

  const updateThought = useCallback((updated: Thought) => {
    setThoughts(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditingThought(null);
  }, []);

  const deleteThought = useCallback((id: string) => {
    setThoughts(prev => prev.filter(t => t.id !== id));
  }, []);

  const togglePin = useCallback((id: string) => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const filteredThoughts = useMemo(() => {
    let list = thoughts;
    if (activeTag !== 'All') {
      list = list.filter(t => t.tag === activeTag);
    }
    // Sort: Pinned first, then by createdAt descending
    return [...list].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.createdAt - a.createdAt;
    });
  }, [thoughts, activeTag]);

  const stats = useMemo(() => {
    const total = thoughts.length;
    const pinned = thoughts.filter(t => t.pinned).length;
    const tagCounts = TAGS.reduce((acc, tag) => {
        acc[tag.name] = thoughts.filter(t => t.tag === tag.name).length;
        return acc;
    }, {} as Record<string, number>);
    return { total, pinned, tagCounts };
  }, [thoughts]);

  return (
    <div className="min-h-screen pb-24 md:pb-12 md:flex md:flex-col items-center">
      <Header theme={theme} onToggleTheme={toggleTheme} onOpenSettings={() => setShowSettings(true)} />
      
      <main className="w-full max-w-2xl px-4 safe-top mt-16 animate-in fade-in duration-500">
        {activeView === 'feed' && (
          <>
            <HeroInput onAdd={addThought} />
            <FilterBar activeTag={activeTag} onTagSelect={setActiveTag} />
            <ThoughtList 
              thoughts={filteredThoughts} 
              onEdit={setEditingThought} 
              onDelete={deleteThought} 
              onTogglePin={togglePin} 
            />
          </>
        )}

        {activeView === 'stats' && (
          <div className="py-8 space-y-6">
            <h2 className="text-2xl font-bold">Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Thoughts</p>
                <p className="text-3xl font-bold text-[#6C63FF]">{stats.total}</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Pinned</p>
                <p className="text-3xl font-bold text-[#6C63FF]">{stats.pinned}</p>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
              <p className="text-sm font-semibold mb-4 text-slate-500 uppercase tracking-wider">By Category</p>
              <div className="space-y-3">
                {TAGS.filter(t => t.name !== 'All').map(tag => (
                  <div key={tag.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tag.icon}</span>
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <span className="text-lg font-bold">{stats.tagCounts[tag.name] || 0}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav activeView={activeView} onSetView={setActiveView} />

      {editingThought && (
        <ThoughtModal 
          thought={editingThought} 
          onSave={updateThought} 
          onClose={() => setEditingThought(null)} 
        />
      )}

      {showSettings && (
        <SettingsModal 
          thoughts={thoughts}
          onClearAll={() => setThoughts([])}
          onClose={() => setShowSettings(false)}
          theme={theme}
          onSetTheme={setTheme}
        />
      )}
    </div>
  );
};

export default App;
