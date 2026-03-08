"use client";

import { useState, useEffect, useCallback } from 'react';

export type AppSettings = {
  defaultDuration: number;
  showNotifications: boolean;
  autoStartRest: boolean;
  compactHUD: boolean;
  theme: string;
  language: 'en' | 'ja';
};

// 他のインスタンスに通知するためのカスタムイベント名
const SETTINGS_UPDATE_EVENT = 'pq-settings-updated';

/**
 * アプリケーションの全体設定を管理するフック
 * 同一タブ内の複数コンポーネント間で設定を同期します。
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

  // 設定が変更されたら localStorage に保存し、他のインスタンスに通知する
  useEffect(() => {
    localStorage.setItem('pq_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // カスタムイベントを発行して他の useSettings インスタンスに知らせる
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(SETTINGS_UPDATE_EVENT, { detail: updated }));
      }
      return updated;
    });
  }, []);

  // 他のインスタンスからの更新通知を購読する
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<AppSettings>;
      // 現在の状態と異なる場合のみ更新（無限ループ防止）
      setSettings((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(customEvent.detail)) return prev;
        return customEvent.detail;
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
