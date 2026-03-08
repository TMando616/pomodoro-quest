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
  const [guildInfo, setGuildInfo] = useState<GuildInfo>({ 
    globalMessage: translations.ja.admin.defaultMsg, 
    dailyQuest: { title: translations.ja.admin.defaultDQ, requirement: 60, rewardTitle: translations.ja.profile.badges.guildElite },
    lastUpdated: 0 // レンダリング中の impure 関数呼び出しを避けるため固定値
  });

  const [isMounted, setIsMounted] = useState(false);

  // マウント時に localStorage から読み込む
  useEffect(() => {
    const saved = localStorage.getItem('pq_guild_info');
    if (saved) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setGuildInfo(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse guild info", e);
      }
    } else {
      // localStorage がない場合、現在の言語設定に基づいたデフォルト値を設定
      const savedSettings = localStorage.getItem('pq_settings');
      const lang = savedSettings ? JSON.parse(savedSettings).language : 'ja';
      const t = translations[lang as 'en' | 'ja'] || translations.ja;
      
      setGuildInfo({
        globalMessage: t.admin.defaultMsg,
        dailyQuest: {
          title: t.admin.defaultDQ,
          requirement: 60,
          rewardTitle: t.profile.badges.guildElite
        },
        lastUpdated: Date.now()
      });
    }
    setIsMounted(true);
  }, []);

  // 状態が変更されたら保存（マウント後のみ）
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('pq_guild_info', JSON.stringify(guildInfo));
    }
  }, [guildInfo, isMounted]);

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
