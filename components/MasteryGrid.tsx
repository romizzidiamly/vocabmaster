'use client';

import { useVocabStore } from '@/context/VocabContext';
import { VocabItem } from '@/types';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { useState } from 'react';

export function MasteryGrid() {
    const { gameState, setPhase } = useVocabStore();
    const [selectedItem, setSelectedItem] = useState<VocabItem | null>(null);

    const discoveredCount = gameState.items.filter(i => i.status !== 'hidden').length;
    const masteredCount = gameState.items.filter(i => i.status === 'mastered').length;
    const totalCount = gameState.items.length;

    if (totalCount === 0) return null;

    return (
        <div className="w-full space-y-6">
            <div className="flex justify-between items-end px-2">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Mastery Gallery</h3>
                    <p className="text-xs text-slate-500 font-bold tracking-widest uppercase">
                        {masteredCount} Mastered • {discoveredCount} Discovered • {totalCount} Total
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameState.items.map((item) => (
                    <div
                        key={item.id}
                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${item.status === 'mastered'
                                ? 'bg-indigo-500/10 border-indigo-500/30'
                                : item.status === 'discovered'
                                    ? 'bg-slate-900/50 border-slate-800'
                                    : 'bg-slate-900/20 border-slate-800/50 grayscale opacity-60'
                            }`}
                    >
                        {/* Progress Indicator */}
                        <div className={`absolute top-0 left-0 w-1 h-full transition-all ${item.status === 'mastered' ? 'bg-indigo-500' :
                                item.status === 'discovered' ? 'bg-slate-400' : 'bg-transparent'
                            }`} />

                        <div className="p-5 flex flex-col h-full">
                            <div className="flex justify-between items-start mb-3">
                                {item.status === 'hidden' ? (
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Lock className="w-4 h-4" />
                                        <span className="text-sm font-black uppercase tracking-widest">Locked</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-black text-white uppercase tracking-tight">
                                            {item.word}
                                        </span>
                                        {item.status === 'mastered' && (
                                            <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex-grow">
                                {item.status !== 'hidden' ? (
                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                        {item.synonyms.map((syn, idx) => (
                                            <span
                                                key={idx}
                                                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md border transition-all ${item.status === 'mastered'
                                                        ? 'bg-indigo-500/20 border-indigo-500/20 text-indigo-300'
                                                        : 'bg-slate-950/50 border-slate-800 text-slate-500'
                                                    }`}
                                            >
                                                {syn}
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="space-y-2 mt-2">
                                        <div className="h-1.5 w-full bg-slate-800/50 rounded-full animate-pulse" />
                                        <div className="h-1.5 w-2/3 bg-slate-800/50 rounded-full animate-pulse" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
