
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Thought, TagType, View, User } from './types';
import { TAGS, ICONS } from './constants';
import Header from './components/Header';
import HeroInput from './components/HeroInput';
import FilterBar from './components/FilterBar';
import ThoughtList from './components/ThoughtList';
import BottomNav from './components/BottomNav';
import ThoughtModal from './components/ThoughtModal';
import SettingsModal from './components/SettingsModal';
import Auth from './components/Auth';
import ProfileView from './components/ProfileView';

const STORAGE_KEY = 'thinkflow_thoughts_v2';
const USER_KEY = 'thinkflow_user';
const THEME_KEY = 'thinkflow_theme';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [activeTag, setActiveTag] = useState<TagType>('All');
  const [activeView, setActiveView] = useState<View>('feed');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  // Initialize data
  useEffect(() => {
    const savedUser = localStorage.getItem(USER_KEY);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    const savedThoughts = localStorage.getItem(STORAGE_KEY);
    if (savedThoughts) {
      setThoughts(JSON.parse(savedThoughts));
    }

    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  // Theme effect
  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Sync thoughts to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(thoughts));
  }, [thoughts]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(USER_KEY);
    setActiveView('feed');
  };

  const addThought = useCallback((text: string, tag: TagType) => {
    if (!currentUser) return;
    const newThought: Thought = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      authorName: currentUser.username,
      text,
      tag,
      createdAt: Date.now(),
      pinned: false,
      isPublic: false,
    };
    setThoughts(prev => [newThought, ...prev]);
  }, [currentUser]);

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

  const togglePublic = useCallback((id: string) => {
    setThoughts(prev => prev.map(t => t.id === id ? { ...t, isPublic: !t.isPublic } : t));
  }, []);

  const filteredThoughts = useMemo(() => {
    let list = thoughts;
    
    if (activeView === 'community') {
      list = list.filter(t => t.isPublic);
    } else {
      // Feed view - only current user's thoughts
      list = list.filter(t => t.userId === currentUser?.id);
    }

    if (activeTag !== 'All') {
      list = list.filter(t => t.tag === activeTag);
    }

    return [...list].sort((a, b) => {
      if (a.pinned && !b.pinned && activeView !== 'community') return -1;
      if (!a.pinned && b.pinned && activeView !== 'community') return 1;
      return b.createdAt - a.createdAt;
    });
  }, [thoughts, activeTag, activeView, currentUser]);

  if (!currentUser) {
    return <Auth onLogin={handleLogin} theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-slate-900 dark:text-gray-100 transition-colors duration-300 pb-24 md:pb-12 md:flex md:flex-col items-center">
      <Header 
        theme={theme} 
        user={currentUser}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
        onOpenSettings={() => setShowSettings(true)} 
      />
      
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
              onTogglePublic={togglePublic}
              currentUserId={currentUser.id}
            />
          </>
        )}

        {activeView === 'community' && (
          <div className="pt-4">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <ICONS.Community className="text-[#6C63FF]" /> Public Stream
            </h2>
            <ThoughtList 
              thoughts={filteredThoughts} 
              onEdit={setEditingThought} 
              onDelete={deleteThought} 
              onTogglePin={togglePin} 
              onTogglePublic={togglePublic}
              currentUserId={currentUser.id}
              isCommunityView
            />
          </div>
        )}

        {activeView === 'stats' && (
          <div className="py-8 space-y-6">
            <h2 className="text-2xl font-bold">Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Your Thoughts</p>
                <p className="text-3xl font-bold text-[#6C63FF]">{thoughts.filter(t => t.userId === currentUser.id).length}</p>
              </div>
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                <p className="text-sm text-slate-500 dark:text-slate-400">Public Shared</p>
                <p className="text-3xl font-bold text-emerald-500">{thoughts.filter(t => t.userId === currentUser.id && t.isPublic).length}</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'profile' && (
          <ProfileView user={currentUser} thoughts={thoughts} onLogout={handleLogout} />
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
