"use client";

import React, { useEffect } from 'react';
import { useSettings } from '@/hooks/useSettings';

/**
 * アプリケーション全体のテーマを管理するプロバイダー
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { settings } = useSettings();

  useEffect(() => {
    // ページ遷移時や設定変更時にテーマを適用
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  return <>{children}</>;
}
