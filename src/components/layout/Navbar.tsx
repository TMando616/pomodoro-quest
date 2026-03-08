"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, BookOpen, Users, Settings } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useSettings } from '@/hooks/useSettings';

/**
 * アプリケーション全体のナビゲーションバー
 * 画面下部（または左側）に固定され、各ページへの遷移を担います。
 */
export function Navbar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const { settings, isMounted } = useSettings();

  // スタート画面（Opening）がまだ終わっていない場合はナビゲーションを表示しない
  // ただし、ホームページ以外のページ（/help, /settings等）に直接アクセスしている場合は表示する
  if (isMounted && !settings.openingSeen && pathname === '/') {
    return null;
  }

  const navItems = [
    { href: '/', label: t.navbar.quest, icon: Home },
    { href: '/journal', label: t.navbar.journal, icon: BookOpen },
    { href: '/guild', label: t.navbar.guild, icon: Users },
    { href: '/profile', label: t.navbar.profile, icon: User },
    { href: '/settings', label: t.navbar.settings, icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-md border-t-2 border-primary/20 z-50 md:bottom-auto md:top-0 md:border-t-0 md:border-b-2">
      <div className="max-w-md md:max-w-4xl mx-auto flex justify-around items-center p-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'text-primary bg-primary/10 shadow-[0_0_15px_var(--color-primary-glow)] scale-110' 
                  : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
              }`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6" />
              <span className="text-[8px] font-black uppercase tracking-widest hidden md:block">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
