"use client";

import React from 'react';
import { HelpCircle, Book, Zap, Skull, Crown, Trophy, ArrowLeft, ChevronRight, MessageSquare, Info } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

/**
 * 冒険者ガイド（ヘルプ）ページ
 */
export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-3xl mx-auto animate-in fade-in duration-500 pb-24">
      
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 pb-4 border-b-2 border-primary/20">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-primary">{t.help.title}</h1>
            <p className="text-[10px] opacity-60 uppercase tracking-widest">{t.help.subtitle}</p>
          </div>
        </div>
        <Link href="/" className="flex items-center gap-2 px-4 py-2 bg-foreground/5 border border-foreground/10 rounded-xl hover:bg-foreground/10 transition-all text-[10px] font-black uppercase tracking-widest">
          <ArrowLeft className="w-3 h-3" /> {t.common.back}
        </Link>
      </div>

      <div className="w-full space-y-10">
        
        {/* Basics Section */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 opacity-50 px-2">
            <Book className="w-4 h-4" /> {t.help.basics.title}
          </h2>
          <div className="grid gap-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-start gap-4 bg-foreground/5 border border-primary/10 p-5 rounded-2xl relative overflow-hidden group hover:border-primary/30 transition-all">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-black italic shrink-0">
                  {step}
                </div>
                <p className="text-sm font-bold opacity-80 leading-relaxed pt-1">
                  {t.help.basics[`step${step}` as keyof typeof t.help.basics]}
                </p>
                <div className="absolute right-[-10px] bottom-[-10px] opacity-5 group-hover:opacity-10 transition-opacity">
                  <Zap className="w-16 h-16" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 opacity-50 px-2">
            <Trophy className="w-4 h-4" /> {t.help.features.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {/* Boss Mode */}
            <div className="bg-red-950/10 border-2 border-red-500/20 p-6 rounded-[2rem] space-y-3">
              <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-sm">
                <Skull className="w-5 h-5" /> {t.help.features.boss.name}
              </div>
              <p className="text-[11px] leading-relaxed opacity-70 font-bold">
                {t.help.features.boss.desc}
              </p>
            </div>

            {/* Titles */}
            <div className="bg-primary/5 border-2 border-primary/20 p-6 rounded-[2rem] space-y-3">
              <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
                <Crown className="w-5 h-5" /> {t.help.features.ranks.name}
              </div>
              <p className="text-[11px] leading-relaxed opacity-70 font-bold">
                {t.help.features.ranks.desc}
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-foreground/5 border border-primary/10 rounded-[2.5rem] p-8 space-y-8">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 opacity-50">
            <MessageSquare className="w-4 h-4" /> {t.help.faq.title}
          </h2>
          
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <h4 className="flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
                  <ChevronRight className="w-4 h-4" /> {t.help.faq[`q${i}` as keyof typeof t.help.faq]}
                </h4>
                <p className="pl-6 text-[11px] font-bold opacity-60 leading-relaxed italic border-l border-primary/20">
                  {t.help.faq[`a${i}` as keyof typeof t.help.faq]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-3 opacity-20">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">End of Chronicles</span>
        </div>

      </div>
    </div>
  );
}
