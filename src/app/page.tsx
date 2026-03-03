"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Shield, Swords, Trophy, Zap, Crown } from 'lucide-react';

export default function PomodoroQuest() {
  // --- 状態管理 (State Management) ---
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 残り時間（秒）
  const [isActive, setIsActive] = useState(false);  // タイマーが動作中かどうか
  const [exp, setExp] = useState(0);                 // 現在の経験値
  const [level, setLevel] = useState(1);             // 現在のレベル
  const [message, setMessage] = useState("");        // 通知メッセージ

  // 秒を MM:SS 形式に変換するヘルパー関数
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // クエスト完了（タイマー終了）時の処理
  const handleQuestComplete = useCallback(() => {
    setIsActive(false);
    setTimeLeft(25 * 60); // タイマーをリセット
    
    // 経験値の加算とレベルアップ判定
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

    // 5秒後にメッセージを消す
    setTimeout(() => setMessage(""), 5000);
  }, []);

  // タイマーのカウントダウン処理
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      // 時間切れになったらクエスト完了処理を呼ぶ
      // 非同期に呼び出すことで render cycle 中の setState を避ける
      timeoutId = setTimeout(handleQuestComplete, 0);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isActive, timeLeft, handleQuestComplete]);

  // タイマーの開始/一時停止を切り替える
  const toggleTimer = () => setIsActive(!isActive);
  
  // タイマーを初期状態にリセットする
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
    setMessage("");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-mono p-4 selection:bg-emerald-500/30">
      {/* HUD - ステータスバー（レベルと経験値の表示） */}
      <div className="w-full max-w-md mb-16 bg-slate-900 border-2 border-emerald-500/20 rounded-xl p-5 shadow-[0_0_30px_rgba(0,0,0,0.6)] backdrop-blur-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
              <Shield className="text-emerald-400 w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.2em] leading-none mb-1">Rank</div>
              <div className="text-2xl font-black italic text-emerald-400 leading-none">Lv. {level}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-emerald-500/60 font-black uppercase tracking-[0.2em] leading-none mb-1">Status</div>
            <div className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">
              {isActive ? "Questing..." : "Resting"}
            </div>
          </div>
        </div>
        
        {/* 経験値バー */}
        <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-emerald-900/50">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_15px_#10b981] transition-all duration-700 ease-out"
            style={{ width: `${(exp / 1000) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2 px-1">
          <span className="text-[10px] font-black text-emerald-500/80 tracking-widest italic uppercase">EXP {exp} / 1000</span>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-2 h-2 rounded-full transition-colors duration-500 ${exp >= (i + 1) * 200 ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'}`} 
              />
            ))}
          </div>
        </div>
      </div>

      {/* メインクエストインターフェース（タイマー部分） */}
      <div className="relative">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-emerald-500/5 rounded-full ${isActive ? 'animate-pulse' : ''}`} />
        
        <main className="relative z-10 flex flex-col items-center">
          <div className={`relative bg-slate-900/80 border-4 rounded-full w-80 h-80 flex flex-col items-center justify-center transition-all duration-500 ${
            isActive ? 'border-emerald-500 shadow-[0_0_60px_rgba(16,185,129,0.2)]' : 'border-slate-800 shadow-2xl'
          }`}>
            <div className="absolute top-10 flex items-center gap-2">
              <Swords className={`w-4 h-4 ${isActive ? 'text-emerald-500 animate-pulse' : 'text-slate-600'}`} />
              <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isActive ? 'text-emerald-500' : 'text-slate-600'}`}>
                Focus Quest
              </span>
            </div>

            {/* 残り時間の表示 */}
            <div className={`text-8xl font-black tracking-tighter ${
              isActive 
                ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.7)]' 
                : 'text-slate-700'
            }`}>
              {formatTime(timeLeft)}
            </div>

            {/* クエスト完了メッセージ */}
            {message && (
              <div className="absolute -bottom-12 whitespace-nowrap animate-bounce">
                <div className="bg-emerald-500 text-slate-950 text-[10px] font-black py-2 px-6 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.6)] uppercase tracking-[0.2em] border-2 border-emerald-300">
                  {message}
                </div>
              </div>
            )}
            
            {/* プログレスサークル */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
              <circle
                cx="160" cy="160" r="154"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="2"
                className="text-emerald-500/5"
              />
              <circle
                cx="160" cy="160" r="154"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={967}
                strokeDashoffset={967 - (967 * (timeLeft / (25 * 60)))}
                className={`${isActive ? 'text-emerald-400' : 'text-slate-800'} transition-all duration-1000 ease-linear`}
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* 操作ボタン */}
          <div className="flex gap-8 mt-20">
            <button
              onClick={toggleTimer}
              className={`group relative w-24 h-24 rounded-3xl transition-all duration-300 transform active:scale-95 flex items-center justify-center border-b-4 ${
                isActive 
                  ? 'bg-slate-800 border-slate-950 hover:bg-slate-700' 
                  : 'bg-emerald-600 border-emerald-800 hover:bg-emerald-500'
              }`}
            >
              {isActive ? (
                <Pause className="w-10 h-10 text-slate-300" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
              <div className={`absolute -inset-2 blur-xl opacity-0 group-hover:opacity-20 transition-opacity ${isActive ? 'bg-slate-400' : 'bg-emerald-400'}`} />
            </button>

            <button
              onClick={resetTimer}
              className="group relative w-24 h-24 rounded-3xl bg-slate-800 border-b-4 border-slate-950 hover:bg-slate-700 transition-all duration-300 transform active:scale-95 flex items-center justify-center"
            >
              <RotateCcw className="w-8 h-8 text-slate-500 group-hover:text-slate-200 group-hover:rotate-[-45deg] transition-all" />
            </button>
          </div>
        </main>
      </div>

      {/* 装飾用アイコン */}
      <div className="mt-20 flex gap-12 opacity-20">
        <Trophy className="w-6 h-6 text-emerald-500" />
        <Crown className="w-6 h-6 text-emerald-500" />
        <Zap className="w-6 h-6 text-emerald-500" />
      </div>
    </div>
  );
}
