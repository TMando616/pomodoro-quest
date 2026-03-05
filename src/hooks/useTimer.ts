"use client";

import { useState, useEffect, useCallback } from 'react';

export type TimerMode = 'quest' | 'rest';

type UseTimerProps = {
  onComplete: (mode: TimerMode, isBossMode: boolean, duration: number, questName: string) => void;
};

export function useTimer({ onComplete }: UseTimerProps) {
  const [questName, setQuestName] = useState("");
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<TimerMode>('quest');
  const [isBossMode, setIsBossMode] = useState(false);

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    onComplete(mode, isBossMode, duration, questName);
    
    if (mode === 'quest') {
      setMode('rest');
      setTimeLeft(5 * 60);
    } else {
      setMode('quest');
      setTimeLeft(duration * 60);
      setIsBossMode(false);
    }
  }, [mode, isBossMode, duration, onComplete, questName]);

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

  // Handle actual completion
  useEffect(() => {
    if (timeLeft === 0 && isActive) {
      // Use timeout to avoid synchronous setState during effect execution
      const timer = setTimeout(() => {
        handleTimerComplete();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [timeLeft, isActive, handleTimerComplete]);

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
    toggleTimer,
    resetTimer,
    selectDuration,
    setRestTime,
    setQuestMode
  };
}
