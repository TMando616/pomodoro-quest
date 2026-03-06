"use client";

import { useState, useEffect, useCallback } from 'react';

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
    const defaultInfo = { 
      globalMessage: "Welcome to the guild, new adventurer!", 
      dailyQuest: {
        title: "The Hour of Power",
        requirement: 60,
        rewardTitle: "Daily Hero"
      },
      lastUpdated: Date.now() 
    };
    if (typeof window === 'undefined') return defaultInfo;
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
