"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Crown, Zap } from 'lucide-react';
import { User } from '@/types';
import { HUD } from '@/components/ui/HUD';
import { Sidebar } from '@/components/ui/Sidebar';
import { AuthOverlay } from '@/components/ui/AuthOverlay';
import { TimerDisplay } from '@/components/ui/TimerDisplay';

// --- In-Memory Mock Database ---
const mockUsers: User[] = [
  { id: '1', username: 'Hero', level: 1, exp: 0 }
];

export default function PomodoroQuest() {
  // --- Auth State ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register' | 'none'>('none');
  const [authForm, setAuthForm] = useState({ username: '' });
  const [authError, setAuthError] = useState("");

  // --- Timer State ---
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
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

    const earnedExp = duration * 10;

    if (currentUser) {
      const newExp = currentUser.exp + earnedExp;
      let newLevel = currentUser.level;
      let finalExp = newExp;

      if (newExp >= 1000) {
        newLevel += 1;
        finalExp = newExp - 1000;
        setMessage(`LEVEL UP! QUEST CLEAR! +${earnedExp} EXP`);
      } else {
        setMessage(`QUEST CLEAR! +${earnedExp} EXP`);
      }

      setCurrentUser({ ...currentUser, level: newLevel, exp: finalExp });
    } else {
      setMessage(`QUEST CLEAR! +${earnedExp} EXP (Sign in to save)`);
    }
    
    setTimeout(() => setMessage(""), 5000);
  }, [duration, currentUser]);

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

  const selectDuration = (mins: number) => {
    if (isActive) return;
    setDuration(mins);
    setTimeLeft(mins * 60);
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
      const exists = mockUsers.find(u => u.username === authForm.username);
      if (exists) {
        setAuthError("Name already taken.");
        return;
      }
      const newUser: User = {
        id: Date.now().toString(),
        username: authForm.username,
        level: 1,
        exp: 0
      };
      mockUsers.push(newUser);
      setCurrentUser(newUser);
      setIsAuthMode('none');
    } else {
      const user = mockUsers.find(u => u.username === authForm.username);
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
        onDurationSelect={selectDuration}
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
          <div className="flex flex-col items-center">
            <TimerDisplay 
              timeLeft={timeLeft}
              duration={duration}
              isActive={isActive}
              message={message}
              formatTime={formatTime}
            />

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
