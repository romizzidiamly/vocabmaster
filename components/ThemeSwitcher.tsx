'use client';

import { useTheme, Theme } from '@/context/ThemeContext';
import { Moon, Sun, Crown, Zap, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const themes: { id: Theme; icon: any; label: string; emoji: string; color: string }[] = [
        { id: 'dark', icon: Moon, label: 'Pro Dark', emoji: '🌑', color: 'text-slate-400' },
        { id: 'light', icon: Sun, label: 'Clean Light', emoji: '☀️', color: 'text-amber-500' },
        { id: 'luxury', icon: Crown, label: 'Luxury Pro', emoji: '🔴', color: 'text-red-600' },
        { id: 'vibrant', icon: Zap, label: 'WOW Vibrant', emoji: '🌈', color: 'text-pink-500' },
    ];

    return (
        <div className="fixed bottom-8 right-8 z-[100]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-20 right-0 glass rounded-3xl p-3 shadow-2xl min-w-[180px] border-white/10"
                    >
                        <div className="flex flex-col gap-1">
                            {themes.map((t) => (
                                <button
                                    key={t.id}
                                    onClick={() => {
                                        setTheme(t.id);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "flex items-center justify-between w-full px-4 py-3 rounded-2xl transition-all group",
                                        theme === t.id
                                            ? "bg-primary/20 text-white"
                                            : "hover:bg-white/5 text-slate-400"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <t.icon className={cn("w-4 h-4", theme === t.id ? "text-primary" : "group-hover:text-white")} />
                                        <span className="text-xs font-black uppercase tracking-widest">{t.label}</span>
                                    </div>
                                    <span className="text-base">{t.emoji}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
                    "bg-primary text-white hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.5)]",
                    isOpen ? "rotate-180" : ""
                )}
                style={{
                    backgroundColor: 'var(--primary)',
                    boxShadow: '0 0 20px var(--primary)',
                }}
            >
                <Palette className="w-8 h-8" />
                <div className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                    ✨
                </div>
            </motion.button>
        </div>
    );
}
