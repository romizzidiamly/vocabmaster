'use client';

import { useVocabStore } from '@/context/VocabContext';
import { cn } from '@/lib/utils';
import { Trophy, Star, Eye } from 'lucide-react';

export function MasteryGrid() {
    const { gameState, stats } = useVocabStore();

    const percentage = Math.round((stats.discoveredCount / stats.totalCount) * 100) || 0;

    return (
        <div className="w-full max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Progress Bar */}
            <div className="mb-8 bg-slate-900 border border-slate-800 p-6 rounded-xl">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-1">Session Progress</h3>
                        <p className="text-slate-400 text-sm">Keep going! Reveal all hidden words.</p>
                    </div>
                    <div className="text-right">
                        <span className="text-3xl font-bold text-indigo-400">{stats.discoveredCount}</span>
                        <span className="text-slate-500 text-xl font-medium"> / {stats.totalCount}</span>
                    </div>
                </div>

                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                        style={{ width: `${percentage}%` }}
                    />
                </div>
            </div>

            {/* Mastery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {gameState.items.map((item) => {
                    const isHidden = item.status === 'hidden';
                    const isMastered = item.status === 'mastered';

                    return (
                        <div
                            key={item.id}
                            className={cn(
                                "relative p-4 rounded-lg border transition-all duration-300 h-28 flex flex-col justify-between",
                                isHidden
                                    ? "bg-slate-900/50 border-slate-800 text-transparent select-none blur-[1px]"
                                    : "bg-slate-800 border-slate-700 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10",
                                isMastered && "border-yellow-500/30 bg-yellow-500/5"
                            )}
                        >
                            {isHidden ? (
                                <div className="absolute inset-0 flex items-center justify-center text-slate-700 font-mono text-2xl font-bold">
                                    ???
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-lg text-slate-100 truncate w-full" title={item.word}>
                                            {item.word}
                                        </h4>
                                        {isMastered && <Trophy className="w-4 h-4 text-yellow-500 shrink-0" />}
                                        {item.status === 'discovered' && <Eye className="w-4 h-4 text-blue-500 shrink-0" />}
                                    </div>
                                    <div className="text-sm text-slate-400 truncate">
                                        {isMastered ? item.synonyms.join(', ') : "Mastery locked"}
                                    </div>
                                    {isMastered && (
                                        <div className="absolute bottom-2 right-2 opacity-50">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
