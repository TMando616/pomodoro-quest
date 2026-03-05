"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, QuestLog } from '@/types';
import { titles } from '@/constants';

/**
 * ユーザーデータ、進捗（経験値・称号）、認証ロジックを管理するフック
 */
export function useUser() {
  // 全ユーザーリスト（インメモリ擬似DB）
  const [users, setUsers] = useState<User[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_users');
    if (saved) return JSON.parse(saved);
    return [{ id: '1', username: 'Hero', level: 1, exp: 0, unlockedTitles: ['novice'], currentTitleId: 'novice' }];
  });

  // 現在ログイン中のユーザー
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('pq_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  // 全クエスト履歴
  const [questLogs, setQuestLogs] = useState<QuestLog[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('pq_logs');
    return saved ? JSON.parse(saved) : [];
  });

  // データが変わるたびに localStorage に保存して永続化
  useEffect(() => { if (users.length > 0) localStorage.setItem('pq_users', JSON.stringify(users)); }, [users]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('pq_current_user', JSON.stringify(currentUser));
    else if (users.length > 0) localStorage.removeItem('pq_current_user');
  }, [currentUser, users.length]);
  useEffect(() => { if (questLogs.length > 0) localStorage.setItem('pq_logs', JSON.stringify(questLogs)); }, [questLogs]);

  /**
   * 現在のユーザー情報を更新し、同時に全体リストにも反映させる
   */
  const updateCurrentUserAndList = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, []);

  /**
   * クエスト履歴を追加する
   */
  const addQuestLog = useCallback((log: QuestLog) => {
    setQuestLogs(prev => [log, ...prev]);
  }, []);

  /**
   * 称号のアンロック条件をチェックする
   */
  const checkNewTitles = useCallback((user: User, logs: QuestLog[], onUnlock: (titleName: string) => void) => {
    // まだ持っていない称号の中で、条件を満たしているものを探す
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
      // アンロック通知（最初に見つかったもの）
      onUnlock(titles.find(t => t.id === newlyUnlocked[0])?.name || "");
      return true;
    }
    return false;
  }, [updateCurrentUserAndList]);

  /**
   * ログアウト処理
   */
  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  /**
   * ログイン処理
   */
  const login = useCallback((username: string) => {
    const user = users.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: "Adventurer not found." };
  }, [users]);

  /**
   * 新規登録処理
   */
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
