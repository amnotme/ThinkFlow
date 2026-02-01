
import React from 'react';
import { User, Thought } from '../types';
import { ICONS } from '../constants';
import ThoughtList from './ThoughtList';

interface FriendsViewProps {
  user: User;
  allUsers: User[];
  thoughts: Thought[];
  onRespond: (fromId: string, status: 'accepted' | 'declined') => void;
  onEditThought: (t: Thought) => void;
  onTogglePin: (id: string) => void;
  onTogglePublic: (id: string) => void;
  onDeleteThought: (id: string) => void;
}

const FriendsView: React.FC<FriendsViewProps> = ({ 
    user, 
    allUsers, 
    thoughts, 
    onRespond, 
    onEditThought, 
    onTogglePin, 
    onTogglePublic, 
    onDeleteThought 
}) => {
  const friends = allUsers.filter(u => user.friends.includes(u.id));

  return (
    <div className="py-6 space-y-8 animate-in fade-in duration-500">
      {user.friendRequests.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Pending Requests
          </h3>
          <div className="space-y-3">
            {user.friendRequests.map(req => (
              <div key={req.fromId} className="bg-white dark:bg-slate-800 p-4 rounded-3xl border border-slate-100 dark:border-slate-700 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <img src={req.fromAvatar} className="w-10 h-10 rounded-full border-2 border-primary/20" />
                  <div>
                    <p className="font-bold text-sm">@{req.fromName}</p>
                    <p className="text-[10px] text-slate-400">Wants to join your flow</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onRespond(req.fromId, 'accepted')}
                    className="p-2 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20 active:scale-90 transition-transform"
                  >
                    <ICONS.Check className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => onRespond(req.fromId, 'declined')}
                    className="p-2 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded-xl active:scale-90 transition-transform"
                  >
                    <ICONS.X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Your Circle ({friends.length})</h3>
        {friends.length === 0 ? (
            <div className="bg-slate-100 dark:bg-slate-900/50 p-10 rounded-3xl text-center">
                <p className="text-slate-500 text-sm">You haven't added any friends yet. Find others in the Public Stream!</p>
            </div>
        ) : (
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {friends.map(f => (
                    <div key={f.id} className="flex-shrink-0 flex flex-col items-center gap-2">
                        <img src={f.avatar} className="w-16 h-16 rounded-2xl bg-white dark:bg-slate-800 p-1 border border-slate-100 dark:border-slate-700" />
                        <span className="text-[10px] font-bold">@{f.username}</span>
                    </div>
                ))}
            </div>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest px-2">Friends Stream</h3>
        <ThoughtList 
            thoughts={thoughts}
            onEdit={onEditThought}
            onDelete={onDeleteThought}
            onTogglePin={onTogglePin}
            onTogglePublic={onTogglePublic}
            currentUserId={user.id}
            isCommunityView
        />
      </section>
    </div>
  );
};

export default FriendsView;
