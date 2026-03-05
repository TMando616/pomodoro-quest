"use client";

import React from 'react';
// Lucide React からアイコンをインポート
import { ScrollText, Clock, Zap, X } from 'lucide-react';
// 型定義をインポート
import { QuestLog } from '@/types';

/**
 * クエスト履歴パネルのプロパティ定義
 */
type QuestLogPanelProps = {
  logs: QuestLog[];    // 完了したクエストのリスト
  onClose: () => void; // 閉じるボタンが押された時の処理
};

/**
 * 過去のクエスト達成状況を確認できる履歴パネル（冒険の記録）
 */
export function QuestLogPanel({ logs, onClose }: QuestLogPanelProps) {
  // 履歴を日付の新しい順（降順）に並び替える
  const sortedLogs = [...logs].sort((a, b) => b.createdAt - a.createdAt);

  return (
    // 全画面を覆う半透明の背景
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      {/* メインパネル */}
      <div className="relative w-full max-w-lg bg-background border-4 border-primary rounded-[2.5rem] shadow-[0_0_50px_var(--color-primary-glow)] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* ヘッダー部分 */}
        <div className="p-6 border-b-2 border-primary/20 flex justify-between items-center bg-primary/5">
          <div className="flex items-center gap-3">
            <ScrollText className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary">Adventure Log</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 履歴リスト表示エリア（スクロール可能） */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {sortedLogs.length === 0 ? (
            // 履歴が空の場合の表示
            <div className="text-center py-12 opacity-30 uppercase font-black tracking-widest text-sm">
              No records in this scroll...
            </div>
          ) : (
            // 各クエストのカード表示
            sortedLogs.map((log) => (
              <div key={log.id} className="bg-foreground/5 border-2 border-primary/10 rounded-2xl p-4 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-primary group-hover:text-primary transition-colors">
                    {log.name || "Untitled Quest"}
                  </h3>
                  {/* 日付の表示 */}
                  <span className="text-[10px] opacity-40 font-bold">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {/* 獲得リザルト（集中時間と獲得EXP） */}
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-60">
                    <Clock className="w-3 h-3" /> {log.duration}m
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-primary/80">
                    <Zap className="w-3 h-3" /> +{log.earnedExp} EXP
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* フッター：合計クエスト数の表示 */}
        <div className="p-4 bg-primary/5 border-t-2 border-primary/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Total Quests: {logs.length}
          </p>
        </div>
      </div>
    </div>
  );
}
