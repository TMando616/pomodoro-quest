"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Trophy, Crown, Zap, Coffee } from 'lucide-react';
import { User, QuestLog } from '@/types';
import { titles } from '@/constants';
import { HUD } from '@/components/ui/HUD';
import { Sidebar } from '@/components/ui/Sidebar';
import { AuthOverlay } from '@/components/ui/AuthOverlay';
import { TimerDisplay } from '@/components/ui/TimerDisplay';
import { QuestLogPanel } from '@/components/ui/QuestLogPanel';
import { ProfilePanel } from '@/components/ui/ProfilePanel';

export default function PomodoroQuest() {
  // --- Timer State (Declared earlier to avoid hoisting issues) ---
  const [questName, setQuestName] = useState("");
  const [duration, setDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'quest' | 'rest'>('quest');
  const [message, setMessage] = useState("");
  const [currentTheme, setCurrentTheme] = useState('emerald');

  // --- Auth & Persistence State ---
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_users');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', username: 'Hero', level: 1, exp: 0, unlockedTitles: ['novice'], currentTitleId: 'novice' }];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('pq_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [questLogs, setQuestLogs] = useState<QuestLog[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register' | 'none'>('none');
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '' });
  const [authError, setAuthError] = useState("");

  useEffect(() => { localStorage.setItem('pq_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('pq_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('pq_current_user');
  }, [currentUser]);
  useEffect(() => { localStorage.setItem('pq_logs', JSON.stringify(questLogs)); }, [questLogs]);

  const updateCurrentUserAndList = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, []);

  // 称号のチェックとアンロック
  const checkNewTitles = useCallback((user: User, logs: QuestLog[]) => {
    const newlyUnlocked = titles
      .filter(t => !user.unlockedTitles.includes(t.id))
      .filter(t => t.condition(user, logs))
      .map(t => t.id);
    
    if (newlyUnlocked.length > 0) {
      const updatedUser = {
        ...user,
        unlockedTitles: [...user.unlockedTitles, ...newlyUnlocked]
      };
      updateCurrentUserAndList(updatedUser);
      setMessage(`NEW TITLE UNLOCKED: ${titles.find(t => t.id === newlyUnlocked[0])?.name}!`);
    }
  }, [updateCurrentUserAndList]);

  useEffect(() => { document.documentElement.setAttribute('data-theme', currentTheme); }, [currentTheme]);

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
      const newLog: QuestLog = { id: Date.now().toString(), userId: currentUser?.id || 'guest', name: displayName, duration, earnedExp, createdAt: Date.now() };
      const updatedLogs = [newLog, ...questLogs];
      setQuestLogs(updatedLogs);

      if (currentUser) {
        const newExp = currentUser.exp + earnedExp;
        let newLevel = currentUser.level;
        let finalExp = newExp;
        if (newExp >= 1000) { newLevel += 1; finalExp = newExp - 1000; setMessage(`LEVEL UP! ${displayName} CLEAR! +${earnedExp} EXP`); }
        else { setMessage(`${displayName} CLEAR! +${earnedExp} EXP`); }
        
        const updatedUser = { ...currentUser, level: newLevel, exp: finalExp };
        updateCurrentUserAndList(updatedUser);
        checkNewTitles(updatedUser, updatedLogs);
      } else {
        setMessage(`${displayName} CLEAR! +${earnedExp} EXP (Sign in to save)`);
      }
      setMode('rest');
      setTimeLeft(5 * 60);
    } else {
      setMessage("REST COMPLETE!");
      setMode('quest');
      setTimeLeft(duration * 60);
    }
    setTimeout(() => setMessage(""), 5000);
  }, [duration, currentUser, updateCurrentUserAndList, questName, mode, questLogs, checkNewTitles]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    else if (timeLeft === 0 && isActive) setTimeout(handleTimerComplete, 0);
    return () => { if (interval) clearInterval(interval); };
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(mode === 'quest' ? duration * 60 : 5 * 60); setMessage(""); };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authForm.username.trim()) return setAuthError("Enter your adventurer name.");
    if (isAuthMode === 'register') {
      if (users.find(u => u.username === authForm.username)) return setAuthError("Name taken.");
      const newUser: User = { id: Date.now().toString(), username: authForm.username, level: 1, exp: 0, unlockedTitles: ['novice'], currentTitleId: 'novice' };
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsAuthMode('none');
    } else {
      const user = users.find(u => u.username === authForm.username);
      if (!user) return setAuthError("Adventurer not found.");
      setCurrentUser(user);
      setIsAuthMode('none');
    }
    setAuthForm({ username: '' });
  };

  const userLogs = currentUser ? questLogs.filter(log => log.userId === currentUser.id) : questLogs.filter(log => log.userId === 'guest');
  const currentTitle = titles.find(t => t.id === currentUser?.currentTitleId)?.name;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center font-mono p-4 md:p-8 selection:bg-primary/30 transition-colors duration-500 overflow-x-hidden">
      
      <Sidebar 
        currentUser={currentUser} currentTheme={currentTheme} duration={duration} isActive={isActive}
        onLogout={() => { setCurrentUser(null); setIsActive(false); }}
        onOpenAuth={() => setIsAuthMode('login')}
        onThemeChange={setCurrentTheme}
        onDurationSelect={(mins) => { setDuration(mins); if (mode === 'quest') setTimeLeft(mins * 60); }}
        onOpenLogs={() => setIsLogsOpen(true)}
      />

      {isLogsOpen && <QuestLogPanel logs={userLogs} onClose={() => setIsLogsOpen(false)} />}
      
      {isProfileOpen && currentUser && (
        <ProfilePanel 
          user={currentUser} 
          onClose={() => setIsProfileOpen(false)} 
          onEquipTitle={(id) => updateCurrentUserAndList({ ...currentUser, currentTitleId: id })}
        />
      )}

      <div className="w-full max-w-md flex flex-col items-center gap-10 md:gap-14 my-8">
        
        <div className="w-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]" onClick={() => currentUser && setIsProfileOpen(true)}>
          <HUD user={currentUser} currentTitle={currentTitle} />
        </div>

        {isAuthMode !== 'none' ? (
          <AuthOverlay 
            isAuthMode={isAuthMode as 'login' | 'register'} authForm={authForm} authError={authError}
            onFormChange={(username) => setAuthForm({ username })} onSubmit={handleAuthSubmit}
            onToggleMode={() => setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login')}
            onCancel={() => setIsAuthMode('none')}
          />
        ) : (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="w-full flex flex-col gap-4">
              {!isActive && (
                <div className="flex justify-center gap-4 animate-in fade-in zoom-in duration-500">
                  <button onClick={() => { setMode('quest'); setTimeLeft(duration * 60); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${mode === 'quest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}><Zap className="w-3 h-3" /> Quest</button>
                  <button onClick={() => { setMode('rest'); setTimeLeft(5 * 60); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${mode === 'rest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}><Coffee className="w-3 h-3" /> Rest</button>
                </div>
              )}
              {!isActive && mode === 'quest' && <input type="text" placeholder="Enter Quest Name..." value={questName} onChange={(e) => setQuestName(e.target.value)} className="w-full bg-foreground/5 border-2 border-primary/20 rounded-2xl px-6 py-3 focus:border-primary/50 focus:outline-none transition-all font-bold text-center placeholder:opacity-30" />}
              {!isActive && mode === 'rest' && (
                <div className="flex justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  <button onClick={() => setTimeLeft(5*60)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${timeLeft === 5*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}>Short (5m)</button>
                  <button onClick={() => setTimeLeft(15*60)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${timeLeft === 15*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}>Long (15m)</button>
                </div>
              )}
            </div>
            <TimerDisplay timeLeft={timeLeft} duration={mode === 'quest' ? duration : (timeLeft > 5*60 ? 15 : 5)} isActive={isActive} message={message} formatTime={formatTime} questName={mode === 'rest' ? "Resting at Inn" : questName} />
            <div className="flex gap-8 md:gap-10">
              <button onClick={toggleTimer} className={`group relative w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] transition-all duration-300 transform active:scale-90 flex items-center justify-center border-b-4 ${isActive ? 'bg-foreground/10 border-foreground/20' : 'bg-primary border-primary/50 text-primary-foreground'}`}>
                {isActive ? <Pause className="w-8 h-8 md:w-10 md:h-10" /> : <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />}
                <div className={`absolute -inset-2 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full ${isActive ? 'bg-foreground' : 'bg-primary'}`} />
              </button>
              <button onClick={resetTimer} className="group relative w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-foreground/5 border-b-4 border-foreground/10 hover:bg-foreground/10 transition-all duration-300 transform active:scale-90 flex items-center justify-center shadow-lg">
                <RotateCcw className="w-8 h-8 md:w-9 md:h-9 opacity-40 group-hover:opacity-100 group-hover:rotate-[-45deg] transition-all" />
              </button>
            </div>
          </div>
        )}
        <div className="flex gap-12 opacity-30 mt-8">
          <Trophy className="w-6 h-6 text-primary" /><Crown className="w-6 h-6 text-primary" /><Zap className="w-6 h-6 text-primary" />
        </div>
      </div>
    </div>
  );
}
