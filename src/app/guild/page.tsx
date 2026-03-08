"use client";

import React, { useState, useMemo } from 'react';
import { Users, Trophy, Shield, Crown, Zap, Flame, Clock, Swords, Filter, Activity } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { titles } from '@/constants';
import { useTranslation } from '@/hooks/useTranslation';

type SortCategory = 'level' | 'time' | 'quests';

/**
 * ギルド酒場（リーダーボード・ユーザー一覧）ページ
 */
export default function GuildPage() {
  const { users, currentUser, questLogs, isMounted } = useUser();
  const [sortCategory, setSortCategory] = useState<SortCategory>('level');
  const { t } = useTranslation();

  // カテゴリに基づいてユーザーをソート（最適化）
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (sortCategory === 'level') {
        if (b.level !== a.level) return b.level - a.level;
        return b.exp - a.exp;
      } else if (sortCategory === 'time') {
        return (b.totalFocusTime || 0) - (a.totalFocusTime || 0);
      } else {
        return (b.completedQuestsCount || 0) - (a.completedQuestsCount || 0);
      }
    });
  }, [users, sortCategory]);

  // ギルドの累計統計を計算（最適化）
  const stats = useMemo(() => {
    return {
      totalFocusTime: users.reduce((acc, u) => acc + (u.totalFocusTime || 0), 0),
      totalQuestsSlain: users.reduce((acc, u) => acc + (u.completedQuestsCount || 0), 0)
    };
  }, [users]);

  // 全ユーザーの全ログを結合（最新10件）
  const allLogs = useMemo(() => {
    return [...questLogs].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10);
  }, [questLogs]);

  // ギルド全体のランク
  const guildGrade = useMemo(() => {
    const focus = stats.totalFocusTime;
    if (focus > 10000) return { name: t.guild.grades.legendary, color: 'text-yellow-500' };
    if (focus > 5000) return { name: t.guild.grades.elite, color: 'text-purple-500' };
    if (focus > 1000) return { name: t.guild.grades.active, color: 'text-blue-500' };
    return { name: t.guild.grades.novice, color: 'text-emerald-500' };
  }, [stats.totalFocusTime, t]);

  // マウント前はローディングを表示
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest mt-4 opacity-40">{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-24">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b-2 border-primary/20">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-primary">{t.guild.tavern}</h1>
            <p className={`text-[10px] font-black uppercase tracking-widest ${guildGrade.color}`}>{guildGrade.name}</p>
          </div>
        </div>
        <div className="flex flex-col items-end text-right">
          <span className="text-[10px] font-black opacity-40 uppercase tracking-widest">{t.guild.activeAdventurers}</span>
          <span className="text-xl font-black italic text-primary">{users.length}</span>
        </div>
      </div>

      {/* Guild Global Stats */}
      <div className="w-full bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-6 mb-10 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-all group-hover:scale-110">
          <Flame className="w-24 h-24 text-primary fill-current" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row justify-around items-center gap-8">
          <div className="text-center">
            <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-2 block">{t.guild.totalFocus}</span>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="text-3xl font-black italic tracking-tighter">{stats.totalFocusTime}</span>
              <span className="text-[10px] font-black mt-2 opacity-60 uppercase">{t.common.mins}</span>
            </div>
          </div>
          <div className="h-px w-20 bg-primary/20 md:h-12 md:w-px" />
          <div className="text-center">
            <span className="text-[10px] font-black opacity-40 uppercase tracking-[0.2em] mb-2 block">{t.guild.questsSlain}</span>
            <div className="flex items-center justify-center gap-2 text-primary">
              <Swords className="w-5 h-5" />
              <span className="text-3xl font-black italic tracking-tighter">{stats.totalQuestsSlain}</span>
              <span className="text-[10px] font-black mt-2 opacity-60 uppercase">{t.common.tasks}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-foreground/5 border-2 border-primary/10 rounded-[2rem] p-6">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-3 h-3 text-primary" /> {t.guild.rankCategory}
            </h3>
            <div className="flex flex-col gap-2">
              {(['level', 'time', 'quests'] as SortCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setSortCategory(cat)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${sortCategory === cat ? 'border-primary bg-primary/10 text-primary shadow-md' : 'border-transparent bg-background/50 opacity-40 hover:opacity-100'}`}
                >
                  {cat === 'level' ? t.guild.highestLevel : cat === 'time' ? t.guild.totalFocusSort : t.guild.questsCleared}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-foreground/5 border-2 border-primary/10 rounded-[2rem] p-6 overflow-hidden">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-3 h-3 text-primary" /> {t.guild.chatter}
            </h3>
            <div className="space-y-4">
              {allLogs.length === 0 ? (
                <p className="text-[10px] opacity-30 italic">{t.guild.silence}</p>
              ) : (
                allLogs.map(log => {
                  const user = users.find(u => u.id === log.userId);
                  return (
                    <div key={log.id} className="border-l-2 border-primary/20 pl-3 py-1">
                      <p className="text-[9px] font-black text-primary uppercase">{user?.username || t.guild.unknownHero}</p>
                      <p className="text-[10px] opacity-80 leading-tight">{t.guild.cleared} <span className="font-bold text-foreground">{log.name}</span></p>
                      <p className="text-[8px] opacity-40 mt-1">{new Date(log.createdAt).toLocaleTimeString()}</p>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] opacity-50 px-2 flex items-center gap-2">
            <Trophy className="w-3 h-3" /> {t.guild.hallOfFame}
          </h2>
          <div className="space-y-3">
            {sortedUsers.map((user, index) => {
              const userTitle = titles.find(t => t.id === user.currentTitleId)?.name;
              const isMe = currentUser?.id === user.id;
              const rank = index + 1;

              return (
                <div key={user.id} className={`relative flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${isMe ? 'border-primary bg-primary/10 shadow-[0_0_20px_var(--color-primary-glow)] scale-[1.02] z-10' : 'border-foreground/5 bg-foreground/5 hover:border-primary/20 hover:bg-foreground/10'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black italic text-sm ${rank === 1 ? 'bg-yellow-500 text-slate-900' : rank === 2 ? 'bg-slate-300 text-slate-900' : rank === 3 ? 'bg-amber-600 text-slate-900' : 'bg-background border border-primary/20 text-primary/60'}`}>{rank}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className={`font-black uppercase tracking-widest truncate ${isMe ? 'text-primary' : ''}`}>{user.username}</h4>
                      {user.role === 'admin' && <Shield className="w-3 h-3 text-primary fill-current" />}
                      {isMe && <span className="text-[8px] bg-primary text-primary-foreground px-1.5 rounded-full font-black uppercase">{t.common.you}</span>}
                    </div>
                    {userTitle && <div className="flex items-center gap-1 text-[8px] font-black text-primary/60 uppercase tracking-tighter truncate whitespace-nowrap"><Crown className="w-2 h-2" /> {userTitle}</div>}
                  </div>
                  <div className="text-right">
                    {sortCategory === 'level' ? (
                      <div className="text-xs font-black italic text-primary">Lv. {user.level}</div>
                    ) : sortCategory === 'time' ? (
                      <div className="text-xs font-black italic text-primary">{(user.totalFocusTime || 0)}{t.common.mins}</div>
                    ) : (
                      <div className="text-xs font-black italic text-primary">{(user.completedQuestsCount || 0)} {t.common.tasks}</div>
                    )}
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <div className="w-16 h-1 bg-background rounded-full border border-primary/10 overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(user.exp / 1000) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  {rank === 1 && <div className="absolute -top-2 -right-2"><Zap className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" /></div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
