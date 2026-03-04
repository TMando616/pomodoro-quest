"use client";

import React from 'react';
import { Shield } from 'lucide-react';
import { User } from '@/types';

type HUDProps = {
  user: User | null;
};

export function HUD({ user }: HUDProps) {
  const level = user ? user.level : 1;
  const exp = user ? user.exp : 0;
  const username = user ? user.username : "Guest Hero";

  return (
    <div className="w-full bg-background/40 border-2 border-primary/20 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group border-b-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20">
            <Shield className="text-primary w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] leading-none mb-1">Adventurer</div>
            <div className="text-2xl font-black italic text-primary leading-none">
              {username}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] opacity-50 font-black uppercase tracking-[0.2em] leading-none mb-1">Level</div>
          <div className="text-2xl font-black italic text-primary leading-none">
            Lv. {level}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="relative w-full h-3 bg-foreground/5 rounded-full overflow-hidden border border-primary/10">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary/60 to-primary shadow-[0_0_15px_var(--color-primary)] transition-all duration-1000 ease-out"
            style={{ width: `${(exp / 1000) * 100}%` }}
          />
        </div>
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-primary/70 tracking-widest italic uppercase">
            EXP {exp} / 1000
          </span>
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${ exp >= (i + 1) * 200 ? 'bg-primary shadow-[0_0_8px_var(--color-primary)]' : 'bg-foreground/10'}`} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
