"use client";

import { useState, useEffect, useCallback } from 'react';

export type GuildInfo = {
  globalMessage: string;
  lastUpdated: number;
};

/**
 * ギルド全体の公開情報を管理するフック
 */
export function useGuild() {
  const [guildInfo, setGuildInfo] = useState<GuildInfo>(() => {
    if (typeof window === 'undefined') return { globalMessage: "", lastUpdated: Date.now() };
    const saved = localStorage.getItem('pq_guild_info');
    return saved ? JSON.parse(saved) : { globalMessage: "Welcome to the guild, new adventurer!", lastUpdated: Date.now() };
  });

  useEffect(() => {
    localStorage.setItem('pq_guild_info', JSON.stringify(guildInfo));
  }, [guildInfo]);

  const updateGlobalMessage = useCallback((message: string) => {
    setGuildInfo({
      globalMessage: message,
      lastUpdated: Date.now()
    });
  }, []);

  return {
    guildInfo,
    updateGlobalMessage
  };
}
