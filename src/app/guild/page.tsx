"use client";

import React from 'react';
import { Users, Trophy, Shield, Crown, Search, MessageSquare, Zap } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { titles } from '@/constants';

/**
 * ギルド酒場（リーダーボード・ユーザー一覧）ページ
 */
export default function GuildPage() {
  const { users, currentUser } = useUser();

  // レベルと経験値でソートしたランキング
  const sortedUsers = [...users].sort((a, b) => {
    if (b.level !== a.level) return b.level - a.level;
    return b.exp - a.exp;
  });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-4xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b-2 border-primary/20">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-primary">Guild Tavern</h1>
            <p className="text-[10px] opacity-60 uppercase tracking-widest">Gathering of legendary adventurers</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">Guild Population</span>
          <span className="text-xl font-black italic text-primary">{users.length}</span>
        </div>
      </div>

      <div className="w-full grid gap-8 md:grid-cols-3">
        
        {/* Left Column: Guild Stats & Search (Mock) */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-foreground/5 border-2 border-primary/10 rounded-[2rem] p-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Search className="w-3 h-3 text-primary" /> Seek Adventurer
            </h3>
            <input 
              type="text" 
              placeholder="Enter name..."
              className="w-full bg-background/50 border border-primary/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <div className="bg-primary/5 border-2 border-primary/20 rounded-[2rem] p-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-primary">
              <MessageSquare className="w-3 h-3" /> Guild Notice
            </h3>
            <div className="space-y-3">
              <div className="bg-background/40 p-3 rounded-xl border border-primary/10">
                <p className="text-[9px] font-bold leading-relaxed opacity-80 italic">
                  "Focus on your quest, and the glory will follow. New titles added to the guild scrolls!"
                </p>
                <p className="text-[8px] mt-2 text-primary/60 font-black text-right">- Grandmaster Hero</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Leaderboard */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-50 px-2 flex items-center gap-2">
            <Trophy className="w-3 h-3" /> Hall of Fame
          </h2>
          
          <div className="space-y-3">
            {sortedUsers.map((user, index) => {
              const userTitle = titles.find(t => t.id === user.currentTitleId)?.name;
              const isMe = currentUser?.id === user.id;
              const rank = index + 1;

              return (
                <div 
                  key={user.id} 
                  className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${
                    isMe 
                      ? 'border-primary bg-primary/10 shadow-[0_0_20px_var(--color-primary-glow)] scale-[1.02] z-10' 
                      : 'border-foreground/5 bg-foreground/5 hover:border-primary/20 hover:bg-foreground/10'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-sm ${
                    rank === 1 ? 'bg-yellow-500 text-slate-900' :
                    rank === 2 ? 'bg-slate-300 text-slate-900' :
                    rank === 3 ? 'bg-amber-600 text-slate-900' :
                    'bg-background border border-primary/20 text-primary/60'
                  }`}>
                    {rank}
                  </div>

                  {/* Adventurer Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className={`font-black uppercase tracking-widest truncate ${isMe ? 'text-primary' : ''}`}>
                        {user.username}
                      </h4>
                      {user.role === 'admin' && (
                        <Shield className="w-3 h-3 text-primary fill-current" title="Admin" />
                      )}
                      {isMe && (
                        <span className="text-[8px] bg-primary text-primary-foreground px-1.5 rounded-full font-black uppercase">YOU</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 overflow-hidden">
                      {userTitle && (
                        <div className="flex items-center gap-1 text-[8px] font-black text-primary/60 uppercase tracking-tighter whitespace-nowrap">
                          <Crown className="w-2 h-2" /> {userTitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Level & Stats */}
                  <div className="text-right">
                    <div className="text-xs font-black italic text-primary">Lv. {user.level}</div>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <div className="w-16 h-1 bg-background rounded-full overflow-hidden border border-primary/10">
                        <div 
                          className="h-full bg-primary" 
                          style={{ width: `${(user.exp / 1000) * 100}%` }}
                        />
                      </div>
                      <span className="text-[8px] font-black opacity-40 italic">{user.exp} EXP</span>
                    </div>
                  </div>

                  {/* Rank 1 Special Effect */}
                  {rank === 1 && (
                    <div className="absolute -top-2 -right-2">
                      <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Decorative Bottom */}
      <div className="mt-20 py-10 opacity-10 flex gap-8">
        <Users className="w-8 h-8" />
        <Trophy className="w-8 h-8" />
        <Users className="w-8 h-8" />
      </div>
    </div>
  );
}
