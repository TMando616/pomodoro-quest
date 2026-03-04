import { Theme, ThemeCategory } from "../types";

export const themes: Record<ThemeCategory, Theme[]> = {
  dark: [
    { name: 'emerald', label: 'Dark Emerald', color: 'bg-[#10b981]' },
    { name: 'ruby', label: 'Dark Ruby', color: 'bg-[#f43f5e]' },
    { name: 'sapphire', label: 'Dark Sapphire', color: 'bg-[#3b82f6]' },
    { name: 'amber', label: 'Dark Amber', color: 'bg-[#f59e0b]' },
    { name: 'amethyst', label: 'Dark Amethyst', color: 'bg-[#a855f7]' },
  ],
  light: [
    { name: 'emerald-light', label: 'Light Emerald', color: 'bg-[#059669]' },
    { name: 'ruby-light', label: 'Light Ruby', color: 'bg-[#e11d48]' },
    { name: 'sapphire-light', label: 'Light Sapphire', color: 'bg-[#2563eb]' },
    { name: 'amber-light', label: 'Light Amber', color: 'bg-[#d97706]' },
    { name: 'amethyst-light', label: 'Light Amethyst', color: 'bg-[#9333ea]' },
  ]
};

export const durationOptions = Array.from({ length: 12 }, (_, i) => (i + 1) * 5);
