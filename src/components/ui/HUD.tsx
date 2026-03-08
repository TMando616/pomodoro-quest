"use client";

import React from 'react';
// Lucide React からアイコンをインポート
import { Shield, Crown } from 'lucide-react';
// 型定義をインポート
import { User } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * HUD（Head-Up Display）コンポーネントのプロパティ定義
 */
type HUDProps = {
  user: User | null;    // 現在のユーザー情報
  currentTitle?: string; // 装備中の称号名
};

/**
 * 画面上部に表示されるステータスバー
 * ユーザー名、称号、レベル、経験値ゲージをリアルタイムに表示します。
 */
export function HUD({ user, currentTitle }: HUDProps) {
  const { t } = useTranslation();
  
  // ユーザーがいない（未ログイン）場合のデフォルト値
  const level = user ? user.level : 1;
  const exp = user ? user.exp : 0;
  const username = user ? user.username : t.common.guest;

  return (
    // メインコンテナ：透過背景と光彩エフェクト
    <div className="w-full bg-background/40 border-2 border-primary/20 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group border-b-4">
      {/* 名前とレベルの表示エリア */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          {/* 盾のアイコン */}
          <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
            <Shield className="text-primary w-6 h-6" />
          </div>
          <div>
            {/* ラベルと称号 */}
            <div className="flex items-center gap-1.5 mb-1">
              <div className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] leading-none">{t.common.adventurer}</div>
              {currentTitle && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 bg-primary/20 border border-primary/30 rounded-md text-[8px] font-black text-primary uppercase tracking-widest">
                  <Crown className="w-2 h-2" /> {currentTitle}
                </div>
              )}
            </div>
            {/* 冒険者名 */}
            <div className="text-2xl font-black italic text-primary leading-none">
              {username}
            </div>
          </div>
        </div>
        {/* レベル表示 */}
        <div className="text-right">
          <div className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] leading-none mb-1">{t.common.level}</div>
          <div className="text-2xl font-black italic text-primary leading-none">
            Lv. {level}
          </div>
        </div>
      </div>
      
      {/* 経験値ゲージエリア */}
      <div className="space-y-2">
        {/* 外枠（背景） */}
        <div className="relative w-full h-3 bg-foreground/5 rounded-full overflow-hidden border border-primary/10">
          {/* 中身（経験値バー）：現在のEXPの割合に応じて幅が変わる */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_15px_var(--color-primary)] transition-all duration-1000 ease-out"
            style={{ width: `${(exp / 1000) * 100}%` }}
          />
        </div>
        {/* EXP数値とサブインジケーター（点） */}
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-primary/70 tracking-widest italic uppercase">
            {t.common.exp.toUpperCase()} {exp} / 1000
          </span>
          {/* 200EXPごとに1つ点灯するドット */}
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${ exp >= (i + 1) * 200 ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-foreground/10'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
