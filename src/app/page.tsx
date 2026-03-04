"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shield, Swords, Trophy, Zap, Crown, Palette, Sun, Moon, Timer } from 'lucide-react';

const themes = {
  dark: [
    { name: 'emerald', label: 'Dark Emerald', color: 'bg-[#10b981]' },
    { name: 'ruby', label: 'Dark Ruby', color: 'bg-[#f43f5e]' },
    { name: 'sapphire', label: 'Dark Sapphire', color: 'bg-[#3b82f6]' },
    { name: 'amber', label: 'Dark Amber', color: 'bg-[#f59e0b]' },
    { name: 'amethyst', label: 'Dark Amethyst', color: 'bg-[#a855f7]' },
  ],
  light: [
    { name: 'emerald-light', label: 'Light Emerald', color: 'bg-[#059669]' },
    { name: 'ruby-light', label: 'Light Ruby', color: 'bg-[#e11d48]' },
    { name: 'sapphire-light', label: 'Light Sapphire', color: 'bg-[#2563eb]' },
    { name: 'amber-light', label: 'Light Amber', color: 'bg-[#d97706]' },
    { name: 'amethyst-light', label: 'Light Amethyst', color: 'bg-[#9333ea]' },
  ]
};

// 5分から60分まで5分刻みのリスト
const durationOptions = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);

