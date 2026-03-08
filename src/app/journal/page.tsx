"use client";

import React, { useState } from 'react';
import { BookOpen, PenTool, Trash2, Smile, Frown, Meh, Star, Edit3, X, Check } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';
import { useUser } from '@/hooks/useUser';
import { useAudio } from '@/hooks/useAudio';
import { JournalEntry } from '@/types';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * 冒険日誌（日記）ページ
 */
export default function JournalPage() {
  const { currentUser, isMounted } = useUser();
  const { entries, addEntry, deleteEntry, updateEntry } = useJournal();
  const { playEffect } = useAudio();
  const { t } = useTranslation();
  
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<JournalEntry['mood']>('good');
  const [editingId, setEditingId] = useState<string | null>(null);

  // マウント前はハイドレーションエラー防止のため何も表示しないか、ローディングを表示
  if (!isMounted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-widest mt-4 opacity-40">{t.common.loading}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <BookOpen className="w-16 h-16 text-foreground/20 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-widest text-foreground/50">{t.journal.locked}</h1>
        <p className="text-xs opacity-40 mt-2">{t.journal.lockedDesc}</p>
      </div>
    );
  }

  const userEntries = entries.filter(e => e.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    playEffect('click');
    if (editingId) {
      updateEntry(editingId, content, mood);
      setEditingId(null);
    } else {
      addEntry(currentUser.id, content, mood);
    }
    
    setContent("");
    setMood('good');
  };

  const startEdit = (entry: JournalEntry) => {
    playEffect('click');
    setEditingId(entry.id);
    setContent(entry.content);
    setMood(entry.mood);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    playEffect('click');
    setEditingId(null);
    setContent("");
    setMood('good');
  };

  const getMoodIcon = (m: JournalEntry['mood']) => {
    switch (m) {
      case 'great': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'good': return <Smile className="w-4 h-4 text-emerald-500" />;
      case 'tired': return <Meh className="w-4 h-4 text-amber-500" />;
      case 'bad': return <Frown className="w-4 h-4 text-red-500" />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-2xl mx-auto animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="w-full flex items-center gap-3 mb-8 pb-4 border-b-2 border-primary/20">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-primary">{t.journal.title}</h1>
          <p className="text-[10px] opacity-60 uppercase tracking-widest">{t.journal.subtitle.replace('{name}', currentUser.username)}</p>
        </div>
      </div>

      {/* Input Form (Add or Edit) */}
      <div className={`w-full bg-foreground/5 border-2 rounded-[2rem] p-6 shadow-xl mb-10 transition-all duration-500 ${editingId ? 'border-amber-500/50 bg-amber-500/5' : 'border-primary/20'}`}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${editingId ? 'text-amber-500' : 'opacity-60'}`}>
              {editingId ? <Edit3 className="w-3 h-3" /> : <PenTool className="w-3 h-3" />}
              {editingId ? t.journal.editing : t.journal.newEntry}
            </span>
            <div className="flex gap-2">
              {(['great', 'good', 'tired', 'bad'] as const).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(m)}
                  className={`p-2 rounded-full transition-all ${mood === m ? 'bg-background shadow-[0_0_10px_var(--color-primary-glow)] scale-110' : 'opacity-40 hover:opacity-100'}`}
                  title={m}
                >
                  {getMoodIcon(m)}
                </button>
              ))}
            </div>
          </div>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.journal.placeholder}
            className="w-full bg-background/50 border-2 border-primary/10 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-primary/50 resize-none transition-all"
          />
          <div className="flex justify-end gap-3">
            {editingId && (
              <button 
                type="button"
                onClick={cancelEdit}
                className="px-6 py-2 bg-foreground/10 text-foreground/60 font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-foreground/20 transition-all flex items-center gap-2"
              >
                <X className="w-3 h-3" /> {t.common.cancel}
              </button>
            )}
            <button 
              type="submit" 
              disabled={!content.trim()}
              className={`px-6 py-2 font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 ${editingId ? 'bg-amber-500 text-white' : 'bg-primary text-primary-foreground'}`}
            >
              {editingId ? <Check className="w-3 h-3" /> : null}
              {editingId ? t.journal.update : t.journal.seal}
            </button>
          </div>
        </form>
      </div>

      {/* Entry List */}
      <div className="w-full flex flex-col gap-4 pb-20">
        {userEntries.length === 0 ? (
          <div className="text-center py-10 opacity-30 text-xs font-black uppercase tracking-widest">
            {t.journal.noEntries}
          </div>
        ) : (
          userEntries.map(entry => (
            <div key={entry.id} className={`relative bg-background border-l-4 rounded-r-2xl p-5 shadow-md transition-all group ${editingId === entry.id ? 'border-amber-500 scale-[0.98] opacity-50' : 'border-primary/50 hover:border-primary'}`}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getMoodIcon(entry.mood)}
                  <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button 
                    onClick={() => startEdit(entry)}
                    className="p-1 text-primary hover:bg-primary/10 rounded transition-all"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { playEffect('click'); deleteEntry(entry.id); }}
                    className="p-1 text-red-500 hover:bg-red-500/10 rounded transition-all"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm opacity-90 whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
