"use client";

import { useState, useEffect, useCallback } from 'react';

/**
 * アプリケーションの全体設定を管理するフック
 */
export function useSettings() {
  const [settings, setSettings] = useState(() => {
    if (typeof window === 'undefined') return {
      defaultDuration: 25,
      showNotifications: true,
      autoStartRest: false,
      compactHUD: false,
    };
    const saved = localStorage.getItem('pq_settings');
    return saved ? JSON.parse(saved) : {
      defaultDuration: 25,
      showNotifications: true,
      autoStartRest: false,
      compactHUD: false,
    };
  });

  // 保存処理
  useEffect(() => {
    localStorage.setItem('pq_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<typeof settings>) => {
    setSettings((prev: any) => ({ ...prev, ...newSettings }));
  }, []);

  return {
    settings,
    updateSettings
  };
}
