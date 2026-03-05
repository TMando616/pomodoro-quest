"use client";

import { useState, useEffect, useCallback } from 'react';

// タイマーのモード定義
export type TimerMode = 'quest' | 'rest';

type UseTimerProps = {
  onComplete: (mode: TimerMode, isBossMode: boolean, duration: number, questName: string) => void;
};

/**
 * タイマーのカウントダウンロジックを管理するフック
 */
export function useTimer({ onComplete }: UseTimerProps) {
  // --- 状態管理 ---
  const [questName, setQuestName] = useState(""); // クエストの名前
  const [duration, setDuration] = useState(25); // 設定された時間（分）
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 残り時間（秒）
  const [isActive, setIsActive] = useState(false); // 動作中かどうか
  const [mode, setMode] = useState<TimerMode>('quest'); // クエスト中か休憩中か
  const [isBossMode, setIsBossMode] = useState(false); // ボス戦モードかどうか

  /**
   * タイマー終了時の内部処理
   */
  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    // 完了時のコールバックを呼び出し（外部の page.tsx 等でEXP加算などを行う）
    onComplete(mode, isBossMode, duration, questName);
    
    // 終了後の自動セットアップ
    if (mode === 'quest') {
      setMode('rest');
      setTimeLeft(5 * 60); // クエスト後はデフォルト5分休憩
    } else {
      setMode('quest');
      setTimeLeft(duration * 60); // 休憩後は設定した時間に戻す
      setIsBossMode(false); // ボス戦フラグをリセット
    }
  }, [mode, isBossMode, duration, onComplete, questName]);

  /**
   * カウントダウンの実行
   */
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0; // 終了
        }
        return prev - 1; // 1秒減らす
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  /**
   * 残り時間が0になった瞬間の検知
   * （setInterval内での状態更新との競合を避けるため独立させています）
   */
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      const timer = setTimeout(() => {
        handleTimerComplete();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isActive, handleTimerComplete]);

  // --- 操作用関数 ---

  // 開始/一時停止
  const toggleTimer = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  // リセット
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'quest' ? duration * 60 : 5 * 60);
  }, [mode, duration]);

  // 時間の選択
  const selectDuration = useCallback((mins: number) => {
    if (isActive) return;
    setDuration(mins);
    if (mode === 'quest') setTimeLeft(mins * 60);
  }, [isActive, mode]);

  // 休憩時間のセット
  const setRestTime = useCallback((mins: number) => {
    setIsActive(false);
    setMode('rest');
    setTimeLeft(mins * 60);
  }, []);

  // クエストモードへの手動切り替え
  const setQuestMode = useCallback(() => {
    setIsActive(false);
    setMode('quest');
    setTimeLeft(duration * 60);
  }, [duration]);

  return {
    questName,
    setQuestName,
    duration,
    timeLeft,
    setTimeLeft,
    isActive,
    setIsActive,
    mode,
    setMode,
    isBossMode,
    setIsBossMode,
    toggleTimer,
    resetTimer,
    selectDuration,
    setRestTime,
    setQuestMode
  };
}
