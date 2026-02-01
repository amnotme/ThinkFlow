
export type TagType = "All" | "Urgent" | "Ideas" | "To Do" | "Questions" | "Inspiration";

export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string;
  joinedAt: number;
  friends: string[]; // IDs of friends
  friendRequests: FriendRequest[];
}

export interface FriendRequest {
  fromId: string;
  fromName: string;
  fromAvatar: string;
  status: 'pending' | 'accepted' | 'declined';
  timestamp: number;
}

export interface Thought {
  id: string;
  userId: string;
  authorName: string;
  text: string;
  tag: TagType;
  createdAt: number;
  pinned: boolean;
  isPublic: boolean;
  sharedWithFriendIds?: string[]; // Specifically shared with these friends
}

export interface TagConfig {
  name: TagType;
  icon: string;
  colorClass: string;
}

export type View = 'feed' | 'community' | 'friends' | 'stats' | 'profile';
