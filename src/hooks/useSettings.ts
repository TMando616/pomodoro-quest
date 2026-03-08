"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export type AppSettings = {
  defaultDuration: number;
  showNotifications: boolean;
  autoStartRest: boolean;
  compactHUD: boolean;
  theme: string;
  language: 'en' | 'ja';
};

const SETTINGS_UPDATE_EVENT = 'pq-settings-updated';

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
      theme: 'emerald',
      language: 'ja',
    };

    if (typeof window === 'undefined') return defaultSettings;
    const saved = localStorage.getItem('pq_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  // 無限ループ防止のための参照
  const isInternalUpdate = useRef(false);

  // 設定が変更されたら localStorage に保存し、他のインスタンスに通知する
  useEffect(() => {
    localStorage.setItem('pq_settings', JSON.stringify(settings));
    
    // 他のインスタンスからの更新（外部更新）による変更でない場合のみイベントを発行
    if (isInternalUpdate.current) {
      window.dispatchEvent(new CustomEvent(SETTINGS_UPDATE_EVENT, { detail: settings }));
      isInternalUpdate.current = false;
    }
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    isInternalUpdate.current = true;
    setSettings((prev) => ({ ...prev, ...newSettings }));
  }, []);

  // 他のインスタンスからの更新通知を購読する
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AppSettings>;
      const newSettings = customEvent.detail;
      
      setSettings((prev) => {
        // 深い比較を行い、本当に変更がある場合のみ更新
        if (JSON.stringify(prev) === JSON.stringify(newSettings)) return prev;
        return newSettings;
      });
    };

    window.addEventListener(SETTINGS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATE_EVENT, handleUpdate);
  }, []);

  return {
    settings,
    updateSettings
  };
}
