"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Crown, Zap, Coffee, Skull, Flame, Play, Pause, RotateCcw } from 'lucide-react';
import { QuestLog } from '@/types';
import { titles } from '@/constants';
import { HUD } from '@/components/ui/HUD';
import { Sidebar } from '@/components/ui/Sidebar';
import { AuthOverlay } from '@/components/ui/AuthOverlay';
import { TimerDisplay } from '@/components/ui/TimerDisplay';
import { QuestLogPanel } from '@/components/ui/QuestLogPanel';
import { ProfilePanel } from '@/components/ui/ProfilePanel';

// Hooks
import { useAudio } from '@/hooks/useAudio';
import { useUser } from '@/hooks/useUser';
import { useTimer } from '@/hooks/useTimer';

export default function PomodoroQuest() {
  const [message, setMessage] = useState("");
  const [currentTheme, setCurrentTheme] = useState('emerald');
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register' | 'none'>('none');
  const [authForm, setAuthForm] = useState({ username: '' });
  const [authError, setAuthError] = useState("");

  const { isSoundOn, playEffect, toggleSound } = useAudio();
  const { 
    currentUser, questLogs, updateCurrentUserAndList, 
    addQuestLog, checkNewTitles, login, register, logout 
  } = useUser();

  const handleComplete = useCallback((mode: 'quest' | 'rest', isBoss: boolean, duration: number, qName: string) => {
    playEffect('complete');
    
    if (mode === 'quest') {
      let earnedExp = duration * 10;
      if (isBoss) earnedExp *= 2;

      const displayName = isBoss ? `BOSS: ${qName || "Unknown"}` : (qName || "Quest");
      const newLog: QuestLog = { id: Date.now().toString(), userId: currentUser?.id || 'guest', name: displayName, duration, earnedExp, createdAt: Date.now() };
      
      addQuestLog(newLog);

      if (currentUser) {
        const newExp = currentUser.exp + earnedExp;
        let newLevel = currentUser.level;
        let finalExp = newExp;
        if (newExp >= 1000) { 
          newLevel += 1; finalExp = newExp - 1000; 
          setMessage(`LEVEL UP! ${displayName} DEFEATED! +${earnedExp} EXP`); 
          setTimeout(() => playEffect('level-up'), 500);
        } else { 
          setMessage(`${displayName} DEFEATED! +${earnedExp} EXP`); 
        }
        const updatedUser = { ...currentUser, level: newLevel, exp: finalExp };
        updateCurrentUserAndList(updatedUser);
        checkNewTitles(updatedUser, [newLog, ...questLogs], (title) => setMessage(`NEW TITLE UNLOCKED: ${title}!`));
      } else {
        setMessage(`${displayName} CLEAR! +${earnedExp} EXP (Sign in to save)`);
      }
    } else {
      setMessage("REST COMPLETE!");
    }
    setTimeout(() => setMessage(""), 5000);
  }, [currentUser, playEffect, addQuestLog, updateCurrentUserAndList, checkNewTitles, questLogs]);

  const timer = useTimer({ onComplete: handleComplete });

  useEffect(() => { 
    document.documentElement.setAttribute('data-theme', timer.isBossMode && timer.isActive ? 'ruby' : currentTheme); 
  }, [currentTheme, timer.isBossMode, timer.isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!authForm.username.trim()) return setAuthError("Enter name.");

    const result = isAuthMode === 'register' ? register(authForm.username) : login(authForm.username);
    
    if (result.success) setIsAuthMode('none');
    else if (result.error) setAuthError(result.error);
    
    setAuthForm({ username: '' });
  };

  const userLogs = currentUser ? questLogs.filter(log => log.userId === currentUser.id) : questLogs.filter(log => log.userId === 'guest');
  const currentTitle = titles.find(t => t.id === currentUser?.currentTitleId)?.name;

  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center font-mono p-4 md:p-8 selection:bg-primary/30 overflow-x-hidden ${timer.isBossMode && timer.isActive ? 'bg-red-950/20' : 'bg-background'}`}>
      
      <Sidebar 
        currentUser={currentUser} currentTheme={currentTheme} duration={timer.duration} isActive={timer.isActive} isSoundOn={isSoundOn}
        onLogout={() => { playEffect('click'); logout(); timer.setIsActive(false); }}
        onOpenAuth={() => { playEffect('click'); setIsAuthMode('login'); }}
        onThemeChange={(theme) => { playEffect('click'); setCurrentTheme(theme); }}
        onDurationSelect={timer.selectDuration}
        onOpenLogs={() => { playEffect('click'); setIsLogsOpen(true); }}
        onToggleSound={toggleSound}
      />

      {isLogsOpen && <QuestLogPanel logs={userLogs} onClose={() => { playEffect('click'); setIsLogsOpen(false); }} />}
      
      {isProfileOpen && currentUser && (
        <ProfilePanel 
          user={currentUser} 
          onClose={() => { playEffect('click'); setIsProfileOpen(false); }} 
          onEquipTitle={(id) => { playEffect('click'); updateCurrentUserAndList({ ...currentUser, currentTitleId: id }); }}
        />
      )}

      <div className="w-full max-w-md flex flex-col items-center gap-10 md:gap-14 my-8">
        
        <div className="w-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]" onClick={() => { if(currentUser) { playEffect('click'); setIsProfileOpen(true); } }}>
          <HUD user={currentUser} currentTitle={currentTitle} />
        </div>

        {isAuthMode !== 'none' ? (
          <AuthOverlay 
            isAuthMode={isAuthMode as 'login' | 'register'} authForm={authForm} authError={authError}
            onFormChange={(username) => setAuthForm({ username })} onSubmit={(e) => { playEffect('click'); handleAuthSubmit(e); }}
            onToggleMode={() => { playEffect('click'); setIsAuthMode(isAuthMode === 'login' ? 'register' : 'login'); }}
            onCancel={() => { playEffect('click'); setIsAuthMode('none'); }}
          />
        ) : (
          <div className="flex flex-col items-center gap-8 w-full">
            <div className="w-full flex flex-col gap-4">
              {!timer.isActive && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-500">
                  <div className="flex justify-center gap-4">
                    <button onClick={() => { playEffect('click'); timer.setQuestMode(); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${timer.mode === 'quest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}><Zap className="w-3 h-3" /> Quest</button>
                    <button onClick={() => { playEffect('click'); timer.setRestTime(5); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${timer.mode === 'rest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}><Coffee className="w-3 h-3" /> Rest</button>
                  </div>
                  {timer.mode === 'quest' && (
                    <button onClick={() => { playEffect('click'); timer.setIsBossMode(!timer.isBossMode); }} className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-all font-black text-[10px] uppercase tracking-widest ${timer.isBossMode ? 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-foreground/5 border-foreground/10 opacity-40 hover:opacity-100'}`}><Skull className={`w-4 h-4 ${timer.isBossMode ? 'animate-pulse' : ''}`} /> Boss Battle Mode {timer.isBossMode ? 'ON' : 'OFF'}</button>
                  )}
                </div>
              )}
              {!timer.isActive && timer.mode === 'quest' && <input type="text" placeholder={timer.isBossMode ? "Enter Boss Name..." : "Enter Quest Name..."} value={timer.questName} onChange={(e) => timer.setQuestName(e.target.value)} className={`w-full bg-foreground/5 border-2 rounded-2xl px-6 py-3 focus:outline-none transition-all font-bold text-center placeholder:opacity-30 ${timer.isBossMode ? 'border-red-500/50 focus:border-red-500' : 'border-primary/20 focus:border-primary/50'}`} />}
              {!timer.isActive && timer.mode === 'rest' && (
                <div className="flex justify-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500">
                  <button onClick={() => { playEffect('click'); timer.setTimeLeft(5*60); }} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${timer.timeLeft === 5*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}>Short (5m)</button>
                  <button onClick={() => { playEffect('click'); timer.setTimeLeft(15*60); }} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${timer.timeLeft === 15*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}>Long (15m)</button>
                </div>
              )}
            </div>
            {timer.isBossMode && timer.isActive && <div className="flex items-center gap-2 text-red-500 animate-bounce"><Flame className="w-4 h-4 fill-current" /><span className="text-[10px] font-black uppercase tracking-[0.3em]">Extreme Concentration Required</span><Flame className="w-4 h-4 fill-current" /></div>}
            <TimerDisplay timeLeft={timer.timeLeft} duration={timer.mode === 'quest' ? timer.duration : (timer.timeLeft > 5*60 ? 15 : 5)} isActive={timer.isActive} message={message} formatTime={formatTime} questName={timer.isBossMode ? `BOSS: ${timer.questName || "ANCIENT EVIL"}` : (timer.mode === 'rest' ? "Resting at Inn" : timer.questName)} />
            <div className="flex gap-8 md:gap-10">
              <button onClick={() => { if (!timer.isActive && timer.isBossMode) playEffect('boss'); timer.toggleTimer(); }} disabled={timer.isActive && timer.isBossMode} className={`group relative w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] transition-all duration-300 transform active:scale-90 flex items-center justify-center border-b-4 ${timer.isActive ? (timer.isBossMode ? 'bg-red-900/40 border-red-950 opacity-50 cursor-not-allowed' : 'bg-foreground/10 border-foreground/20') : (timer.isBossMode ? 'bg-red-600 border-red-800 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'bg-primary border-primary/50 text-primary-foreground')}`}>{timer.isActive ? <Pause className="w-8 h-8 md:w-10 md:h-10" /> : <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />}<div className={`absolute -inset-2 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full ${timer.isActive ? 'bg-foreground' : (timer.isBossMode ? 'bg-red-500' : 'bg-primary')}`} /></button>
              <button onClick={() => {
                if (timer.isActive && timer.isBossMode && currentUser) {
                  const penalty = 50;
                  const newExp = Math.max(0, currentUser.exp - penalty);
                  updateCurrentUserAndList({ ...currentUser, exp: newExp });
                  setMessage(`FLED FROM BOSS! -${penalty} EXP PENALTY`);
                  setTimeout(() => setMessage(""), 5000);
                }
                playEffect('click'); timer.resetTimer(); 
              }} className="group relative w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-foreground/5 border-b-4 border-foreground/10 hover:bg-foreground/10 transition-all duration-300 transform active:scale-90 flex items-center justify-center shadow-lg"><RotateCcw className="w-8 h-8 md:w-9 md:h-9 opacity-40 group-hover:opacity-100 group-hover:rotate-[-45deg] transition-all" /></button>
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
