"use client";

import React from 'react';
import { ScrollText, Clock, Zap, X } from 'lucide-react';
import { QuestLog } from '@/types';

type QuestLogPanelProps = {
  logs: QuestLog[];
  onClose: () => void;
};

export function QuestLogPanel({ logs, onClose }: QuestLogPanelProps) {
  const sortedLogs = [...logs].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-background border-4 border-primary rounded-[2.5rem] shadow-[0_0_50px_var(--color-primary-glow)] overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-6 border-b-2 border-primary/20 flex justify-between items-center bg-primary/5">
          <div className="flex items-center gap-3">
            <ScrollText className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary">Adventure Log</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Log List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
          {sortedLogs.length === 0 ? (
            <div className="text-center py-12 opacity-30 uppercase font-black tracking-widest text-sm">
              No records in this scroll...
            </div>
          ) : (
            sortedLogs.map((log) => (
              <div key={log.id} className="bg-foreground/5 border-2 border-primary/10 rounded-2xl p-4 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-primary group-hover:text-primary transition-colors">
                    {log.name || "Untitled Quest"}
                  </h3>
                  <span className="text-[10px] opacity-40 font-bold">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
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

        {/* Footer */}
        <div className="p-4 bg-primary/5 border-t-2 border-primary/20 text-center">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Total Quests: {logs.length}
          </p>
        </div>
      </div>
    </div>
  );
}
