"use client";

import { useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * 言語設定に応じてドキュメントのタイトルや説明（メタデータ）を動的に更新するコンポーネント
 */
export function LanguageManager() {
  const { language } = useTranslation();

  useEffect(() => {
    // 言語に応じてブラウザのタブ名などを変更
    if (language === 'ja') {
      document.title = "ポモドーロ・クエスト ⚔️";
      // 説明文（meta description）の動的変更はSEO的には限定的だが、
      // クライアントサイドでの一貫性のために実施
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", "ヒーローのように集中しよう。RPG要素を取り入れたポモドーロタイマー。");
      }
    } else {
      document.title = "Pomodoro Quest ⚔️";
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", "Focus like a hero. A gamified pomodoro timer.");
      }
    }
  }, [language]);

  return null; // UIは持たない
}
