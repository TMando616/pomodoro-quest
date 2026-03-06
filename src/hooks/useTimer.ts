"use client";

import { useState, useEffect, useCallback } from 'react';

// タイマーのモード定義
export type TimerMode = 'quest' | 'rest';
export type Difficulty = 'easy' | 'normal' | 'hard' | 'insane';

type UseTimerProps = {
  onComplete: (mode: TimerMode, isBossMode: boolean, duration: number, questName: string, difficulty: Difficulty) => void;
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
  const [difficulty, setDifficulty] = useState<Difficulty>('normal'); // 難易度

  /**
   * タイマー終了時の内部処理
   */
  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    // 完了時のコールバックを呼び出し
    onComplete(mode, isBossMode, duration, questName, difficulty);
    
    // 終了後の自動セットアップ
    if (mode === 'quest') {
      setMode('rest');
      setTimeLeft(5 * 60);
    } else {
      setMode('quest');
      setTimeLeft(duration * 60);
      setIsBossMode(false);
    }
  }, [mode, isBossMode, duration, onComplete, questName, difficulty]);

  /**
   * カウントダウンの実行
   */
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  /**
   * 残り時間が0になった瞬間の検知
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

  const toggleTimer = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'quest' ? duration * 60 : 5 * 60);
  }, [mode, duration]);

  const selectDuration = useCallback((mins: number) => {
    if (isActive) return;
    setDuration(mins);
    if (mode === 'quest') setTimeLeft(mins * 60);
  }, [isActive, mode]);

  const setRestTime = useCallback((mins: number) => {
    setIsActive(false);
    setMode('rest');
    setTimeLeft(mins * 60);
  }, []);

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
    difficulty,
    setDifficulty,
    toggleTimer,
    resetTimer,
    selectDuration,
    setRestTime,
    setQuestMode
  };
}
