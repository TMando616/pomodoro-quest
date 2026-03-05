import { Theme, ThemeCategory, Title } from "../types";

/**
 * ゲーム内で獲得可能な称号のリストとそれぞれの獲得条件
 */
export const titles: Title[] = [
  { 
    id: 'novice', 
    name: 'Novice Adventurer', 
    description: 'A beginner who just started the journey.',
    // 常にアンロック
    condition: () => true 
  },
  { 
    id: 'focus_knight', 
    name: 'Focus Knight', 
    description: 'Completed 10 focus quests.',
    // クエスト履歴が10件以上
    condition: (_, logs) => logs.length >= 10
  },
  { 
    id: 'time_sage', 
    name: 'Time Sage', 
    description: 'Accumulated 10 hours of focus time.',
    // 合計集中時間が600分以上
    condition: (_, logs) => logs.reduce((acc, log) => acc + log.duration, 0) >= 600
  },
  { 
    id: 'legendary', 
    name: 'Legendary Hero', 
    description: 'Reached Level 10.',
    // レベルが10以上
    condition: (user) => user.level >= 10
  },
  { 
    id: 'night_owl', 
    name: 'Night Owl', 
    description: 'Completed a quest after 10 PM.',
    // 午後10時〜午前4時の間に完了したクエストがある
    condition: (_, logs) => logs.some(log => {
      const hour = new Date(log.createdAt).getHours();
      return hour >= 22 || hour <= 4;
    })
  }
];

/**
 * アプリケーションで使用可能なテーマカラーの定義
 * Shadow（ダーク）と Radiance（ライト）の2カテゴリあります。
 */
export const themes: Record<ThemeCategory, Theme[]> = {
  dark: [
    { name: 'emerald', label: 'Dark Emerald', color: 'bg-[#10b981]' },
    { name: 'ruby', label: 'Dark Ruby', color: 'bg-[#f43f5e]' },
    { name: 'sapphire', label: 'Dark Sapphire', color: 'bg-[#3b82f6]' },
    { name: 'amber', label: 'Dark Amber', color: 'bg-[#f59e0b]' },
    { name: 'amethyst', label: 'Dark Amethyst', color: 'bg-[#a855f7]' },
  ],
  light: [
    { name: 'emerald-light', label: 'Light Emerald', color: 'bg-[#059669]' },
    { name: 'ruby-light', label: 'Light Ruby', color: 'bg-[#e11d48]' },
    { name: 'sapphire-light', label: 'Light Sapphire', color: 'bg-[#2563eb]' },
    { name: 'amber-light', label: 'Light Amber', color: 'bg-[#d97706]' },
    { name: 'amethyst-light', label: 'Light Amethyst', color: 'bg-[#9333ea]' },
  ]
};

/**
 * クエスト時間として選択可能な選択肢（分）
 * 5分から60分まで5分刻み。
 */
export const durationOptions = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);
