
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Thought, TagType, View, User, FriendRequest } from './types';
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
import FriendsView from './components/FriendsView';

const THOUGHTS_STORAGE_KEY = 'thinkflow_thoughts_v6';
const USERS_STORAGE_KEY = 'thinkflow_all_users_v6';
const CURRENT_USER_ID_KEY = 'thinkflow_current_user_id_v6';
const THEME_KEY = 'thinkflow_theme_v6';

const App: React.FC = () => {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [activeTag, setActiveTag] = useState<TagType>('All');
  const [activeView, setActiveView] = useState<View>('feed');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY) as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    
    let initialUsers: User[] = [];
    const savedUsers = localStorage.getItem(USERS_STORAGE_KEY);
    if (savedUsers) {
      initialUsers = JSON.parse(savedUsers);
    } else {
      const alex: User = {
        id: 'alex-uuid', email: 'alex@thinkflow.app', username: 'Alex', friends: [], friendRequests: [], joinedAt: Date.now() - 86400000 * 5,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
      };
      const jordan: User = {
        id: 'jordan-uuid', email: 'jordan@thinkflow.app', username: 'Jordan', friends: [], friendRequests: [], joinedAt: Date.now() - 86400000 * 2,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan'
      };
      initialUsers = [alex, jordan];
    }
    setAllUsers(initialUsers);

    const savedSessionId = localStorage.getItem(CURRENT_USER_ID_KEY);
    if (savedSessionId) setCurrentUserId(savedSessionId);

    const savedThoughts = localStorage.getItem(THOUGHTS_STORAGE_KEY);
    if (savedThoughts) {
      setThoughts(JSON.parse(savedThoughts));
    } else {
      setThoughts([
        { id: '1', userId: 'alex-uuid', authorName: 'Alex', text: 'This workspace is exactly what my brain needed. Total focus.', tag: 'Inspiration', createdAt: Date.now() - 3600000, pinned: false, isPublic: true },
        { id: '2', userId: 'jordan-uuid', authorName: 'Jordan', text: 'Questions for tomorrow:\n1. How to scale static apps?\n2. What is local-first data?', tag: 'Questions', createdAt: Date.now() - 7200000, pinned: false, isPublic: true },
        { id: '3', userId: 'alex-uuid', authorName: 'Alex', text: 'Finish the UI polish by tonight.', tag: 'To Do', createdAt: Date.now() - 10800000, pinned: false, isPublic: true }
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  useEffect(() => localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers)), [allUsers]);
  useEffect(() => localStorage.setItem(THOUGHTS_STORAGE_KEY, JSON.stringify(thoughts)), [thoughts]);
  useEffect(() => {
    if (currentUserId) localStorage.setItem(CURRENT_USER_ID_KEY, currentUserId);
    else localStorage.removeItem(CURRENT_USER_ID_KEY);
  }, [currentUserId]);

  const currentUser = useMemo(() => allUsers.find(u => u.id === currentUserId) || null, [allUsers, currentUserId]);

  const handleAuthSuccess = (userData: { email: string, name: string, picture: string }) => {
    setAllUsers(prev => {
      const existing = prev.find(u => u.email === userData.email);
      if (existing) {
        setCurrentUserId(existing.id);
        return prev;
      }
      const newUser: User = {
        id: crypto.randomUUID(),
        email: userData.email,
        username: userData.name,
        avatar: userData.picture,
        joinedAt: Date.now(),
        friends: [],
        friendRequests: []
      };
      setCurrentUserId(newUser.id);
      return [...prev, newUser];
    });
  };

  const handleImport = (importedThoughts: Thought[]) => {
    // Basic validation
    if (!Array.isArray(importedThoughts)) return;
    setThoughts(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const newOnes = importedThoughts.filter(t => !existingIds.has(t.id));
      return [...newOnes, ...prev];
    });
    alert(`Imported ${importedThoughts.length} thoughts!`);
  };

  const handleLogout = () => {
    setCurrentUserId(null);
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
      sharedWithFriendIds: [],
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

  const sendFriendRequest = (targetUserId: string) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === targetUserId) {
        if (u.friendRequests.some(r => r.fromId === currentUser.id)) return u;
        const newRequest: FriendRequest = {
          fromId: currentUser.id,
          fromName: currentUser.username,
          fromAvatar: currentUser.avatar,
          status: 'pending',
          timestamp: Date.now()
        };
        return { ...u, friendRequests: [...u.friendRequests, newRequest] };
      }
      return u;
    }));
  };

  const handleRequestResponse = (fromId: string, status: 'accepted' | 'declined') => {
    if (!currentUser) return;
    setAllUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const updatedRequests = u.friendRequests.filter(r => r.fromId !== fromId);
        const updatedFriends = status === 'accepted' ? Array.from(new Set([...u.friends, fromId])) : u.friends;
        return { ...u, friendRequests: updatedRequests, friends: updatedFriends };
      }
      if (u.id === fromId && status === 'accepted') {
        const updatedFriends = Array.from(new Set([...u.friends, currentUser.id]));
        return { ...u, friends: updatedFriends };
      }
      return u;
    }));
  };

  const filteredThoughts = useMemo(() => {
    let list = thoughts;
    if (activeView === 'community') {
      list = list.filter(t => t.isPublic);
    } else if (activeView === 'friends') {
      const friendIds = currentUser?.friends || [];
      list = list.filter(t => {
        const isFromFriend = friendIds.includes(t.userId);
        const isSpecificallyShared = t.sharedWithFriendIds?.includes(currentUser?.id || '');
        return isFromFriend && (t.isPublic || isSpecificallyShared);
      });
    } else {
      list = list.filter(t => t.userId === currentUser?.id);
    }

    if (activeTag !== 'All') {
      list = list.filter(t => t.tag === activeTag);
    }

    return [...list].sort((a, b) => {
      if (activeView === 'feed') {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
      }
      return b.createdAt - a.createdAt;
    });
  }, [thoughts, activeTag, activeView, currentUser]);

  if (!currentUser) {
    return <Auth onSuccess={handleAuthSuccess} theme={theme} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] text-slate-900 dark:text-gray-100 transition-colors duration-300 pb-24 md:pb-12 md:flex md:flex-col items-center">
      <Header theme={theme} user={currentUser} onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} onOpenSettings={() => setShowSettings(true)} />
      
      <main className="w-full max-w-2xl px-4 safe-top mt-16 animate-in fade-in duration-500">
        {activeView === 'feed' && (
          <>
            <HeroInput onAdd={addThought} />
            <FilterBar activeTag={activeTag} onTagSelect={setActiveTag} />
            <ThoughtList thoughts={filteredThoughts} onEdit={setEditingThought} onDelete={deleteThought} onTogglePin={togglePin} onTogglePublic={togglePublic} currentUserId={currentUser.id} />
          </>
        )}

        {activeView === 'community' && (
          <div className="pt-4">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <ICONS.Community className="text-primary" /> Stream
                </h2>
                <span className="text-[10px] font-black text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 uppercase tracking-widest">Public</span>
            </div>
            <ThoughtList 
              thoughts={filteredThoughts} onEdit={setEditingThought} onDelete={deleteThought} onTogglePin={togglePin} onTogglePublic={togglePublic} 
              currentUserId={currentUser.id} isCommunityView currentUserFriends={currentUser.friends} onSendFriendRequest={sendFriendRequest}
            />
          </div>
        )}

        {activeView === 'friends' && (
           <FriendsView user={currentUser} allUsers={allUsers} thoughts={filteredThoughts} onRespond={handleRequestResponse} onEditThought={setEditingThought} onTogglePin={togglePin} onTogglePublic={togglePublic} onDeleteThought={deleteThought} />
        )}

        {activeView === 'stats' && (
          <div className="py-8 space-y-6">
            <h2 className="text-2xl font-bold">Insights</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Personal</p>
                <p className="text-4xl font-black text-primary mt-2">{thoughts.filter(t => t.userId === currentUser.id).length}</p>
              </div>
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:scale-[1.02]">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Friends</p>
                <p className="text-4xl font-black text-emerald-500 mt-2">{currentUser.friends.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'profile' && <ProfileView user={currentUser} thoughts={thoughts} onLogout={handleLogout} />}
      </main>

      <BottomNav activeView={activeView} onSetView={setActiveView} hasRequests={currentUser.friendRequests.length > 0} />

      {editingThought && <ThoughtModal thought={editingThought} onSave={updateThought} onClose={() => setEditingThought(null)} friends={allUsers.filter(u => currentUser.friends.includes(u.id))} />}
      {showSettings && <SettingsModal thoughts={thoughts} onClearAll={() => setThoughts([])} onImport={handleImport} onClose={() => setShowSettings(false)} theme={theme} onSetTheme={setTheme} />}
    </div>
  );
};

export default App;
