"use client";

import React from 'react';
import { Swords, Coffee } from 'lucide-react';

type TimerDisplayProps = {
  timeLeft: number;
  duration: number;
  isActive: boolean;
  message: string;
  formatTime: (seconds: number) => string;
  questName?: string;
};

export function TimerDisplay({ timeLeft, duration, isActive, message, formatTime, questName }: TimerDisplayProps) {
  const isRest = questName === "Resting at Inn";

  return (
    <div className="relative flex flex-col items-center">
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] md:w-[420px] md:h-[420px] border border-primary/10 rounded-full transition-all duration-1000 ${isActive ? 'scale-110 opacity-40' : 'scale-100 opacity-10'}`} />

      <div className={`relative bg-background/60 border-4 rounded-full w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center transition-all duration-700 backdrop-blur-md shadow-2xl ${
        isActive ? 'border-primary shadow-[0_0_40px_var(--color-primary-glow)]' : 'border-foreground/10'
      }`}>
        <div className="absolute top-10 flex flex-col items-center gap-1">
          {isRest ? (
            <Coffee className={`w-4 h-4 ${isActive ? 'text-primary animate-bounce' : 'opacity-20'}`} />
          ) : (
            <Swords className={`w-4 h-4 ${isActive ? 'text-primary animate-pulse' : 'opacity-20'}`} />
          )}
          <span className={`text-[9px] font-black uppercase tracking-[0.4em] ${isActive ? 'text-primary' : 'opacity-20'}`}>
            {isActive && questName ? questName : (isRest ? "Resting..." : "Focus Quest")}
          </span>
        </div>

        <div className={`text-7xl md:text-8xl font-black tracking-tighter select-none transition-colors duration-500 ${
          isActive ? 'text-primary drop-shadow-[0_0_15px_rgba(var(--primary-rgb),0.6)]' : 'opacity-20'
        }`}>
          {formatTime(timeLeft)}
        </div>

        {message && (
          <div className="absolute -bottom-16 md:-bottom-12 whitespace-nowrap animate-bounce z-20">
            <div className="bg-primary text-primary-foreground text-[10px] font-black py-2.5 px-6 rounded-2xl shadow-xl uppercase tracking-[0.2em] border border-white/20">
              {message}
            </div>
          </div>
        )}
        
        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 320 320">
          <circle cx="160" cy="160" r="154" fill="transparent" stroke="currentColor" strokeWidth="1" className="opacity-5" />
          <circle
            cx="160" cy="160" r="154"
            fill="transparent"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={967}
            strokeDashoffset={967 - (967 * (timeLeft / (duration * 60)))}
            className={`${isActive ? 'text-primary' : 'opacity-10'} transition-all duration-1000 ease-linear`}
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
