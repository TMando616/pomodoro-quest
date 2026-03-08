"use client";

import { useState, useEffect, useCallback } from 'react';
import { User, QuestLog } from '@/types';
import { titles } from '@/constants';

/**
 * ユーザーデータ、進捗（経験値・称号）、認証ロジックを管理するフック
 */
export function useUser() {
  // ハイドレーションエラー防止のため、初期値は常に固定
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [questLogs, setQuestLogs] = useState<QuestLog[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // マウント時に localStorage からデータを読み込む
  useEffect(() => {
    const savedUsers = localStorage.getItem('pq_users');
    const savedCurrentUser = localStorage.getItem('pq_current_user');
    const savedLogs = localStorage.getItem('pq_logs');

    if (savedUsers) {
      try {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUsers(JSON.parse(savedUsers));
      } catch (e) {
        console.error("Failed to parse users", e);
      }
    } else {
      // 初期データ（最初の冒険者）
      setUsers([{ 
        id: '1', 
        username: 'Hero', 
        level: 1, 
        exp: 0, 
        role: 'admin', 
        joinedAt: 0,
        totalFocusTime: 0,
        completedQuestsCount: 0,
        unlockedTitles: ['novice'], 
        currentTitleId: 'novice' 
      }]);
    }

    if (savedCurrentUser) {
      try {
        setCurrentUser(JSON.parse(savedCurrentUser));
      } catch (e) {
        console.error("Failed to parse current user", e);
      }
    }

    if (savedLogs) {
      try {
        setQuestLogs(JSON.parse(savedLogs));
      } catch (e) {
        console.error("Failed to parse logs", e);
      }
    }

    setIsMounted(true);
  }, []);

  // データが変わるたびに localStorage に保存して永続化（マウント後のみ）
  useEffect(() => { 
    if (!isMounted) return;
    if (users.length > 0) {
      localStorage.setItem('pq_users', JSON.stringify(users));
    }
  }, [users, isMounted]);

  useEffect(() => {
    if (!isMounted) return;
    if (currentUser) {
      localStorage.setItem('pq_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('pq_current_user');
    }
  }, [currentUser, isMounted]);

  useEffect(() => { 
    if (!isMounted) return;
    if (questLogs.length > 0) {
      localStorage.setItem('pq_logs', JSON.stringify(questLogs));
    }
  }, [questLogs, isMounted]);

  /**
   * 現在のユーザー情報を更新し、同時に全体リストにも反映させる
   */
  const updateCurrentUserAndList = useCallback((updatedUser: User) => {
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
  }, []);

  /**
   * 管理者用：特定のユーザー情報を更新する
   */
  const adminUpdateUser = useCallback((updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    if (currentUser?.id === updatedUser.id) {
      setCurrentUser(updatedUser);
    }
  }, [currentUser]);

  /**
   * 管理者用：特定のユーザーをギルドから追放（削除）する
   */
  const adminDeleteUser = useCallback((id: string) => {
    if (currentUser?.id === id) return { success: false, error: "Cannot ban yourself." };
    setUsers(prev => prev.filter(u => u.id !== id));
    return { success: true };
  }, [currentUser]);

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
    // 最初の一人目、または特定の名前を管理者にする
    const isFirstUser = users.length === 0;
    const role = (isFirstUser || username.toLowerCase() === 'admin') ? 'admin' : 'user';

    const newUser: User = { 
      id: Date.now().toString(), 
      username, 
      level: 1, 
      exp: 0, 
      role,
      joinedAt: Date.now(),
      totalFocusTime: 0,
      completedQuestsCount: 0,
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
    isMounted,
    setCurrentUser,
    updateCurrentUserAndList,
    adminUpdateUser,
    adminDeleteUser,
    addQuestLog,
    checkNewTitles,
    login,
    register,
    logout
  };
}
