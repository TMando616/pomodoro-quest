"use client";

import { useState, useEffect, useCallback } from 'react';
import { translations } from '@/constants/translations';

export type GuildInfo = {
  globalMessage: string;
  dailyQuest: {
    title: string;
    requirement: number; // 分数
    rewardTitle: string;
  };
  lastUpdated: number;
};

/**
 * ギルド全体の公開情報を管理するフック
 */
export function useGuild() {
  const [guildInfo, setGuildInfo] = useState<GuildInfo>(() => {
    // 初期化時にlocalStorageから設定と言語を読み込む
    if (typeof window === 'undefined') {
      return { 
        globalMessage: translations.ja.admin.defaultMsg, 
        dailyQuest: { title: translations.ja.admin.defaultDQ, requirement: 60, rewardTitle: translations.ja.profile.badges.guildElite },
        lastUpdated: Date.now() 
      };
    }

    const savedSettings = localStorage.getItem('pq_settings');
    const lang = savedSettings ? JSON.parse(savedSettings).language : 'ja';
    const t = translations[lang as 'en' | 'ja'] || translations.ja;

    const defaultInfo = { 
      globalMessage: t.admin.defaultMsg, 
      dailyQuest: {
        title: t.admin.defaultDQ,
        requirement: 60,
        rewardTitle: t.profile.badges.guildElite
      },
      lastUpdated: Date.now() 
    };

    const saved = localStorage.getItem('pq_guild_info');
    return saved ? JSON.parse(saved) : defaultInfo;
  });

  useEffect(() => {
    localStorage.setItem('pq_guild_info', JSON.stringify(guildInfo));
  }, [guildInfo]);

  const updateGlobalMessage = useCallback((message: string) => {
    setGuildInfo(prev => ({
      ...prev,
      globalMessage: message,
      lastUpdated: Date.now()
    }));
  }, []);

  const updateDailyQuest = useCallback((title: string, req: number, reward: string) => {
    setGuildInfo(prev => ({
      ...prev,
      dailyQuest: { title, requirement: req, rewardTitle: reward },
      lastUpdated: Date.now()
    }));
  }, []);

  return {
    guildInfo,
    updateGlobalMessage,
    updateDailyQuest
  };
}
