"use client";

import React, { useState } from 'react';
import { Shield, Users, Trash2, AlertCircle, ArrowLeft, RefreshCw, MessageSquare, Send } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@/hooks/useUser';
import { useAudio } from '@/hooks/useAudio';
import { useGuild } from '@/hooks/useGuild';

/**
 * 管理者専用ダッシュボードページ
 */
export default function AdminPage() {
  const { users, currentUser, adminDeleteUser, adminUpdateUser } = useUser();
  const { guildInfo, updateGlobalMessage } = useGuild();
  const { playEffect } = useAudio();
  const [error, setError] = useState("");
  const [newGlobalMsg, setNewGlobalMsg] = useState(guildInfo.globalMessage);

  // アクセス制限：管理者でない場合は警告を表示
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-widest text-red-500">Access Denied</h1>
        <p className="text-xs opacity-40 mt-2 text-center max-w-xs">
          Only high-ranking guild officials can enter this chamber.
        </p>
        <Link href="/" className="mt-8 text-[10px] font-black uppercase border-b border-primary text-primary pb-1">
          Return to Quest
        </Link>
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

  const resetStats = (user: any) => {
    playEffect('click');
    if (confirm(`Reset stats for ${user.username}?`)) {
      adminUpdateUser({ ...user, level: 1, exp: 0, totalFocusTime: 0, completedQuestsCount: 0 });
    }
  };

  const handleBroadcast = () => {
    playEffect('click');
    updateGlobalMessage(newGlobalMsg);
    alert("Message broadcasted to all guild members!");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-5xl mx-auto animate-in fade-in duration-500 pb-24">
      
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

      {error && (
        <div className="w-full bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-2xl mb-6 flex items-center gap-3 animate-bounce">
          <AlertCircle className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">{error}</span>
        </div>
      )}

      {/* Global Guild Message Editor */}
      <div className="w-full bg-foreground/5 border-2 border-red-500/20 rounded-[2.5rem] p-6 mb-8 shadow-lg">
        <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-red-400">
          <MessageSquare className="w-3 h-3" /> Broadcaster (Global Guild Message)
        </h3>
        <div className="flex flex-col md:flex-row gap-4">
          <textarea 
            value={newGlobalMsg}
            onChange={(e) => setNewGlobalMsg(e.target.value)}
            placeholder="Announce something to all guild members..."
            className="flex-1 bg-background/50 border border-red-500/20 rounded-2xl p-4 text-xs focus:outline-none focus:border-red-500/50 transition-all resize-none min-h-[80px]"
          />
          <button 
            onClick={handleBroadcast}
            className="md:w-32 bg-red-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-lg hover:bg-red-500 active:scale-95 transition-all flex items-center justify-center gap-2 px-4 py-4 md:py-0"
          >
            <Send className="w-4 h-4" /> Broadcast
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[800px] bg-foreground/5 border-2 border-primary/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/10">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">Adventurer</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">Role</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40">Joined At</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest opacity-40 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className={`font-black uppercase tracking-widest ${user.id === currentUser.id ? 'text-primary' : ''}`}>
                        {user.username}
                      </span>
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
                    <button 
                      onClick={() => toggleRole(user)}
                      disabled={user.id === currentUser.id}
                      className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest transition-all ${
                        user.role === 'admin' 
                          ? 'bg-red-500/20 text-red-500 border border-red-500/30' 
                          : 'bg-primary/20 text-primary border border-primary/30'
                      } ${user.id !== currentUser.id ? 'hover:scale-110 active:scale-95' : 'opacity-50'}`}
                    >
                      {user.role}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-[9px] opacity-60 font-bold">
                    {new Date(user.joinedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => resetStats(user)}
                        title="Reset Stats"
                        className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-all"
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUser.id}
                        title="Ban Adventurer"
                        className={`p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all ${user.id === currentUser.id ? 'opacity-20 cursor-not-allowed' : ''}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-4 opacity-20">
        <Users className="w-6 h-6" />
        <div className="h-px w-20 bg-foreground" />
        <Shield className="w-6 h-6" />
        <div className="h-px w-20 bg-foreground" />
        <Users className="w-6 h-6" />
      </div>

    </div>
  );
}
