
export type TagType = "All" | "Urgent" | "Ideas" | "To Do" | "Questions" | "Inspiration";

export interface User {
  id: string;
  username: string;
  avatar: string;
  joinedAt: number;
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
}

export interface TagConfig {
  name: TagType;
  icon: string;
  colorClass: string;
}

export type View = 'feed' | 'community' | 'stats' | 'profile';
