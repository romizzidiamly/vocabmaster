'use client';

import { useVocabStore } from '@/context/VocabContext';
import { cn } from '@/lib/utils';

export function MasteryGrid() {
    const { gameState, stats } = useVocabStore();

    if (gameState.items.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex justify-between items-end">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-500">Mastery Map</h3>
                <div className="text-right">
                    <span className="text-2xl font-black text-white">{Math.round((stats.masteredCount / stats.totalCount) * 100)}%</span>
                    <span className="text-xs text-slate-600 block uppercase font-black">Retention Rate</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 p-4 bg-slate-900/50 rounded-2xl border border-slate-800 shadow-inner">
                {gameState.items.map((item) => (
                    <div
                        key={item.id}
                        className={cn(
                            "w-3 h-3 rounded-[3px] transition-all duration-500",
                            item.status === 'mastered' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" :
                                item.status === 'discovered' ? "bg-indigo-500/50" :
                                    "bg-slate-800"
                        )}
                        title={item.word}
                    />
                ))}
            </div>
        </div>
    );
}
