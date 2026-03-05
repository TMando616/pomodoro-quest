"use client";

import React from 'react';
import { Crown, Check, X } from 'lucide-react';
import { User, Title } from '@/types';
import { titles } from '@/constants';

type ProfilePanelProps = {
  user: User;
  onClose: () => void;
  onEquipTitle: (titleId: string) => void;
};

export function ProfilePanel({ user, onClose, onEquipTitle }: ProfilePanelProps) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-background border-4 border-primary rounded-[2.5rem] shadow-[0_0_50px_var(--color-primary-glow)] overflow-hidden flex flex-col max-h-[80vh]">
        
        <div className="p-6 border-b-2 border-primary/20 flex justify-between items-center bg-primary/5">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary">Adventurer Profile</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-foreground/10 rounded-full transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest opacity-50 px-1">Unlocked Titles</h3>
            <div className="grid gap-3">
              {titles.map((title) => {
                const isUnlocked = user.unlockedTitles.includes(title.id);
                const isEquipped = user.currentTitleId === title.id;

                return (
                  <button
                    key={title.id}
                    disabled={!isUnlocked}
                    onClick={() => onEquipTitle(title.id)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all relative group ${
                      isEquipped 
                        ? 'border-primary bg-primary/10' 
                        : isUnlocked 
                          ? 'border-primary/20 bg-foreground/5 hover:border-primary/40' 
                          : 'border-foreground/5 opacity-30 grayscale'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`font-black uppercase tracking-widest text-sm ${isEquipped ? 'text-primary' : ''}`}>
                        {title.name}
                      </h4>
                      {isEquipped && <Check className="w-4 h-4 text-primary" />}
                    </div>
                    <p className="text-[10px] opacity-60 leading-relaxed">{title.description}</p>
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

        <div className="p-4 bg-primary/5 border-t-2 border-primary/20 text-center text-[10px] font-black uppercase tracking-widest opacity-40">
          The legend of {user.username} continues...
        </div>
      </div>
    </div>
  );
}
