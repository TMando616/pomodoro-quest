export type User = {
  id: string;
  username: string;
  level: number;
  exp: number;
};

export type QuestLog = {
  id: string;
  userId: string;
  name: string;
  duration: number;
  earnedExp: number;
  createdAt: number;
};

export type ThemeCategory = 'dark' | 'light';

export type Theme = {
  name: string;
  label: string;
  color: string;
};
