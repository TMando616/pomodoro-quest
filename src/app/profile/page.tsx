"use client";

import React from 'react';
import { Shield, Crown, Check, LogOut } from 'lucide-react';
import { titles } from '@/constants';
import { useUser } from '@/hooks/useUser';
import { useAudio } from '@/hooks/useAudio';
import { HUD } from '@/components/ui/HUD';

export default function ProfilePage() {
  const { currentUser, updateCurrentUserAndList, logout } = useUser();
  const { playEffect } = useAudio();

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Shield className="w-16 h-16 text-foreground/20 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-widest text-foreground/50">Not Authenticated</h1>
        <p className="text-xs opacity-40 mt-2">Please login from the Quest page to view your profile.</p>
      </div>
    );
  }

  const currentTitleName = titles.find(t => t.id === currentUser.currentTitleId)?.name;

  const handleEquip = (id: string) => {
    playEffect('click');
    updateCurrentUserAndList({ ...currentUser, currentTitleId: id });
  };

  const handleLogout = () => {
    playEffect('click');
    logout();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="w-full mb-8">
        <HUD user={currentUser} currentTitle={currentTitleName} />
      </div>

      <div className="w-full bg-foreground/5 border-2 border-primary/20 rounded-[2.5rem] p-6 shadow-xl mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Crown className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary">Titles & Achievements</h2>
          </div>
          <span className="text-xs font-black opacity-40 uppercase tracking-widest">
            {currentUser.unlockedTitles.length} / {titles.length} Unlocked
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {titles.map((title) => {
            const isUnlocked = currentUser.unlockedTitles.includes(title.id);
            const isEquipped = currentUser.currentTitleId === title.id;

            return (
              <button
                key={title.id}
                disabled={!isUnlocked}
                onClick={() => handleEquip(title.id)}
                className={`text-left p-5 rounded-2xl border-2 transition-all relative group flex flex-col justify-between min-h-[100px] ${
                  isEquipped 
                    ? 'border-primary bg-primary/10 shadow-[0_0_15px_var(--color-primary-glow)]' 
                    : isUnlocked 
                      ? 'border-primary/20 bg-background hover:border-primary/50' 
                      : 'border-foreground/5 bg-background/50 opacity-40 grayscale cursor-not-allowed'
                }`}
              >
                <div className="w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-black uppercase tracking-widest text-sm ${isEquipped ? 'text-primary' : ''}`}>
                      {title.name}
                    </h4>
                    {isEquipped && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <p className="text-[10px] opacity-80 leading-relaxed font-bold">{title.description}</p>
                </div>
                {!isUnlocked && (
                  <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-primary/60">
                    Condition hidden...
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="w-full flex justify-end">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-red-950/30 text-red-500 border border-red-900/50 rounded-xl hover:bg-red-900/50 transition-all font-black text-xs uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Retire (Sign Out)
        </button>
      </div>
    </div>
  );
}
