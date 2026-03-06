"use client";

import React from 'react';
import { Shield, Crown, Check, LogOut, Clock, Swords, Calendar, Award, Star, Medal, Zap } from 'lucide-react';
import { titles } from '@/constants';
import { useUser } from '@/hooks/useUser';
import { useAudio } from '@/hooks/useAudio';
import { HUD } from '@/components/ui/HUD';

/**
 * 冒険者プロフィールページ
 */
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

  // 参加日をフォーマット
  const joinDate = new Date(currentUser.joinedAt).toLocaleDateString();

  // 実績メダルの定義
  const badges = [
    { label: 'First Quest', icon: Zap, active: currentUser.completedQuestsCount >= 1, color: 'text-blue-400' },
    { label: 'Focus Master', icon: Clock, active: currentUser.totalFocusTime >= 300, color: 'text-emerald-400' },
    { label: 'Monster Slayer', icon: Swords, active: currentUser.completedQuestsCount >= 10, color: 'text-orange-400' },
    { label: 'Guild Elite', icon: Star, active: currentUser.level >= 5, color: 'text-yellow-400' },
    { label: 'Guild Admin', icon: Shield, active: currentUser.role === 'admin', color: 'text-red-400' },
    { label: 'Legendary', icon: Medal, active: currentUser.level >= 10, color: 'text-purple-400' },
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-4xl mx-auto animate-in fade-in duration-500 pb-24">
      
      {/* HUD - Top Status */}
      <div className="w-full mb-8">
        <HUD user={currentUser} currentTitle={currentTitleName} />
      </div>

      {/* Badges Section */}
      <div className="w-full flex justify-center gap-4 mb-8 overflow-x-auto py-2 scrollbar-hide">
        {badges.map((badge, i) => (
          <div 
            key={i} 
            className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${badge.active ? `bg-background border-primary/20 shadow-lg scale-110` : 'opacity-10 grayscale border-transparent'}`}
            title={badge.label}
          >
            <badge.icon className={`w-6 h-6 ${badge.active ? badge.color : 'text-foreground'}`} />
            <span className="text-[7px] font-black uppercase tracking-tighter">{badge.label}</span>
          </div>
        ))}
      </div>

      <div className="w-full grid gap-8 md:grid-cols-3">
        
        {/* Left Column: Adventurer Stats */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-foreground/5 border-2 border-primary/20 rounded-[2rem] p-6 shadow-lg relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 opacity-5 group-hover:rotate-12 transition-transform">
              <Award className="w-24 h-24" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 relative z-10">
              <Shield className="w-3 h-3 text-primary" /> Adventurer Stats
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">Total Focus Time</span>
                <div className="flex items-end gap-2 text-primary">
                  <Clock className="w-4 h-4 mb-1" />
                  <span className="text-2xl font-black italic">{currentUser.totalFocusTime || 0}</span>
                  <span className="text-[10px] font-black mb-1.5 opacity-60">MINS</span>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter">Quests Completed</span>
                <div className="flex items-end gap-2 text-primary">
                  <Swords className="w-4 h-4 mb-1" />
                  <span className="text-2xl font-black italic">{currentUser.completedQuestsCount || 0}</span>
                  <span className="text-[10px] font-black mb-1.5 opacity-60">TASKS</span>
                </div>
              </div>

              <div className="flex flex-col gap-1 pt-4 border-t border-primary/10">
                <span className="text-[10px] font-black opacity-40 uppercase tracking-tighter flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Guild Member Since
                </span>
                <span className="text-xs font-black text-foreground/80">{joinDate}</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-red-950/20 text-red-500 border-2 border-red-900/30 rounded-2xl hover:bg-red-900/40 hover:border-red-500 transition-all font-black text-xs uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Retire from Guild
          </button>
        </div>

        {/* Right Column: Titles & Achievements */}
        <div className="md:col-span-2 bg-foreground/5 border-2 border-primary/20 rounded-[2.5rem] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-6 border-b border-primary/10 pb-4">
            <div className="flex items-center gap-3">
              <Crown className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-black uppercase tracking-[0.2em] text-primary">Unlocked Titles</h2>
            </div>
            <span className="text-xs font-black opacity-40 uppercase tracking-widest">
              {currentUser.unlockedTitles.length} / {titles.length}
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
                  className={`text-left p-5 rounded-2xl border-2 transition-all relative group flex flex-col justify-between min-h-[110px] ${
                    isEquipped 
                      ? 'border-primary bg-primary/10 shadow-[0_0_15px_var(--color-primary-glow)] scale-[1.03] z-10' 
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
                      {isEquipped && <Check className="w-5 h-5 text-primary shadow-[0_0_10px_var(--color-primary)] rounded-full" />}
                    </div>
                    <p className="text-[10px] opacity-80 leading-relaxed font-bold">{title.description}</p>
                  </div>
                  {!isUnlocked && (
                    <div className="mt-4 text-[9px] font-black uppercase tracking-widest text-primary/60 border-t border-primary/5 pt-2">
                      Requirement hidden...
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
