"use client";

import { useCallback, useRef, useState, useEffect } from 'react';

// サウンドエフェクトの種類を定義
export type SoundEffectType = 'click' | 'complete' | 'level-up' | 'boss';

/**
 * サウンド再生ロジックを管理するフック
 * Web Audio API を使用して、プログラム上で音色を生成・再生します。
 */
export function useAudio() {
  // AudioContext（音を鳴らすための基盤）を保持するRef
  const audioCtx = useRef<AudioContext | null>(null);
  // サウンドのON/OFF状態
  const [isSoundOn, setIsSoundOn] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('pq_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // 状態が変わるたびに localStorage に保存
  useEffect(() => {
    localStorage.setItem('pq_sound', JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  /**
   * 指定された種類のサウンドを再生する関数
   */
  const playEffect = useCallback((type: SoundEffectType) => {
    if (!isSoundOn) return; // オフなら何もしない

    // 初回再生時に AudioContext を作成（ブラウザの制限によりユーザー操作が必要なためここで作成）
    if (!audioCtx.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx.current = new AudioContextClass();
      }
    }

    const ctx = audioCtx.current;
    if (!ctx) return;

    // オシレーター（音の波形を作る装置）とゲイン（音量調節）を作成
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    // 種類に応じて音色と周波数を設定
    switch (type) {
      case 'click':
        osc.type = 'sine'; // 柔らかなサイン波
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'complete':
        osc.type = 'square'; // RPG風の矩形波
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
        });
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'level-up':
        osc.type = 'sawtooth'; // 鋭いノコギリ波
        for (let i = 0; i < 8; i++) {
          osc.frequency.setValueAtTime(523.25 * Math.pow(1.06, i * 2), now + i * 0.05);
        }
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      case 'boss':
        osc.type = 'triangle'; // 重みのある三角波
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
    }
  }, [isSoundOn]);

  /**
   * サウンドのON/OFFを切り替える
   */
  const toggleSound = useCallback(() => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    if (next) {
      setTimeout(() => playEffect('click'), 50); // テスト音
    }
  }, [isSoundOn, playEffect]);

  return { isSoundOn, playEffect, toggleSound };
}
