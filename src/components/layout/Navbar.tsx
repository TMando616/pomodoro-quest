"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, BookOpen, Users, Settings } from 'lucide-react';

/**
 * アプリケーション全体のナビゲーションバー
 * 画面下部（または左側）に固定され、各ページへの遷移を担います。
 */
export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Quest', icon: Home },
    { href: '/journal', label: 'Journal', icon: BookOpen },
    { href: '/guild', label: 'Guild', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
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
