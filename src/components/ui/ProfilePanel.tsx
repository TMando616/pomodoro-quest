"use client";

import React from 'react';
// Lucide React からアイコンをインポート
import { Crown, Check, X } from 'lucide-react';
// 型定義と定数をインポート
import { User } from '@/types';
import { titles } from '@/constants';

/**
 * プロフィールパネルのプロパティ定義
 */
type ProfilePanelProps = {
  user: User;                  // 表示対象のユーザー情報
  onClose: () => void;         // 閉じるボタンが押された時の処理
  onEquipTitle: (titleId: string) => void; // 称号を装備する時の処理
};

/**
 * 称号のアンロック状況の確認や装備を行うプロフィール画面
 */
export function ProfilePanel({ user, onClose, onEquipTitle }: ProfilePanelProps) {
  return (
    // 背景のぼかしオーバーレイ
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* メインのダイアログボックス */}
      <div className="relative w-full max-w-lg bg-background border-4 border-primary rounded-[2.5rem] shadow-[0_0_50px_var(--color-primary-glow)] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* ヘッダー部分 */}
        <div className="p-6 border-b-2 border-primary/20 flex justify-between items-center bg-primary/5">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary">Adventurer Profile</h2>
          </div>
          {/* 閉じるボタン */}
          <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* コンテンツ（称号一覧リスト） */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Unlocked Titles</h3>
            <div className="grid gap-3">
              {/* 定数ファイルで定義されているすべての称号をループ表示 */}
              {titles.map((title) => {
                // その称号をアンロックしているかチェック
                const isUnlocked = user.unlockedTitles.includes(title.id);
                // その称号を現在装備しているかチェック
                const isEquipped = user.currentTitleId === title.id;

                return (
                  <button
                    key={title.id}
                    disabled={!isUnlocked} // 未開放ならクリック不可
                    onClick={() => onEquipTitle(title.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all relative group ${
                      isEquipped 
                        ? 'border-primary bg-primary/10' // 装備中のスタイル
                        : isUnlocked 
                          ? 'border-primary/20 bg-foreground/5 hover:border-primary/40' // 開放済みのスタイル
                          : 'border-foreground/5 opacity-30 grayscale' // 未開放のスタイル
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-black uppercase tracking-widest text-sm ${isEquipped ? 'text-primary' : ''}`}>
                        {title.name}
                      </h4>
                      {isEquipped && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    {/* 称号の説明文 */}
                    <p className="text-[10px] opacity-60 leading-relaxed">{title.description}</p>
                    {/* 未開放時のヒント */}
                    {!isUnlocked && (
                      <div className="mt-2 text-[8px] font-black uppercase tracking-tighter text-primary/60">
                        Condition hidden...
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="p-4 bg-primary/5 border-t-2 border-primary/20 text-center text-[10px] font-black uppercase tracking-widest opacity-40">
          The legend of {user.username} continues...
        </div>
      </div>
    </div>
  );
}
