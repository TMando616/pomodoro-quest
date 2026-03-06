"use client";

import React, { useState } from 'react';
import { BookOpen, PenTool, Trash2, Smile, Frown, Meh, Star } from 'lucide-react';
import { useJournal } from '@/hooks/useJournal';
import { useUser } from '@/hooks/useUser';
import { JournalEntry } from '@/types';

/**
 * 冒険日誌（日記）ページ
 */
export default function JournalPage() {
  const { currentUser } = useUser();
  const { entries, addEntry, deleteEntry } = useJournal();
  
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<JournalEntry['mood']>('good');

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <BookOpen className="w-16 h-16 text-foreground/20 mb-4" />
        <h1 className="text-xl font-black uppercase tracking-widest text-foreground/50">Journal Locked</h1>
        <p className="text-xs opacity-40 mt-2">Please login to write your adventure log.</p>
      </div>
    );
  }

  const userEntries = entries.filter(e => e.userId === currentUser.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    addEntry(currentUser.id, content, mood);
    setContent("");
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
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-primary">Adventure Journal</h1>
          <p className="text-[10px] opacity-60 uppercase tracking-widest">Chronicles of {currentUser.username}</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="w-full bg-foreground/5 border-2 border-primary/20 rounded-[2rem] p-6 shadow-xl mb-10">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-60 flex items-center gap-2">
              <PenTool className="w-3 h-3" /> New Entry
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
            placeholder="Write about your focus journey today..."
            className="w-full bg-background/50 border-2 border-primary/10 rounded-2xl p-4 min-h-[120px] focus:outline-none focus:border-primary/50 resize-none transition-all"
          />
          <div className="flex justify-end">
            <button 
              type="submit" 
              disabled={!content.trim()}
              className="px-6 py-2 bg-primary text-primary-foreground font-black uppercase tracking-widest text-[10px] rounded-xl shadow-lg hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all"
            >
              Seal the Record
            </button>
          </div>
        </form>
      </div>

      {/* Entry List */}
      <div className="w-full flex flex-col gap-4 pb-20">
        {userEntries.length === 0 ? (
          <div className="text-center py-10 opacity-30 text-xs font-black uppercase tracking-widest">
            No entries yet...
          </div>
        ) : (
          userEntries.map(entry => (
            <div key={entry.id} className="relative bg-background border-l-4 border-primary/50 rounded-r-2xl p-5 shadow-md hover:border-primary transition-all group">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  {getMoodIcon(entry.mood)}
                  <span className="text-[10px] opacity-40 font-bold uppercase tracking-wider">
                    {new Date(entry.createdAt).toLocaleString()}
                  </span>
                </div>
                <button 
                  onClick={() => deleteEntry(entry.id)}
                  className="opacity-0 group-hover:opacity-40 hover:!opacity-100 text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
