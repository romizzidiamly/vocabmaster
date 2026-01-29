'use client';

import { RotateCcw, LayoutGrid } from 'lucide-react';
import { useVocabStore } from '@/context/VocabContext';

export function Header() {
    const { gameState, resetGame } = useVocabStore();

    return (
        <header className="sticky top-6 z-50 mb-16 flex items-center justify-between glass px-6 py-4 rounded-3xl shadow-2xl shadow-black/20">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => resetGame()}>
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                    V
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-black tracking-tight text-white leading-none">VocabMaster</h1>
                    <span className="text-[10px] items-center gap-1 font-bold text-indigo-400 uppercase tracking-[0.2em] mt-1 flex">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        Active Recall
                    </span>
                </div>
            </div>

            {gameState.phase !== 'topic-list' && (
                <div className="flex gap-3">
                    <button
                        onClick={() => resetGame()}
                        className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-300 hover:text-white glass-light rounded-2xl transition-all border border-white/5 uppercase tracking-widest hover:bg-white/10"
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Topics</span>
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Restart current session?')) {
                                // Logic for reset handled in Context if needed
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 text-xs font-black text-slate-300 hover:text-white glass-light rounded-2xl transition-all border border-white/5 uppercase tracking-widest hover:bg-white/10"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                </div>
            )}
        </header>
    );
}
