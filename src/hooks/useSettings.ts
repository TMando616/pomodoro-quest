"use client";

import { useState, useEffect, useCallback } from 'react';

export type AppSettings = {
  defaultDuration: number;
  showNotifications: boolean;
  autoStartRest: boolean;
  compactHUD: boolean;
};

/**
 * アプリケーションの全体設定を管理するフック
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(() => {
    const defaultSettings: AppSettings = {
      defaultDuration: 25,
      showNotifications: true,
      autoStartRest: false,
      compactHUD: false,
    };
    if (typeof window === 'undefined') return defaultSettings;
    const saved = localStorage.getItem('pq_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // 保存処理
  useEffect(() => {
    localStorage.setItem('pq_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    settings,
    updateSettings
  };
}
