"use client";

import React from 'react';
import { LogIn, UserPlus, X, ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

type AuthOverlayProps = {
  isAuthMode: 'login' | 'register';
  authForm: { username: string };
  authError: string;
  onFormChange: (username: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onToggleMode: () => void;
  onCancel: () => void;
};

export function AuthOverlay({
  isAuthMode, authForm, authError, onFormChange, onSubmit, onToggleMode, onCancel
}: AuthOverlayProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-sm animate-in fade-in zoom-in duration-500">
      <div className="bg-background/80 border-2 border-primary/20 rounded-[2.5rem] p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
        {/* 装飾用の光彩 */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="p-3 bg-primary/10 rounded-2xl border border-primary/20">
              {isAuthMode === 'login' ? <ShieldCheck className="w-6 h-6 text-primary" /> : <UserPlus className="w-6 h-6 text-primary" />}
            </div>
            <button onClick={onCancel} className="p-2 hover:bg-foreground/5 rounded-full transition-all">
              <X className="w-5 h-5 opacity-30 hover:opacity-100" />
            </button>
          </div>

          <h2 className="text-xl font-black uppercase tracking-widest mb-2 text-primary">
            {isAuthMode === 'login' ? t.auth.login : t.auth.register}
          </h2>
          <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest mb-8 leading-relaxed">
            {isAuthMode === 'login' ? t.auth.enterName : t.auth.welcome}
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <input
                type="text"
                placeholder={t.auth.namePlaceholder}
                value={authForm.username}
                onChange={(e) => onFormChange(e.target.value)}
                autoFocus
                className="w-full bg-foreground/5 border-2 border-primary/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:opacity-30"
              />
              {authError && <p className="text-[10px] text-red-500 font-black uppercase tracking-widest pl-2">{authError}</p>}
            </div>

            <button type="submit" className="w-full bg-primary text-primary-foreground rounded-2xl py-4 font-black uppercase tracking-[0.2em] shadow-[0_0_20px_var(--color-primary-glow)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group">
              {isAuthMode === 'login' ? <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> : <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />}
              {isAuthMode === 'login' ? t.auth.login : t.auth.startAdventure}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-primary/10 text-center">
            <button onClick={onToggleMode} className="text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 hover:text-primary transition-all">
              {isAuthMode === 'login' ? t.auth.createNewAccount : t.auth.alreadyMember}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
