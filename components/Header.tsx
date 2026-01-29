'use client';

import { useVocabStore } from '@/context/VocabContext';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { BookOpen, RotateCcw, Sparkles, LogIn, LogOut, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export function Header() {
    const { gameState, setPhase, resetGame } = useVocabStore();
    const { theme } = useTheme();
    const { isAdmin, logout } = useAuth();

    const getLogoEmoji = () => {
        switch (theme) {
            case 'light': return '☀️';
            case 'luxury': return '🔴';
            case 'vibrant': return '🌈';
            default: return '🌑';
        }
    };

    return (
        <header className="sticky top-6 z-50 mb-16 flex items-center justify-between glass px-6 py-4 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
            {/* Theme Highlight Line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => resetGame()}>
                <div className="relative">
                    <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        V
                    </div>
                    <div className="absolute -top-1 -right-1 text-xs animate-bounce">
                        {getLogoEmoji()}
                    </div>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black tracking-tight text-foreground leading-none flex items-center gap-2">
                        VocabMaster <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                    </h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] items-center gap-1 font-bold text-primary uppercase tracking-[0.2em] flex">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Active Recall 🔥
                        </span>
                        {isAdmin && (
                            <span className="text-[8px] bg-primary/20 text-primary px-1.5 py-0.5 rounded-full font-black uppercase tracking-widest flex items-center gap-1 shadow-[0_0_10px_rgba(var(--primary-rgb),0.2)]">
                                <ShieldCheck className="w-2 h-2" /> Admin
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <button
                    onClick={() => setPhase('topic-list')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 glass-light hover:bg-white/10 text-foreground rounded-xl text-xs font-black uppercase tracking-widest transition-all group"
                >
                    <BookOpen className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    <span>Modules 📚</span>
                </button>

                {isAdmin ? (
                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/dashboard"
                            className="flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl text-xs font-black uppercase tracking-widest transition-all border border-primary/20 group"
                        >
                            <ShieldCheck className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                            <span>Dashboard 🏰</span>
                        </Link>
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-2 px-4 py-2 glass-light hover:bg-red-500/10 text-red-500 rounded-xl text-xs font-black uppercase tracking-widest transition-all group"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <Link
                        href="/login"
                        className="flex items-center gap-2 px-4 py-2 glass-light hover:bg-white/10 text-foreground rounded-xl text-xs font-black uppercase tracking-widest transition-all group"
                    >
                        <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Login 🔑</span>
                    </Link>
                )}

                <button
                    onClick={() => resetGame()}
                    className="p-2 glass-light hover:bg-red-500/20 text-red-500 rounded-xl transition-all group"
                    title="Reset All"
                >
                    <RotateCcw className="w-4 h-4 group-hover:-rotate-180 transition-transform duration-500" />
                </button>
            </div>
        </header>
    );
}