export default function PomodoroQuest() {
  // --- 状態管理 ---
  const [duration, setDuration] = useState(25); // 選択された時間（分）
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [exp, setExp] = useState(0);
  const [level, setLevel] = useState(1);
  const [message, setMessage] = useState("");
  const [currentTheme, setCurrentTheme] = useState('emerald');

  // テーマの適用
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleQuestComplete = useCallback(() => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setExp((prevExp) => {
      const newExp = prevExp + 100;
      if (newExp >= 1000) {
        setLevel((l) => l + 1);
        setMessage("LEVEL UP! QUEST CLEAR!");
        return newExp - 1000;
      }
      setMessage("QUEST CLEAR! +100 EXP");
      return newExp;
    });
    setTimeout(() => setMessage(""), 5000);
  }, [duration]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      timeoutId = setTimeout(handleQuestComplete, 0);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isActive, timeLeft, handleQuestComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    setMessage("");
  };

  // 時間設定の変更
  const selectDuration = (mins: number) => {
    if (isActive) return; // 動作中は変更不可
    setDuration(mins);
    setTimeLeft(mins * 60);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono p-4 md:p-8 selection:bg-primary/30 transition-colors duration-500 overflow-x-hidden">
      
      {/* サイドパネル（右側固定） */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 flex flex-col items-end gap-6 z-50 max-h-[90vh] overflow-y-auto pr-1 scrollbar-hide">
        
        {/* テーマセレクター */}
        <div className="flex flex-col items-end gap-3">
          {/* Dark Themes */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/40 border border-primary/20 rounded-full backdrop-blur-md">
              <Moon className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">Shadow</span>
            </div>
            <div className="flex gap-1.5 p-1.5 bg-slate-900/40 border border-primary/20 rounded-xl backdrop-blur-md shadow-xl">
              {themes.dark.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setCurrentTheme(theme.name)}
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-90 ${theme.color} ${
                    currentTheme === theme.name ? 'ring-2 ring-white scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'
                  }`}
                  title={theme.label}
                />
              ))}
            </div>
          </div>

          {/* Light Themes */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-white/40 border border-primary/20 rounded-full backdrop-blur-md">
              <Sun className="w-3 h-3 text-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">Radiance</span>
            </div>
            <div className="flex gap-1.5 p-1.5 bg-white/40 border border-primary/20 rounded-xl backdrop-blur-md shadow-xl">
              {themes.light.map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => setCurrentTheme(theme.name)}
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-90 ${theme.color} ${
                    currentTheme === theme.name ? 'ring-2 ring-slate-800 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'
                  }`}
                  title={theme.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* クエスト時間セレクター（テーマボタンの下に配置） */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 px-3 py-1 bg-background/40 border border-primary/20 rounded-full backdrop-blur-md">
            <Timer className="w-3 h-3 text-primary" />
            <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">Quest</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-background/40 border border-primary/20 rounded-xl backdrop-blur-md shadow-xl w-fit">
            {durationOptions.map((mins) => (
              <button
                key={mins}
                onClick={() => selectDuration(mins)}
                disabled={isActive}
                className={`w-9 h-7 md:w-10 md:h-8 rounded-lg font-black text-[10px] transition-all duration-300 flex items-center justify-center ${
                  duration === mins
                    ? 'bg-primary text-primary-foreground shadow-[0_0_10px_var(--color-primary)] scale-105 z-10'
                    : 'bg-foreground/5 opacity-40 hover:opacity-80 disabled:opacity-10'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md flex flex-col items-center gap-10 md:gap-14 my-8">
        
        {/* HUD - ステータスバー */}
        <div className="w-full bg-background/40 border-2 border-primary/20 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group border-b-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
                <Shield className="text-primary w-6 h-6" />
              </div>
              <div>
                <div className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] leading-none mb-1">Rank</div>
                <div className="text-2xl font-black italic text-primary leading-none">Lv. {level}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] leading-none mb-1">Status</div>
              <div className="text-sm font-bold opacity-80 uppercase tracking-widest leading-none">
                {isActive ? "Questing" : "Resting"}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative w-full h-3 bg-foreground/5 rounded-full overflow-hidden border border-primary/10">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_15px_var(--color-primary)] transition-all duration-1000 ease-out"
                style={{ width: `${(exp / 1000) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black text-primary/70 tracking-widest italic uppercase">EXP {exp} / 1000</span>
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${exp >= (i + 1) * 200 ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-foreground/10'}`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* タイマーインターフェース */}
        <div className="relative flex flex-col items-center">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[420px] md:h-[420px] border border-primary/10 rounded-full transition-all duration-1000 ${isActive ? 'scale-110 opacity-40' : 'scale-100 opacity-10'}`} />

          <main className="relative z-10 flex flex-col items-center">
            <div className={`relative bg-background/60 border-4 rounded-full w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center transition-all duration-700 backdrop-blur-md shadow-2xl ${
              isActive ? 'border-primary' : 'border-foreground/10'
            }`}>
              <div className="absolute top-10 flex flex-col items-center gap-1">
                <Swords className={`w-4 h-4 ${isActive ? 'text-primary animate-pulse' : 'opacity-20'}`} />
                <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isActive ? 'text-primary' : 'opacity-20'}`}>
                  Focus Quest
                </span>
              </div>

              <div className={`text-7xl md:text-8xl font-black tracking-tighter select-none transition-colors duration-500 ${
                isActive ? 'text-primary' : 'opacity-20'
              }`}>
                {formatTime(timeLeft)}
              </div>

              {message && (
                <div className="absolute -bottom-16 md:-bottom-12 whitespace-nowrap animate-bounce z-20">
                  <div className="bg-primary text-primary-foreground text-[10px] font-black py-2.5 px-6 rounded-2xl shadow-xl uppercase tracking-[0.2em] border border-white/20">
                    {message}
                  </div>
                </div>
              )}
              
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 320 320">
                <circle cx="160" cy="160" r="154" fill="transparent" stroke="currentColor" strokeWidth="1" className="opacity-5" />
                <circle
                  cx="160" cy="160" r="154"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={967}
                  strokeDashoffset={967 - (967 * (timeLeft / (duration * 60)))}
                  className={`${isActive ? 'text-primary' : 'opacity-10'} transition-all duration-1000 ease-linear`}
                  strokeLinecap="round"
                />
              </svg>
            </div>

            <div className="flex gap-8 md:gap-10 mt-16 md:mt-20">
              <button
                onClick={toggleTimer}
                className={`group relative w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] transition-all duration-300 transform active:scale-90 flex items-center justify-center border-b-4 ${
                  isActive 
                    ? 'bg-foreground/10 border-foreground/20' 
                    : 'bg-primary border-primary/50 text-primary-foreground'
                }`}
              >
                {isActive ? <Pause className="w-8 h-8 md:w-10 md:h-10" /> : <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />}
                <div className={`absolute -inset-2 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full ${isActive ? 'bg-foreground' : 'bg-primary'}`} />
              </button>

              <button
                onClick={resetTimer}
                className="group relative w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-foreground/5 border-b-4 border-foreground/10 hover:bg-foreground/10 transition-all duration-300 transform active:scale-90 flex items-center justify-center shadow-lg"
              >
                <RotateCcw className="w-8 h-8 md:w-9 md:h-9 opacity-40 group-hover:opacity-100 group-hover:rotate-[-45deg] transition-all" />
              </button>
            </div>
          </main>
        </div>

        <div className="flex gap-12 opacity-30 mt-8">
          <Trophy className="w-6 h-6 text-primary" />
          <Crown className="w-6 h-6 text-primary" />
          <Zap className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
