"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

export type AppSettings = {
  defaultDuration: number;
  showNotifications: boolean;
  autoStartRest: boolean;
  compactHUD: boolean;
  theme: string;
  language: 'en' | 'ja';
  openingSeen: boolean; // スタート画面を既に見たか
};

const SETTINGS_UPDATE_EVENT = 'pq-settings-updated';

/**
 * アプリケーションの全体設定を管理するフック
 */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>({
    defaultDuration: 25,
    showNotifications: true,
    autoStartRest: false,
    compactHUD: false,
    theme: 'emerald',
    language: 'ja',
    openingSeen: false,
  });

  const [isMounted, setIsMounted] = useState(false);
  const isInternalUpdate = useRef(false);

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

  useEffect(() => {
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
