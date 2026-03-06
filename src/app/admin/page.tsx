"use client";

import React, { useState } from 'react';
import { Shield, Users, Trash2, AlertCircle, ArrowLeft, RefreshCw, MessageSquare, Send, TrendingUp, Target, Star } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAudio } from '@/hooks/useAudio';
import { useGuild } from '@/hooks/useGuild';

/**
 * 管理者専用ダッシュボードページ
 */
export default function AdminPage() {
  const { users, currentUser, adminDeleteUser, adminUpdateUser } = useUser();
  const { guildInfo, updateGlobalMessage, updateDailyQuest } = useGuild();
  const { playEffect } = useAudio();
  const [error, setError] = useState("");
  
  const [newGlobalMsg, setNewGlobalMsg] = useState(guildInfo.globalMessage);
  const [dqTitle, setDqTitle] = useState(guildInfo.dailyQuest.title);
  const [dqReq, setDqReq] = useState(guildInfo.dailyQuest.requirement);
  const [dqReward, setDqReward] = useState(guildInfo.dailyQuest.rewardTitle);

  // アクセス制限
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-widest text-red-500">Access Denied</h1>
        <Link href="/" className="mt-8 text-[10px] font-black uppercase border-b border-primary text-primary pb-1">Return to Quest</Link>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    playEffect('click');
    const result = adminDeleteUser(id);
    if (!result.success && result.error) {
      setError(result.error);
      setTimeout(() => setError(""), 3000);
    }
  };

  const toggleRole = (user: any) => {
    playEffect('click');
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    adminUpdateUser({ ...user, role: newRole });
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-6xl mx-auto animate-in fade-in duration-500 pb-24">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b-2 border-red-500/20">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-500" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-red-500">Admin Council</h1>
            <p className="text-[10px] opacity-60 uppercase tracking-widest text-red-400/80">Guild Maintenance & Order</p>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-xl hover:bg-foreground/10 transition-all text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3" /> Back
        </Link>
      </div>

      <div className="w-full grid gap-8 md:grid-cols-3 mb-10">
        
        {/* Left: Global Message */}
        <div className="md:col-span-1 bg-foreground/5 border-2 border-red-500/20 rounded-[2.5rem] p-6 shadow-lg flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-red-400">
            <MessageSquare className="w-3 h-3" /> Broadcaster
          </h3>
          <textarea 
            value={newGlobalMsg}
            onChange={(e) => setNewGlobalMsg(e.target.value)}
            className="flex-1 bg-background/50 border border-red-500/20 rounded-2xl p-4 text-xs focus:outline-none focus:border-red-500/50 transition-all resize-none min-h-[100px] mb-4"
          />
          <button 
            onClick={() => { playEffect('click'); updateGlobalMessage(newGlobalMsg); alert("Broadcasted!"); }}
            className="w-full bg-red-600 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl shadow-lg hover:bg-red-500 transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" /> Broadcast
          </button>
        </div>

        {/* Center: Daily Quest Editor */}
        <div className="md:col-span-1 bg-foreground/5 border-2 border-primary/20 rounded-[2.5rem] p-6 shadow-lg flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-primary">
            <Target className="w-3 h-3" /> Daily Challenge
          </h3>
          <div className="space-y-3 flex-1">
            <input value={dqTitle} onChange={e => setDqTitle(e.target.value)} placeholder="Quest Title" className="w-full bg-background/50 border border-primary/20 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary/50" />
            <div className="flex items-center gap-2">
              <input type="number" value={dqReq} onChange={e => setDqReq(Number(e.target.value))} className="w-20 bg-background/50 border border-primary/20 rounded-xl px-4 py-2 text-xs focus:outline-none" />
              <span className="text-[10px] font-black opacity-40 uppercase">Mins Req.</span>
            </div>
            <input value={dqReward} onChange={e => setDqReward(e.target.value)} placeholder="Reward Title" className="w-full bg-background/50 border border-primary/20 rounded-xl px-4 py-2 text-xs focus:outline-none" />
          </div>
          <button 
            onClick={() => { playEffect('click'); updateDailyQuest(dqTitle, dqReq, dqReward); alert("Daily Mission Updated!"); }}
            className="w-full bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 mt-4"
          >
            <Star className="w-4 h-4" /> Update Mission
          </button>
        </div>

        {/* Right: Activity Trend */}
        <div className="md:col-span-1 bg-foreground/5 border-2 border-primary/10 rounded-[2.5rem] p-6 shadow-lg flex flex-col justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" /> Active Hours
          </h3>
          <div className="flex items-end justify-between gap-1 h-24">
            {[40, 70, 45, 90, 65, 30, 50, 85, 100, 40].map((val, i) => (
              <div key={i} className="flex-1 bg-primary/20 border-t border-primary/40 rounded-t-sm" style={{ height: `${val}%` }} />
            ))}
          </div>
          <p className="text-[8px] opacity-40 mt-4 text-center">Peak activity detected at 22:00</p>
        </div>
      </div>

      {/* User Table */}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] bg-foreground/5 border-2 border-primary/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">Adventurer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-black uppercase tracking-widest ${user.id === currentUser.id ? 'text-primary' : ''}`}>{user.username}</span>
                      <span className="text-[8px] opacity-40 font-bold">{user.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-primary italic">Lv. {user.level}</span>
                      <span className="text-[9px] opacity-40">{user.completedQuestsCount} Quests</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleRole(user)} disabled={user.id === currentUser.id} className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${user.role === 'admin' ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-primary/20 text-primary border border-primary/30'} ${user.id !== currentUser.id ? 'hover:scale-110 active:scale-95' : 'opacity-50'}`}>{user.role}</button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { playEffect('click'); if(confirm('Reset?')) adminUpdateUser({...user, level:1, exp:0, totalFocusTime:0, completedQuestsCount:0}); }} className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"><RefreshCw className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(user.id)} disabled={user.id === currentUser.id} className={`p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all ${user.id === currentUser.id ? 'opacity-20' : ''}`}><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
