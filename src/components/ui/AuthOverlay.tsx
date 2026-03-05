"use client";

import React from 'react';
// Lucide React からアイコンをインポート
import { LogIn, UserPlus } from 'lucide-react';

/**
 * 認証オーバーレイのプロパティ定義
 */
type AuthOverlayProps = {
  isAuthMode: 'login' | 'register'; // ログインか登録か
  authForm: { username: string };   // フォームの入力状態
  authError: string;                // エラーメッセージ
  onFormChange: (username: string) => void; // 入力内容が変わった時の処理
  onSubmit: (e: React.FormEvent) => void;   // 送信（ログイン/登録）ボタンが押された時の処理
  onToggleMode: () => void;                 // ログインと登録を切り替える処理
  onCancel: () => void;                     // キャンセル（閉じる）処理
};

/**
 * ユーザー登録やログインを行うための画面オーバーレイ
 * RPGの「ギルドへの加入」や「冒険の記録の再開」をイメージしたデザインです。
 */
export function AuthOverlay({ isAuthMode, authForm, authError, onFormChange, onSubmit, onToggleMode, onCancel }: AuthOverlayProps) {
  return (
    // フェードイン・ズームインしながら表示
    <div className="relative z-20 w-full animate-in fade-in zoom-in duration-300">
      {/* カード型のコンテナ：背景ぼかしとテーマカラーの光彩 */}
      <div className="bg-background/80 border-4 border-primary rounded-[2.5rem] p-8 backdrop-blur-xl shadow-[0_0_50px_var(--color-primary-glow)]">
        <div className="flex flex-col items-center gap-6">
          {/* タイトルと説明文 */}
          <div className="text-center">
            <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-primary mb-2">
              {isAuthMode === 'login' ? 'Adventurer Log' : 'Join the Guild'}
            </h2>
            <p className="text-[10px] opacity-60 uppercase tracking-widest">
              {isAuthMode === 'login' ? 'Continue your epic journey' : 'Start your focus adventure'}
            </p>
          </div>

          {/* 入力フォーム */}
          <form onSubmit={onSubmit} className="w-full space-y-4">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest px-1">Adventurer Name</label>
              <input 
                type="text" 
                placeholder="Enter your name..."
                value={authForm.username}
                onChange={(e) => onFormChange(e.target.value)}
                className="w-full bg-foreground/5 border-2 border-primary/20 rounded-2xl px-5 py-4 focus:border-primary focus:outline-none transition-all font-bold placeholder:opacity-30"
              />
            </div>
            {/* エラーメッセージの表示（名前が重複している場合など） */}
            {authError && <p className="text-[10px] text-red-500 font-bold px-1">{authError}</p>}
            
            {/* 送信ボタン */}
            <button 
              type="submit"
              className="w-full bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] py-5 rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              {isAuthMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
              {isAuthMode === 'login' ? 'Enter Guild' : 'Register Hero'}
            </button>
          </form>

          {/* モード切り替えリンク（ログイン ↔ 登録） */}
          <button 
            onClick={onToggleMode}
            className="text-[10px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
          >
            {isAuthMode === 'login' ? "Need a new scroll? Register here" : "Already in the guild? Sign in"}
          </button>
          
          {/* キャンセルボタン */}
          <button 
            onClick={onCancel}
            className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
