
export type TagType = "All" | "Urgent" | "Ideas" | "To Do" | "Questions" | "Inspiration";

export interface Thought {
  id: string;
  text: string;
  tag: TagType;
  createdAt: number;
  pinned: boolean;
}

export interface TagConfig {
  name: TagType;
  icon: string;
  colorClass: string;
}

export type View = 'feed' | 'stats' | 'settings';
