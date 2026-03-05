"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, QuestLog } from '@/types';
import { titles } from '@/constants';

export function useUser() {
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_users');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', username: 'Hero', level: 1, exp: 0, unlockedTitles: ['novice'], currentTitleId: 'novice' }];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('pq_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [questLogs, setQuestLogs] = useState<QuestLog[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // Persistence
  useEffect(() => { if (users.length > 0) localStorage.setItem('pq_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('pq_current_user', JSON.stringify(currentUser));
    else if (users.length > 0) localStorage.removeItem('pq_current_user');
  }, [currentUser, users.length]);
  useEffect(() => { if (questLogs.length > 0) localStorage.setItem('pq_logs', JSON.stringify(questLogs)); }, [questLogs]);

  const updateCurrentUserAndList = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, []);

  const addQuestLog = useCallback((log: QuestLog) => {
    setQuestLogs(prev => [log, ...prev]);
  }, []);

  const checkNewTitles = useCallback((user: User, logs: QuestLog[], onUnlock: (titleName: string) => void) => {
    const newlyUnlocked = titles
      .filter(t => !user.unlockedTitles.includes(t.id))
      .filter(t => t.condition(user, logs))
      .map(t => t.id);
    
    if (newlyUnlocked.length > 0) {
      const updatedUser = {
        ...user,
        unlockedTitles: [...user.unlockedTitles, ...newlyUnlocked]
      };
      updateCurrentUserAndList(updatedUser);
      onUnlock(titles.find(t => t.id === newlyUnlocked[0])?.name || "");
      return true;
    }
    return false;
  }, [updateCurrentUserAndList]);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const login = useCallback((username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: "Adventurer not found." };
  }, [users]);

  const register = useCallback((username: string) => {
    if (users.find(u => u.username === username)) {
      return { success: false, error: "Name already taken." };
    }
    const newUser: User = { 
      id: Date.now().toString(), 
      username, 
      level: 1, 
      exp: 0, 
      unlockedTitles: ['novice'], 
      currentTitleId: 'novice' 
    };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  }, [users]);

  return {
    users,
    currentUser,
    questLogs,
    setCurrentUser,
    updateCurrentUserAndList,
    addQuestLog,
    checkNewTitles,
    login,
    register,
    logout
  };
}
