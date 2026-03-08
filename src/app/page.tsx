"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
// Lucide React からアイコンをインポート
import { Trophy, Crown, Zap, Coffee, Skull, Flame, Play, Pause, RotateCcw, BookOpen, MessageSquare, Target, Settings2, Swords, Shield, Sparkles } from 'lucide-react';
// 型定義と定数をインポート
import { QuestLog, User } from '@/types';
import { titles } from '@/constants';
// UIコンポーネントをインポート
import { HUD } from '@/components/ui/HUD';
import { Sidebar } from '@/components/ui/Sidebar';
import { AuthOverlay } from '@/components/ui/AuthOverlay';
import { TimerDisplay } from '@/components/ui/TimerDisplay';
import { QuestLogPanel } from '@/components/ui/QuestLogPanel';

// ロジックを管理するカスタムフックをインポート
import { useAudio } from '@/hooks/useAudio';
import { useUser } from '@/hooks/useUser';
import { useTimer, Difficulty } from '@/hooks/useTimer';
import { useGuild } from '@/hooks/useGuild';
import { useSettings } from '@/hooks/useSettings';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * メインのアプリケーションコンポーネント
 * ポモドーロタイマーとRPG要素を組み合わせたメイン画面を提供します。
 */
export default function PomodoroQuest() {
  const { settings, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [message, setMessage] = useState(""); // 画面中央に表示する通知メッセージ
  const [isLogsOpen, setIsLogsOpen] = useState(false); // 履歴パネルが開いているか
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // サイドバーが開いているか
  const [isAuthMode, setIsAuthMode] = useState<'login' | 'register' | 'none'>('none'); // 認証画面の状態
  const [authForm, setAuthForm] = useState({ username: '' }); // ログイン/登録フォームの入力値
  const [authError, setAuthError] = useState(""); // 認証エラーメッセージ
  const [isStarted, setIsStarted] = useState(false); // スタート画面を抜けたか

  // --- カスタムフックからロジックを抽出 ---
  const { isSoundOn, playEffect, toggleSound } = useAudio();
  const { 
    currentUser, questLogs, isMounted, updateCurrentUserAndList, 
    addQuestLog, checkNewTitles, login, register, logout 
  } = useUser();
  const { guildInfo } = useGuild();

  /**
   * タイマーが完了した時の処理
   */
  const handleComplete = useCallback((mode: 'quest' | 'rest', isBoss: boolean, duration: number, qName: string, difficulty: Difficulty) => {
    playEffect('complete'); 
    
    if (mode === 'quest') {
      const multipliers = { easy: 1.0, normal: 1.5, hard: 2.0, insane: 3.0 };
      let earnedExp = Math.floor(duration * 10 * multipliers[difficulty]);
      if (isBoss) earnedExp *= 2;

      const displayName = isBoss ? `BOSS: ${qName || t.timer.ancientEvil}` : (qName || t.common.quest);
      const newLog: QuestLog = { 
        id: Date.now().toString(), 
        userId: currentUser?.id || 'guest', 
        name: displayName, 
        duration, 
        difficulty,
        earnedExp, 
        createdAt: Date.now() 
      };
      
      addQuestLog(newLog); 

      if (currentUser) {
        const newExp = currentUser.exp + earnedExp;
        let newLevel = currentUser.level;
        let finalExp = newExp;

        if (newExp >= 1000) { 
          newLevel += 1; 
          finalExp = newExp - 1000; 
          setMessage(t.timer.levelUp.replace('{name}', displayName).replace('{exp}', earnedExp.toString())); 
          setTimeout(() => playEffect('level-up'), 500);
        } else { 
          setMessage(t.timer.defeated.replace('{name}', displayName).replace('{exp}', earnedExp.toString())); 
        }

        const today = new Date().setHours(0,0,0,0);
        const todayTime = [newLog, ...questLogs]
          .filter(l => l.userId === currentUser.id && new Date(l.createdAt).setHours(0,0,0,0) === today)
          .reduce((acc, l) => acc + l.duration, 0);
        
        if (todayTime >= guildInfo.dailyQuest.requirement && todayTime - duration < guildInfo.dailyQuest.requirement) {
          setTimeout(() => {
            setMessage(t.timer.dailyChallengeComplete.replace('{title}', guildInfo.dailyQuest.title));
            playEffect('level-up');
          }, 2000);
        }

        const updatedUser: User = { 
          ...currentUser, 
          level: newLevel, 
          exp: finalExp,
          totalFocusTime: (currentUser.totalFocusTime || 0) + duration,
          completedQuestsCount: (currentUser.completedQuestsCount || 0) + 1
        };
        updateCurrentUserAndList(updatedUser);
        
        checkNewTitles(updatedUser, [newLog, ...questLogs], (title) => 
          setMessage(`NEW TITLE UNLOCKED: ${title}!`)
        );
      } else {
        setMessage(t.timer.questClear.replace('{name}', displayName).replace('{exp}', earnedExp.toString()));
      }
    } else {
      setMessage(t.timer.restComplete);
    }
    
    setTimeout(() => setMessage(""), 5000);
  }, [currentUser, playEffect, addQuestLog, updateCurrentUserAndList, checkNewTitles, questLogs, guildInfo, t]);

  const timer = useTimer({ onComplete: handleComplete });

  useEffect(() => { 
    if (timer.isBossMode && timer.isActive) {
      document.documentElement.setAttribute('data-theme', 'ruby'); 
    } else {
      document.documentElement.setAttribute('data-theme', settings.theme);
    }
  }, [settings.theme, timer.isBossMode, timer.isActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!authForm.username.trim()) return setAuthError(t.auth.errorEnterName);

    const result = isAuthMode === 'register' ? register(authForm.username) : login(authForm.username);
    
    if (result.success) {
      setIsAuthMode('none');
    } else if (result.error) {
      setAuthError(result.error);
    }
    
    setAuthForm({ username: '' });
  };

  const userLogs = currentUser ? questLogs.filter(log => log.userId === currentUser.id) : questLogs.filter(log => log.userId === 'guest');
  const currentTitleName = titles.find(t => t.id === currentUser?.currentTitleId)?.name;

  const today = new Date().setHours(0,0,0,0);
  const todayTotalMins = userLogs
    .filter(l => new Date(l.createdAt).setHours(0,0,0,0) === today)
    .reduce((acc, l) => acc + l.duration, 0);
  const dqProgress = Math.min(100, (todayTotalMins / guildInfo.dailyQuest.requirement) * 100);

  /**
   * スタート画面のレンダリング
   */
  if (!isStarted && isMounted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden relative">
        {/* 背景の装飾 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-12 text-center animate-in fade-in zoom-in duration-1000">
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4 mb-2">
              <Shield className="w-8 h-8 text-primary opacity-40 animate-bounce" />
              <Swords className="w-12 h-12 text-primary" />
              <Shield className="w-8 h-8 text-primary opacity-40 animate-bounce delay-100" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black uppercase tracking-[0.3em] text-primary italic drop-shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]">
              {t.start.title}
            </h1>
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.5em] opacity-40 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3" /> {t.start.subtitle} <Sparkles className="w-3 h-3" />
            </p>
          </div>

          <button 
            onClick={() => { playEffect('level-up'); setIsStarted(true); }}
            className="group relative px-12 py-6 bg-primary text-primary-foreground rounded-[2.5rem] font-black uppercase tracking-[0.4em] text-sm shadow-[0_0_40px_var(--color-primary-glow)] hover:scale-110 active:scale-95 transition-all duration-500 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
            <span className="relative z-10">{t.start.pressStart}</span>
          </button>

          <div className="fixed bottom-8 flex flex-col items-center gap-2 opacity-20 hover:opacity-50 transition-opacity">
            <span className="text-[10px] font-black uppercase tracking-widest">{t.start.version}</span>
            <div className="flex gap-4">
              <Trophy className="w-4 h-4" /><Crown className="w-4 h-4" /><Zap className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // メインのクエストUI
  return (
    <div className={`min-h-screen transition-colors duration-1000 flex flex-col items-center justify-center font-mono p-4 md:p-8 selection:bg-primary/30 overflow-x-hidden animate-in fade-in duration-1000 ${timer.isBossMode && timer.isActive ? 'bg-red-950/20' : 'bg-background'}`}>
      
      {/* 右上の設定トグルボタン */}
      <div className="fixed top-6 right-6 md:top-24 md:right-8 z-[60]">
        <button 
          onClick={() => { playEffect('click'); setIsSidebarOpen(true); }}
          className="group flex items-center gap-2 p-3 bg-background/40 border-2 border-primary/20 rounded-2xl hover:bg-primary/10 hover:border-primary/40 transition-all shadow-lg backdrop-blur-md"
        >
          <Settings2 className="w-5 h-5 text-primary group-hover:rotate-90 transition-transform duration-500" />
          <span className="text-[10px] font-black uppercase tracking-widest pr-1 hidden md:inline">{t.common.config}</span>
        </button>
      </div>

      {/* 右側の操作パネル（モーダル） */}
      <Sidebar 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentUser={currentUser} currentTheme={settings.theme} duration={timer.duration} isActive={timer.isActive} isSoundOn={isSoundOn}
        onLogout={() => { playEffect('click'); logout(); timer.setIsActive(false); setIsSidebarOpen(false); }}
        onOpenAuth={() => { playEffect('click'); setIsAuthMode('login'); setIsSidebarOpen(false); }}        
        onThemeChange={(theme) => { playEffect('click'); updateSettings({ theme }); }}
        onDurationSelect={timer.selectDuration}

        onOpenLogs={() => { playEffect('click'); setIsLogsOpen(true); setIsSidebarOpen(false); }}
        onToggleSound={toggleSound}
      />

      {/* 履歴パネル（開いている時のみ表示） */}
      {isLogsOpen && <QuestLogPanel logs={userLogs} onClose={() => { playEffect('click'); setIsLogsOpen(false); }} />}
      
      <div className="w-full max-w-md flex flex-col items-center gap-8 md:gap-12 my-8">
        
        {/* ギルド全体へのお知らせ */}
        {guildInfo.globalMessage && (
          <div className="w-full bg-primary/10 border border-primary/20 rounded-2xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-1000">
            <MessageSquare className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold leading-relaxed text-primary/80 italic">
              &quot;{guildInfo.globalMessage}&quot;
            </p>
          </div>
        )}

        {/* デイリーチャレンジ進捗 */}
        <div className="w-full bg-foreground/5 border border-foreground/10 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">{guildInfo.dailyQuest.title}</span>
            </div>
            <span className="text-[9px] font-black opacity-40">{todayTotalMins} / {guildInfo.dailyQuest.requirement} {t.common.mins.toUpperCase()}</span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden border border-foreground/5">
            <div 
              className={`h-full transition-all duration-1000 ${dqProgress >= 100 ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-primary'}`}
              style={{ width: `${dqProgress}%` }}
            />
          </div>
        </div>

        {/* 上部のステータスバー */}
        <Link href={isMounted && currentUser ? "/profile" : "#"} className="w-full cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]" onClick={(e) => { if(!currentUser) { e.preventDefault(); playEffect('click'); setIsAuthMode('login'); } else { playEffect('click'); } }}>
          <HUD user={currentUser} currentTitle={currentTitleName} />
        </Link>

        {/* 認証オーバーレイ、またはタイマーUI */}
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
                    <button onClick={() => { playEffect('click'); timer.setQuestMode(); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${timer.mode === 'quest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}><Zap className="w-3 h-3" /> {t.common.quest}</button>
                    <button onClick={() => { playEffect('click'); timer.setRestTime(5); }} className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all font-black text-[10px] uppercase tracking-widest ${timer.mode === 'rest' ? 'border-primary bg-primary/10 text-primary' : 'border-foreground/10 opacity-40 hover:opacity-100'}`}><Coffee className="w-3 h-3" /> {t.common.rest}</button>
                  </div>
                  {timer.mode === 'quest' && (
                    <div className="flex flex-col items-center gap-3 w-full">
                      <div className="flex gap-1.5 p-1 bg-foreground/5 rounded-xl border border-primary/10">
                        {(['easy', 'normal', 'hard', 'insane'] as Difficulty[]).map(d => (
                          <button key={d} onClick={() => { playEffect('click'); timer.setDifficulty(d); }} className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase transition-all ${timer.difficulty === d ? 'bg-primary text-primary-foreground shadow-md' : 'opacity-40 hover:opacity-100'}`}>{t.timer[d]}</button>
                        ))}
                      </div>
                      <button onClick={() => { playEffect('click'); timer.setIsBossMode(!timer.isBossMode); }} className={`flex items-center gap-2 px-6 py-2 rounded-full border-2 transition-all font-black text-[10px] uppercase tracking-widest ${timer.isBossMode ? 'bg-red-600 border-red-400 text-white shadow-[0_0_20px_rgba(220,38,38,0.5)]' : 'bg-foreground/5 border-foreground/10 opacity-40 hover:opacity-100'}`}><Skull className={`w-4 h-4 ${timer.isBossMode ? 'animate-pulse' : ''}`} /> {t.timer.bossMode} {timer.isBossMode ? t.timer.bossModeOn : t.timer.bossModeOff}</button>
                    </div>
                  )}
                </div>
              )}
              {!timer.isActive && timer.mode === 'quest' && <input type="text" placeholder={timer.isBossMode ? t.timer.enterBossName : t.timer.enterQuestName} value={timer.questName} onChange={(e) => timer.setQuestName(e.target.value)} className={`w-full bg-foreground/5 border-2 rounded-2xl px-6 py-3 focus:outline-none transition-all font-bold text-center placeholder:opacity-30 ${timer.isBossMode ? 'border-red-500/50 focus:border-red-500' : 'border-primary/20 focus:border-primary/50'}`} />}
              {!timer.isActive && timer.mode === 'rest' && (
                <div className="flex flex-col items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500 w-full">
                  <div className="flex justify-center gap-3 w-full">
                    <button onClick={() => { playEffect('click'); timer.setTimeLeft(5*60); }} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${timer.timeLeft === 5*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}>{t.timer.shortRest}</button>
                    <button onClick={() => { playEffect('click'); timer.setTimeLeft(15*60); }} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase transition-all ${timer.timeLeft === 15*60 ? 'bg-primary text-primary-foreground' : 'bg-foreground/5 opacity-60'}`}>{t.timer.longRest}</button>
                  </div>
                  {currentUser && (
                    <Link href="/journal" onClick={() => playEffect('click')} className="flex items-center justify-center gap-2 w-full bg-foreground/5 border-2 border-primary/20 rounded-xl px-4 py-3 hover:bg-primary/10 hover:border-primary/50 transition-all font-black text-[10px] uppercase tracking-widest text-primary/80 group">
                      <BookOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      {t.timer.writeInJournal}
                    </Link>
                  )}
                </div>
              )}
            </div>
            {timer.isBossMode && timer.isActive && <div className="flex items-center gap-2 text-red-500 animate-bounce"><Flame className="w-4 h-4 fill-current" /><span className="text-[10px] font-black uppercase tracking-[0.3em]">{t.timer.extremeConcentration}</span><Flame className="w-4 h-4 fill-current" /></div>}
            <TimerDisplay timeLeft={timer.timeLeft} duration={timer.mode === 'quest' ? timer.duration : (timer.timeLeft > 5*60 ? 15 : 5)} isActive={timer.isActive} message={message} formatTime={formatTime} questName={timer.isBossMode ? `BOSS: ${timer.questName || t.timer.ancientEvil}` : (timer.mode === 'rest' ? t.timer.restingAtInn : timer.questName)} />
            <div className="flex gap-8 md:gap-10">
              <button onClick={() => { if (!timer.isActive && timer.isBossMode) playEffect('boss'); timer.toggleTimer(); }} disabled={timer.isActive && timer.isBossMode} className={`group relative w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] transition-all duration-300 transform active:scale-90 flex items-center justify-center border-b-4 ${timer.isActive ? (timer.isBossMode ? 'bg-red-900/40 border-red-950 opacity-50 cursor-not-allowed' : 'bg-foreground/10 border-foreground/20') : (timer.isBossMode ? 'bg-red-600 border-red-800 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)]' : 'bg-primary border-primary/50 text-primary-foreground')}`}>{timer.isActive ? <Pause className="w-8 h-8 md:w-10 md:h-10" /> : <Play className="w-8 h-8 md:w-10 md:h-10 ml-1" />}<div className={`absolute -inset-2 blur-2xl opacity-0 group-hover:opacity-20 transition-opacity rounded-full ${timer.isActive ? 'bg-foreground' : (timer.isBossMode ? 'bg-red-500' : 'bg-primary')}`} /></button>
              <button onClick={() => {
                if (timer.isActive && timer.isBossMode && currentUser) {
                  const penalty = 50;
                  const newExp = Math.max(0, currentUser.exp - penalty);
                  updateCurrentUserAndList({ ...currentUser, exp: newExp });
                  setMessage(t.timer.fledFromBoss.replace('{penalty}', penalty.toString()));
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
