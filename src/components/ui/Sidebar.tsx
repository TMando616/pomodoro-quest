"use client";

import React from 'react';
import Link from 'next/link';
// Lucide React からアイコンをインポート
import { Moon, Sun, LogIn, LogOut, ScrollText, Volume2, VolumeX, Shield } from 'lucide-react';
// 型定義と定数をインポート
import { ThemeCategory, User } from '@/types';
import { themes, durationOptions } from '@/constants';

/**
 * サイドバーコンポーネントのプロパティ（受け取るデータ）の定義
 */
type SidebarProps = {
  currentUser: User | null; // ログイン中のユーザー情報
  currentTheme: string;      // 現在選択されているテーマ
  duration: number;          // 現在設定されているクエスト時間
  isActive: boolean;         // タイマーが動いているか
  isSoundOn: boolean;        // サウンドが有効か
  onLogout: () => void;      // ログアウト処理
  onOpenAuth: () => void;    // 認証画面を開く処理
  onThemeChange: (theme: string) => void; // テーマ変更処理
  onDurationSelect: (mins: number) => void; // クエスト時間選択処理
  onOpenLogs: () => void;    // 履歴画面を開く処理
  onToggleSound: () => void; // サウンド切り替え処理
};

/**
 * 画面右側に固定表示される操作パネル
 * テーマ選択、クエスト時間設定、ログイン管理、サウンド設定を集約しています。
 */
export function Sidebar({ 
  currentUser, currentTheme, duration, isActive, isSoundOn,
  onLogout, onOpenAuth, onThemeChange, onDurationSelect, onOpenLogs, onToggleSound
}: SidebarProps) {
  return (
    <div className="fixed top-4 right-4 md:top-8 md:right-8 flex flex-col items-end gap-6 z-50 max-h-[90vh] overflow-y-auto pr-1 scrollbar-hide">
      
      {/* ログイン・履歴・サウンド設定のトップボタン群 */}
      <div className="flex flex-col items-end gap-2">
        {/* 管理者専用ボタン */}
        {currentUser?.role === 'admin' && (
          <Link 
            href="/admin"
            className="flex items-center gap-2 px-4 py-2 bg-red-950/30 border border-red-500/30 rounded-xl hover:bg-red-900/40 transition-all text-[10px] font-black uppercase tracking-widest text-red-400 group mb-1"
          >
            <Shield className="w-3 h-3 group-hover:scale-110 transition-transform" />
            Admin Council
          </Link>
        )}

        <div className="flex gap-2">
          {/* サウンドON/OFF切り替えボタン */}
          <button 
            onClick={onToggleSound}
            className="p-2 bg-foreground/5 border border-primary/20 rounded-xl hover:bg-foreground/10 transition-all"
            title="Toggle Sound"
          >
            {isSoundOn ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 opacity-40" />}
          </button>
          {/* 冒険の記録（履歴）を開くボタン */}
          <button 
            onClick={onOpenLogs}
            className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-primary/20 rounded-xl hover:bg-foreground/10 transition-all text-[10px] font-black uppercase tracking-widest"
          >
            <ScrollText className="w-3 h-3" />
            Adventure Log
          </button>
        </div>

        {/* ユーザーの状態（ログイン/ログアウト）に応じたボタンの表示 */}
        {currentUser ? (
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-primary/20 rounded-xl hover:bg-foreground/10 transition-all text-[10px] font-black uppercase tracking-widest">
            <LogOut className="w-3 h-3" /> Sign Out
          </button>
        ) : (
          <button onClick={onOpenAuth} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl shadow-[0_0_15px_var(--color-primary-glow)] hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest">
            <LogIn className="w-3 h-3" /> Adventurer Log
          </button>
        )}
      </div>

      {/* テーマセレクター（Shadow / Radiance） */}
      <div className="flex flex-col items-end gap-3">
        {(['dark', 'light'] as ThemeCategory[]).map((cat) => (
          <div key={cat} className="flex flex-col items-end gap-2">
            {/* カテゴリラベル（月/太陽アイコン） */}
            <div className={`flex items-center gap-2 px-3 py-1 border border-primary/20 rounded-full backdrop-blur-md ${cat === 'dark' ? 'bg-slate-900/40' : 'bg-white/40'}`}>
              {cat === 'dark' ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-primary" />}
              <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">{cat === 'dark' ? 'Shadow' : 'Radiance'}</span>
            </div>
            {/* 各色のテーマボタン */}
            <div className={`flex gap-1.5 p-1.5 border border-primary/20 rounded-xl backdrop-blur-md shadow-xl ${cat === 'dark' ? 'bg-slate-900/40' : 'bg-white/40'}`}>
              {themes[cat].map((theme) => (
                <button
                  key={theme.name}
                  onClick={() => onThemeChange(theme.name)}
                  className={`w-6 h-6 md:w-7 md:h-7 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-90 ${theme.color} ${
                    currentTheme === theme.name ? `ring-2 ${cat === 'dark' ? 'ring-white' : 'ring-slate-800'} scale-110 shadow-lg` : 'opacity-40 hover:opacity-100'
                  }`}
                  title={theme.label}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* クエスト時間セレクター（5分〜60分のグリッド） */}
      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2 px-3 py-1 bg-background/40 border border-primary/20 rounded-full backdrop-blur-md">
          <ScrollText className="w-3 h-3 text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">Quest</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-background/40 border border-primary/20 rounded-xl backdrop-blur-md shadow-xl w-fit">
          {durationOptions.map((mins) => (
            <button key={mins} onClick={() => onDurationSelect(mins)} disabled={isActive} className={`w-9 h-7 md:w-10 md:h-8 rounded-lg font-black text-[10px] transition-all duration-300 flex items-center justify-center ${duration === mins ? 'bg-primary text-primary-foreground shadow-[0_0_10px_var(--color-primary)] scale-105 z-10' : 'bg-foreground/5 opacity-40 hover:opacity-80 disabled:opacity-10'}`}>
              {mins}m
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
