export type User = {
  id: string;
  username: string;
  level: number;
  exp: number;
  unlockedTitles: string[]; // 称号のIDリスト
  currentTitleId?: string;  // 現在セットしている称号
};

export type Title = {
  id: string;
  name: string;
  description: string;
  condition: (user: User, logs: QuestLog[]) => boolean;
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
