"use client";

import { useCallback, useRef, useState, useEffect } from 'react';

export type SoundEffectType = 'click' | 'complete' | 'level-up' | 'boss';

export function useAudio() {
  const audioCtx = useRef<AudioContext | null>(null);
  const [isSoundOn, setIsSoundOn] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('pq_sound');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('pq_sound', JSON.stringify(isSoundOn));
  }, [isSoundOn]);

  const playEffect = useCallback((type: SoundEffectType) => {
    if (!isSoundOn) return;

    if (!audioCtx.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx.current = new AudioContextClass();
      }
    }

    const ctx = audioCtx.current;
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (type) {
      case 'click':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.1);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
      case 'complete':
        osc.type = 'square';
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
        });
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
      case 'level-up':
        osc.type = 'sawtooth';
        for (let i = 0; i < 8; i++) {
          osc.frequency.setValueAtTime(523.25 * Math.pow(1.06, i * 2), now + i * 0.05);
        }
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      case 'boss':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(110, now);
        osc.frequency.exponentialRampToValueAtTime(55, now + 0.5);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
        break;
    }
  }, [isSoundOn]);

  const toggleSound = useCallback(() => {
    const next = !isSoundOn;
    setIsSoundOn(next);
    if (next) {
      setTimeout(() => playEffect('click'), 50);
    }
  }, [isSoundOn, playEffect]);

  return { isSoundOn, playEffect, toggleSound };
}
