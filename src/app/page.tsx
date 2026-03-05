"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Crown, Zap, Coffee, Tent } from 'lucide-react';
import { User } from '@/types';
import { HUD } from '@/components/ui/HUD';
import { Sidebar } from '@/components/ui/Sidebar';
import { AuthOverlay } from '@/components/ui/AuthOverlay';
import { TimerDisplay } from '@/components/ui/TimerDisplay';

export default function PomodoroQuest() {
  // --- Auth & Persistence State ---
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_users');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', username: 'Hero', level: 1, exp: 0 }];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('pq_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register' | 'none'>('none');
  const [authForm, setAuthForm] = useState({ username: '' });
  const [authError, setAuthError] = useState("");

  // ユーザーデータが更新されたら保存
  useEffect(() => {
    localStorage.setItem('pq_users', JSON.stringify(users));
  }, [users]);

  // セッションが更新されたら保存
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('pq_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pq_current_user');
    }
  }, [currentUser]);

  const updateCurrentUserAndList = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, []);

  // --- Timer State ---
  const [questName, setQuestName] = useState("");
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'quest' | 'rest'>('quest');
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

  const handleTimerComplete = useCallback(() => {
    setIsActive(false);
    
    if (mode === 'quest') {
      const earnedExp = duration * 10;
      const displayName = questName || "Quest";

      if (currentUser) {
        const newExp = currentUser.exp + earnedExp;
        let newLevel = currentUser.level;
        let finalExp = newExp;

        if (newExp >= 1000) {
          newLevel += 1;
          finalExp = newExp - 1000;
          setMessage(`LEVEL UP! ${displayName} CLEAR! +${earnedExp} EXP`);
        } else {
          setMessage(`${displayName} CLEAR! +${earnedExp} EXP`);
        }
        updateCurrentUserAndList({ ...currentUser, level: newLevel, exp: finalExp });
      } else {
        setMessage(`${displayName} CLEAR! +${earnedExp} EXP (Sign in to save)`);
      }
      // クエスト完了後は自動的に休息の準備へ（時間はまだセットしない）
      setMode('rest');
      setTimeLeft(5 * 60); // デフォルト5分
    } else {
      setMessage("REST COMPLETE! Ready for the next quest?");
      setMode('quest');
      setTimeLeft(duration * 60);
    }
    
    setTimeout(() => setMessage(""), 5000);
  }, [duration, currentUser, updateCurrentUserAndList, questName, mode]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && isActive) {
      timeoutId = setTimeout(handleTimerComplete, 0);
    }
    return () => {
      if (interval) clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'quest' ? duration * 60 : 5 * 60);
    setMessage("");
  };

  const startRest = (mins: number) => {
    setIsActive(false);
    setMode('rest');
    setTimeLeft(mins * 60);
  };

  const startQuest = () => {
    setIsActive(false);
    setMode('quest');
    setTimeLeft(duration * 60);
  };

  // --- Auth Handlers ---
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!authForm.username.trim()) {
      setAuthError("Enter your adventurer name.");
      return;
    }
    if (isAuthMode === 'register') {
      const exists = users.find(u => u.username === authForm.username);
      if (exists) {
        setAuthError("Name already taken.");
        return;
      }
      const newUser: User = { id: Date.now().toString(), username: authForm.username, level: 1, exp: 0 };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthMode('none');
    } else {
      const user = users.find(u => u.username === authForm.username);
      if (!user) {
        setAuthError("Adventurer not found.");
        return;
      }
      setCurrentUser(user);
      setIsAuthMode('none');
    }
    setAuthForm({ username: '' });
  };

  const logout = () => {
    setCurrentUser(null);
    setIsActive(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono p-4 md:p-8 selection:bg-primary/30 transition-colors duration-500 overflow-x-hidden">
      
      <Sidebar 
        currentUser={currentUser}
        currentTheme={currentTheme}
        duration={duration}
        isActive={isActive}
        onLogout={logout}
        onOpenAuth={() => setIsAuthMode('login')}
        onThemeChange={setCurrentTheme}
        onDurationSelect={(mins) => {
          setDuration(mins);
          if (mode === 'quest') setTimeLeft(mins * 60);
        }}
      />

      <div className="w-full max-w-md flex flex-col items-center gap-10 md:gap-14 my-8">
        
        <HUD user={currentUser} />

        {isAuthMode !== 'none' ? (
          <AuthOverlay 
            isAuthMode={isAuthMode as 'login' | 'register'}
            authForm={authForm}
            authError={authError}
            onFormChange={(username) => setAuthForm({ username })}
            onSubmit={handleAuthSubmit}
            onToggleMode={() => setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login')}
            onCancel={() => setIsAuthMode('none')}
          />
        ) : (
          <div className="flex flex-col items-center gap-8 w-full">
            
            {/* モード切り替え & 入力 */}
            <div className="w-full flex flex-col gap-4">
              {!isActive && (
                <div className="flex justify-center gap-4 animate-in fade-in zoom-in duration-500">
                  <button 
                    onClick={startQuest}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${mode === 'quest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}
                  >
                    <Zap className="w-3 h-3" /> Quest
                  </button>
                  <button 
                    onClick={() => startRest(5)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${mode === 'rest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}
                  >
                    <Coffee className="w-3 h-3" /> Rest
                  </button>
                </div>
              )}

              {!isActive && mode === 'quest' && (
                <div className="w-full animate-in fade-in slide-in-from-top-4 duration-500">
                  <input 
                    type="text"
                    placeholder="Enter Quest Name..."
                    value={questName}
                    onChange={(e) => setQuestName(e.target.value)}
                    className="w-full bg-foreground/5 border-2 border-primary/20 rounded-2xl px-6 py-3 focus:border-primary/50 focus:outline-none transition-all font-bold text-center placeholder:opacity-30"
                  />
                </div>
              )}

              {!isActive && mode === 'rest' && (
                <div className="flex justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  <button 
                    onClick={() => startRest(5)}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${timeLeft === 5*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}
                  >
                    Short Rest (5m)
                  </button>
                  <button 
                    onClick={() => startRest(15)}
                    className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${timeLeft === 15*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}
                  >
                    Long Rest (15m)
                  </button>
                </div>
              )}
            </div>

            <TimerDisplay 
              timeLeft={timeLeft}
              duration={mode === 'quest' ? duration : (timeLeft > 5*60 ? 15 : 5)}
              isActive={isActive}
              message={message}
              formatTime={formatTime}
              questName={mode === 'rest' ? "Resting at Inn" : questName}
            />

            <div className="flex gap-8 md:gap-10">
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
          </div>
        )}

        <div className="flex gap-12 opacity-30 mt-8">
          <Trophy className="w-6 h-6 text-primary" />
          <Crown className="w-6 h-6 text-primary" />
          <Zap className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
