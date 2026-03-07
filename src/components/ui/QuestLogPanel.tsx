"use client";

import React from 'react';
import { ScrollText, X, Clock, Zap, Calendar } from 'lucide-react';
import { QuestLog } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

type QuestLogPanelProps = {
  logs: QuestLog[];
  onClose: () => void;
};

export function QuestLogPanel({ logs, onClose }: QuestLogPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      {/* 背景オーバーレイ */}
      <div 
        className="absolute inset-0 bg-background/60 backdrop-blur-md" 
        onClick={onClose}
      />
      
      {/* 履歴パネル本体 */}
      <div className="relative w-full max-w-xl bg-background/80 border-2 border-primary/20 rounded-[2.5rem] shadow-2xl p-6 md:p-8 flex flex-col gap-8 max-h-[85vh] animate-in slide-in-from-bottom-8 duration-500 overflow-hidden">
        
        {/* ヘッダー */}
        <div className="flex justify-between items-center pb-4 border-b border-primary/10">
          <div className="flex items-center gap-3">
            <ScrollText className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary">{t.questLog.title}</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-foreground/5 rounded-full transition-all"
          >
            <X className="w-6 h-6 opacity-40 hover:opacity-100" />
          </button>
        </div>

        {/* 履歴リスト */}
        <div className="overflow-y-auto pr-2 space-y-4 custom-scrollbar">
          {logs.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <ScrollText className="w-12 h-12 text-primary/10 mx-auto" />
              <p className="text-xs font-black uppercase tracking-widest opacity-30">{t.questLog.noLogs}</p>
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="group relative bg-foreground/5 border border-primary/10 rounded-2xl p-5 hover:bg-primary/5 hover:border-primary/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest ${log.name.startsWith('BOSS:') ? 'bg-red-500 text-white' : 'bg-primary/20 text-primary'}`}>
                        {log.name.startsWith('BOSS:') ? 'Boss' : t.common.quest}
                      </span>
                      <span className="text-[10px] font-black opacity-40 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(log.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/90">
                      {log.name}
                    </h3>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40 flex items-center justify-end gap-1 mb-1">
                        <Clock className="w-2.5 h-2.5" /> {t.questLog.time}
                      </div>
                      <div className="text-xs font-black text-primary/80 italic">{log.duration} MINS</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[8px] font-black uppercase tracking-widest opacity-40 flex items-center justify-end gap-1 mb-1">
                        <Zap className="w-2.5 h-2.5 text-primary" /> {t.questLog.earnedExp}
                      </div>
                      <div className="text-xs font-black text-primary italic">+{log.earnedExp} EXP</div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
