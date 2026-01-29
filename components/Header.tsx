'use client';

import { RotateCcw, LayoutGrid } from 'lucide-react';
import { useVocabStore } from '@/context/VocabContext';

export function Header() {
    const { gameState, resetGame } = useVocabStore();

    return (
        <header className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-indigo-500/20">V</div>
                <h1 className="text-2xl font-black tracking-tighter text-white">VocabMaster</h1>
            </div>

            {gameState.phase !== 'topic-list' && (
                <div className="flex gap-3">
                    <button
                        onClick={() => resetGame()}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50"
                    >
                        <LayoutGrid className="w-4 h-4" />
                        <span className="hidden sm:inline">Menu</span>
                    </button>
                    <button
                        onClick={() => {
                            if (confirm('Restart current session?')) {
                                // Keep current items but reset status?
                                // For simplicity, just reset to original state of this topic if we want.
                                // For now we'll just allow Menu return.
                            }
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all border border-slate-700/50"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span className="hidden sm:inline">Reset</span>
                    </button>
                </div>
            )}
        </header>
    );
}
