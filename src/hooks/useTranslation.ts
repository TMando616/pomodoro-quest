"use client";

import { useSettings } from './useSettings';
import { translations } from '@/constants/translations';

/**
 * 設定された言語に基づいて翻訳オブジェクトを返すフック
 */
export function useTranslation() {
  const { settings } = useSettings();
  const t = translations[settings.language] || translations.ja;

  return {
    t,
    language: settings.language
  };
}
