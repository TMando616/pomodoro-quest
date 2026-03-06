"use client";

import React from 'react';
import { Settings, Bell, Clock, Monitor, Shield, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { useAudio } from '@/hooks/useAudio';

/**
 * 設定ページ
 */
export default function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { playEffect } = useAudio();

  const handleToggle = (key: keyof typeof settings) => {
    playEffect('click');
    updateSettings({ [key]: !settings[key] });
  };

  const clearData = () => {
    if (confirm("Are you sure? All your progress, levels, and logs will be lost forever.")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-4 md:p-8 pt-8 max-w-2xl mx-auto animate-in fade-in duration-500 pb-24">
      
      {/* Header */}
      <div className="w-full flex items-center gap-3 mb-8 pb-4 border-b-2 border-primary/20">
        <Settings className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-2xl font-black uppercase tracking-[0.2em] text-primary">System Settings</h1>
          <p className="text-[10px] opacity-60 uppercase tracking-widest">Configure your adventure experience</p>
        </div>
      </div>

      <div className="w-full space-y-6">
        
        {/* Timer Settings */}
        <section className="bg-foreground/5 border-2 border-primary/10 rounded-[2rem] p-6 shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <Clock className="w-3 h-3 text-primary" /> Quest Configuration
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Default Quest Duration</p>
                <p className="text-[8px] opacity-40 uppercase">Initial time for new quests</p>
              </div>
              <div className="flex bg-background/50 rounded-xl p-1 border border-primary/10">
                {[25, 45, 60].map(val => (
                  <button
                    key={val}
                    onClick={() => { playEffect('click'); updateSettings({ defaultDuration: val }); }}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black transition-all ${settings.defaultDuration === val ? 'bg-primary text-primary-foreground shadow-md' : 'opacity-40 hover:opacity-100'}`}
                  >
                    {val}m
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-primary/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Auto-Start Rest</p>
                <p className="text-[8px] opacity-40 uppercase">Immediately rest after a quest</p>
              </div>
              <button 
                onClick={() => handleToggle('autoStartRest')}
                className={`w-10 h-5 rounded-full relative transition-all ${settings.autoStartRest ? 'bg-primary' : 'bg-foreground/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.autoStartRest ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* System Settings */}
        <section className="bg-foreground/5 border-2 border-primary/10 rounded-[2rem] p-6 shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
            <Monitor className="w-3 h-3 text-primary" /> Interface & HUD
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">System Notifications</p>
                <p className="text-[8px] opacity-40 uppercase">Show desktop alerts when complete</p>
              </div>
              <button 
                onClick={() => handleToggle('showNotifications')}
                className={`w-10 h-5 rounded-full relative transition-all ${settings.showNotifications ? 'bg-primary' : 'bg-foreground/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.showNotifications ? 'left-6' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-primary/5">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest">Compact Mode</p>
                <p className="text-[8px] opacity-40 uppercase">Minimize HUD size for focus</p>
              </div>
              <button 
                onClick={() => handleToggle('compactHUD')}
                className={`w-10 h-5 rounded-full relative transition-all ${settings.compactHUD ? 'bg-primary' : 'bg-foreground/10'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${settings.compactHUD ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-950/10 border-2 border-red-500/20 rounded-[2rem] p-6 shadow-lg">
          <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2 text-red-500">
            <Shield className="w-3 h-3" /> Danger Zone
          </h3>
          
          <div className="space-y-4">
            <button 
              onClick={clearData}
              className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 rounded-2xl transition-all group"
            >
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Obliterate All Data</p>
                <p className="text-[8px] text-red-400/60 uppercase">Reset everything to zero</p>
              </div>
              <Trash2 className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </section>

      </div>

      {/* Save Success Indicator (Mock) */}
      <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
        <CheckCircle2 className="w-3 h-3" /> Settings synchronized with Guild scrolls
      </div>

    </div>
  );
}
