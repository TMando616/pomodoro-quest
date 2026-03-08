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
  // サーバーとクライアントの初回レンダリングを一致させるため、常にデフォルト値で開始
  const [settings, setSettings] = useState<AppSettings>({
    defaultDuration: 25,
    showNotifications: true,
    autoStartRest: false,
    compactHUD: false,
    theme: 'emerald',
    language: 'ja',
  });

  const [isMounted, setIsMounted] = useState(false);
  const isInternalUpdate = useRef(false);

  // マウント時に localStorage から読み込む
  useEffect(() => {
    const saved = localStorage.getItem('pq_settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings(parsed);
      } catch (e) {
        console.error("Failed to parse settings", e);
      }
    }
    setIsMounted(true);
  }, []);

  // 設定が変更されたら localStorage に保存し、他のインスタンスに通知する
  useEffect(() => {
    // マウント完了前、または外部からの更新時はスキップ
    if (!isMounted) return;
    
    localStorage.setItem('pq_settings', JSON.stringify(settings));
    
    if (isInternalUpdate.current) {
      window.dispatchEvent(new CustomEvent(SETTINGS_UPDATE_EVENT, { detail: settings }));
      isInternalUpdate.current = false;
    }
  }, [settings, isMounted]);

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
        if (JSON.stringify(prev) === JSON.stringify(newSettings)) return prev;
        return newSettings;
      });
    };

    window.addEventListener(SETTINGS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(SETTINGS_UPDATE_EVENT, handleUpdate);
  }, []);

  return {
    settings,
    updateSettings,
    isMounted
  };
}
