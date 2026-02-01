
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, where, setDoc, getDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
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

// FIREBASE CONFIGURATION (Final Production Credentials)
const firebaseConfig = {
  apiKey: "AIzaSyASk1jAKQ65yxgARhEzZt5OR3spDuvODR0",
  authDomain: "thinkflow-3b04c.firebaseapp.com",
  projectId: "thinkflow-3b04c",
  storageBucket: "thinkflow-3b04c.firebasestorage.app",
  messagingSenderId: "527998497224",
  appId: "1:527998497224:web:a4ecff32a1ae71b2e290fd",
  measurementId: "G-SJ7TQ04632"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [fbUser, setFbUser] = useState<FirebaseUser | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [activeTag, setActiveTag] = useState<TagType>('All');
  const [activeView, setActiveView] = useState<View>('feed');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [editingThought, setEditingThought] = useState<Thought | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Theme Sync
  useEffect(() => {
    const savedTheme = localStorage.getItem('tf_theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem('tf_theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  // Auth Listener
  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFbUser(user);
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          const newUser: User = {
            id: user.uid,
            email: user.email || '',
            username: user.displayName || 'Thinker',
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`,
            joinedAt: Date.now(),
            friends: [],
            friendRequests: []
          };
          await setDoc(userRef, newUser);
          setCurrentUser(newUser);
        } else {
          onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
              setCurrentUser(doc.data() as User);
            }
          });
        }
      } else {
        setFbUser(null);
        setCurrentUser(null);
      }
      setLoading(false);
    });
  }, []);

  // Sync Thoughts
  useEffect(() => {
    if (!fbUser) {
      setThoughts([]);
      return;
    }

    const q = query(collection(db, 'thoughts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
      const thoughtsData = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Thought));
      setThoughts(thoughtsData);
    });
  }, [fbUser]);

  // Sync All Users
  useEffect(() => {
    const q = query(collection(db, 'users'));
    return onSnapshot(q, (snapshot) => {
      setAllUsers(snapshot.docs.map(doc => doc.data() as User));
    });
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setAuthError(null);
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      console.error("Auth error", error);
      if (error.code === 'auth/unauthorized-domain') {
        const currentDomain = window.location.hostname;
        setAuthError(`Unauthorized Domain: Please go to Firebase Console > Auth > Settings and add "${currentDomain}" to the Authorized Domains list.`);
      } else if (error.code === 'auth/popup-closed-by-user') {
        setAuthError("Sign-in popup was closed. Please try again.");
      } else {
        setAuthError(error.message);
      }
    }
  };

  const handleLogout = () => signOut(auth);

  const addThought = useCallback(async (text: string, tag: TagType) => {
    if (!currentUser) return;
    await addDoc(collection(db, 'thoughts'), {
      userId: currentUser.id,
      authorName: currentUser.username,
      text,
      tag,
      createdAt: Date.now(),
      pinned: false,
      isPublic: false,
      sharedWithFriendIds: [],
    });
  }, [currentUser]);

  const updateThought = useCallback(async (updated: Thought) => {
    const { id, ...data } = updated;
    const thoughtRef = doc(db, 'thoughts', id);
    await updateDoc(thoughtRef, data);
    setEditingThought(null);
  }, []);

  const deleteThought = useCallback(async (id: string) => {
    await deleteDoc(doc(db, 'thoughts', id));
  }, []);

  const togglePin = useCallback(async (id: string) => {
    const thought = thoughts.find(t => t.id === id);
    if (!thought) return;
    await updateDoc(doc(db, 'thoughts', id), { pinned: !thought.pinned });
  }, [thoughts]);

  const togglePublic = useCallback(async (id: string) => {
    const thought = thoughts.find(t => t.id === id);
    if (!thought) return;
    await updateDoc(doc(db, 'thoughts', id), { isPublic: !thought.isPublic });
  }, [thoughts]);

  const sendFriendRequest = async (targetUserId: string) => {
    if (!currentUser || currentUser.id === targetUserId) return;
    const targetRef = doc(db, 'users', targetUserId);
    const newRequest: FriendRequest = {
      fromId: currentUser.id,
      fromName: currentUser.username,
      fromAvatar: currentUser.avatar,
      status: 'pending',
      timestamp: Date.now()
    };
    await updateDoc(targetRef, {
      friendRequests: arrayUnion(newRequest)
    });
  };

  const handleRequestResponse = async (fromId: string, status: 'accepted' | 'declined') => {
    if (!currentUser) return;
    const myRef = doc(db, 'users', currentUser.id);
    const requesterRef = doc(db, 'users', fromId);

    const requestToClear = currentUser.friendRequests.find(r => r.fromId === fromId);
    if (!requestToClear) return;

    await updateDoc(myRef, {
      friendRequests: arrayRemove(requestToClear),
      friends: status === 'accepted' ? arrayUnion(fromId) : currentUser.friends
    });

    if (status === 'accepted') {
      await updateDoc(requesterRef, {
        friends: arrayUnion(currentUser.id)
      });
    }
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400">Syncing Flow...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Auth 
        onSuccess={handleLogin} 
        theme={theme} 
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} 
        error={authError}
      />
    );
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
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-fast"></div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Cloud</span>
                </div>
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
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Circle</p>
                <p className="text-4xl font-black text-emerald-500 mt-2">{currentUser.friends.length}</p>
              </div>
            </div>
          </div>
        )}

        {activeView === 'profile' && <ProfileView user={currentUser} thoughts={thoughts} onLogout={handleLogout} />}
      </main>

      <BottomNav activeView={activeView} onSetView={setActiveView} hasRequests={currentUser.friendRequests.length > 0} />

      {editingThought && <ThoughtModal thought={editingThought} onSave={updateThought} onClose={() => setEditingThought(null)} friends={allUsers.filter(u => currentUser.friends.includes(u.id))} />}
      {showSettings && <SettingsModal thoughts={thoughts} onClearAll={() => {}} onImport={() => {}} onClose={() => setShowSettings(false)} theme={theme} onSetTheme={setTheme} />}
    </div>
  );
};

export default App;
