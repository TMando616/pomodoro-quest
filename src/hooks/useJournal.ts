"use client";

import { useState, useEffect, useCallback } from 'react';
import { JournalEntry } from '@/types';

/**
 * 日記（冒険日誌）のデータを管理するカスタムフック
 */
export function useJournal() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_journal');
    return saved ? JSON.parse(saved) : [];
  });

  // 保存処理
  useEffect(() => {
    localStorage.setItem('pq_journal', JSON.stringify(entries));
  }, [entries]);

  const addEntry = useCallback((userId: string, content: string, mood: JournalEntry['mood'], questLogId?: string) => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId,
      questLogId,
      content,
      mood,
      createdAt: Date.now(),
    };
    setEntries(prev => [newEntry, ...prev]);
  }, []);

  const updateEntry = useCallback((id: string, content: string, mood: JournalEntry['mood']) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, content, mood } : entry
    ));
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  }, []);

  return {
    entries,
    addEntry,
    updateEntry,
    deleteEntry
  };
}
