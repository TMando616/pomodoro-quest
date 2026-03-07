"use client";

import React from 'react';
import Link from 'next/link';
// Lucide React からアイコンをインポート
import { Moon, Sun, LogIn, LogOut, ScrollText, Volume2, VolumeX, Shield, X, Settings2 } from 'lucide-react';
// 型定義と定数をインポート
import { ThemeCategory, User } from '@/types';
import { themes, durationOptions } from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * サイドバーコンポーネントのプロパティ（受け取るデータ）の定義
 */
type SidebarProps = {
  isOpen: boolean;           // サイドバーが開いているか
  onClose: () => void;       // サイドバーを閉じる処理
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
 * 画面右側に表示される操作パネル（モーダル形式）
 * テーマ選択、クエスト時間設定、ログイン管理、サウンド設定を集約しています。
 */
export function Sidebar({ 
  isOpen, onClose,
  currentUser, currentTheme, duration, isActive, isSoundOn,
  onLogout, onOpenAuth, onThemeChange, onDurationSelect, onOpenLogs, onToggleSound
}: SidebarProps) {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-end p-4 md:p-8 animate-in fade-in duration-300">
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* サイドバー本体 */}
      <div className="relative w-full max-w-xs bg-background/80 border-2 border-primary/20 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 md:p-8 flex flex-col gap-8 max-h-[90vh] overflow-y-auto animate-in slide-in-from-right-8 duration-500">
        
        {/* ヘッダー */}
        <div className="flex justify-between items-center pb-4 border-b border-primary/10">
          <div className="flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-primary" />
            <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">{t.sidebar.title}</span>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-full transition-all"
          >
            <X className="w-5 h-5 opacity-40 hover:opacity-100" />
          </button>
        </div>

        {/* ログイン・履歴・サウンド設定 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.sidebar.system}</span>
            {/* サウンドON/OFF切り替えボタン */}
            <button 
              onClick={onToggleSound}
              className="p-2 bg-foreground/5 border border-primary/20 rounded-xl hover:bg-foreground/10 transition-all flex items-center gap-2 pr-4"
            >
              {isSoundOn ? <Volume2 className="w-4 h-4 text-primary" /> : <VolumeX className="w-4 h-4 opacity-40" />}
              <span className="text-[10px] font-black uppercase tracking-widest">{isSoundOn ? t.sidebar.soundOn : t.sidebar.muted}</span>
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {/* 冒険の記録（履歴）を開くボタン */}
            <button 
              onClick={() => { onOpenLogs(); onClose(); }}
              className="flex items-center justify-center gap-2 w-full py-3 bg-foreground/5 border border-primary/20 rounded-xl hover:bg-foreground/10 transition-all text-[10px] font-black uppercase tracking-widest"
            >
              <ScrollText className="w-4 h-4" />
              {t.sidebar.adventureLog}
            </button>

            {/* ユーザーの状態（ログイン/ログアウト）に応じたボタンの表示 */}
            {currentUser ? (
              <button onClick={onLogout} className="flex items-center justify-center gap-2 w-full py-3 bg-foreground/5 border border-primary/20 rounded-xl hover:bg-foreground/10 transition-all text-[10px] font-black uppercase tracking-widest">
                <LogOut className="w-4 h-4" /> {t.common.signOut}
              </button>
            ) : (
              <button onClick={() => { onOpenAuth(); onClose(); }} className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-xl shadow-[0_0_15px_var(--color-primary-glow)] hover:scale-[1.02] active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest">
                <LogIn className="w-4 h-4" /> {t.common.signIn}
              </button>
            )}

            {/* 管理者専用ボタン */}
            {currentUser?.role === 'admin' && (
              <Link 
                href="/admin"
                className="flex items-center justify-center gap-2 w-full py-2 bg-red-950/30 border border-red-500/30 rounded-xl hover:bg-red-900/40 transition-all text-[10px] font-black uppercase tracking-widest text-red-400 group mt-2"
              >
                <Shield className="w-3 h-3 group-hover:scale-110 transition-transform" />
                {t.common.admin}
              </Link>
            )}
          </div>
        </div>

        {/* テーマセレクター（Shadow / Radiance） */}
        <div className="flex flex-col gap-4">
          <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.sidebar.affinity}</span>
          <div className="space-y-4">
            {(['dark', 'light'] as ThemeCategory[]).map((cat) => (
              <div key={cat} className="space-y-2">
                {/* カテゴリラベル（月/太陽アイコン） */}
                <div className="flex items-center gap-2">
                  {cat === 'dark' ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-primary" />}
                  <span className="text-[9px] font-black uppercase tracking-widest text-primary/80">{cat === 'dark' ? t.sidebar.shadow : t.sidebar.radiance}</span>
                </div>
                {/* 各色のテーマボタン */}
                <div className={`flex gap-2 p-2 border border-primary/20 rounded-2xl ${cat === 'dark' ? 'bg-slate-900/40' : 'bg-white/40'}`}>
                  {themes[cat].map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => onThemeChange(theme.name)}
                      className={`w-7 h-7 md:w-8 md:h-8 rounded-lg transition-all duration-300 transform hover:scale-110 active:scale-90 ${theme.color} ${
                        currentTheme === theme.name ? `ring-2 ${cat === 'dark' ? 'ring-white' : 'ring-slate-800'} scale-110 shadow-lg` : 'opacity-40 hover:opacity-100'
                      }`}
                      title={theme.label}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* クエスト時間セレクター（5分〜60分のグリッド） */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-40">{t.sidebar.duration}</span>
            <span className="text-[10px] font-black text-primary">{duration}m</span>
          </div>
          <div className="grid grid-cols-3 gap-2 p-2 bg-background/40 border border-primary/20 rounded-2xl">
            {durationOptions.map((mins) => (
              <button 
                key={mins} 
                onClick={() => onDurationSelect(mins)} 
                disabled={isActive} 
                className={`h-10 rounded-xl font-black text-[10px] transition-all duration-300 flex items-center justify-center ${duration === mins ? 'bg-primary text-primary-foreground shadow-[0_0_10px_var(--color-primary)] scale-105 z-10' : 'bg-foreground/5 opacity-40 hover:opacity-80 disabled:opacity-10'}`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
