'use client';

import { useState } from 'react';
import { useVocabStore } from '@/context/VocabContext';
import { cn } from '@/lib/utils';
import { Trophy, CheckCircle2, MessageSquare, BookText, Loader2, Wand2, RefreshCcw, Volume2, RotateCcw } from 'lucide-react';

export function RecallTable() {
    const { gameState, guessSynonym, generateAiExamples, resetTopicProgress, stats } = useVocabStore();
    const [localInputs, setLocalInputs] = useState<Record<string, string>>({});

    const handleInputChange = (key: string, value: string) => {
        setLocalInputs(prev => ({ ...prev, [key]: value }));
    };

    const speak = (text: string, lang: 'en-US' | 'en-GB') => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.rate = 0.85;

        const voices = window.speechSynthesis.getVoices();
        const voice = voices.find(v => v.lang.startsWith(lang));
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
    };

    const handleGuess = (wordId: string, synonymIndex: number) => {
        const key = `${wordId}-${synonymIndex}`;
        const val = localInputs[key];
        if (!val?.trim()) return;

        const correct = guessSynonym(wordId, val.trim());
        if (correct) {
            setLocalInputs(prev => ({ ...prev, [key]: '' }));
        }
    };

    const handleReset = () => {
        if (confirm("Reset all progress for this topic? You will need to discover words again.")) {
            resetTopicProgress();
        }
    };

    const discoveredItems = gameState.items.filter(i => i.status !== 'hidden');

    if (discoveredItems.length === 0) {
        return (
            <div className="w-full text-center py-20 bg-slate-950/50 rounded-3xl border-2 border-dashed border-slate-800 animate-pulse">
                <p className="text-slate-700 font-black uppercase tracking-widest text-sm">Discover words above to unlock the table</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
            <div className="bg-slate-950/50 p-6 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                        Mastery: {stats.masteredCount} / {stats.totalCount}
                    </p>
                    <button
                        onClick={handleReset}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase font-bold tracking-widest"
                    >
                        Reset Progress
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                            <th className="px-6 py-4 w-12">#</th>
                            <th className="px-6 py-4 w-40">Word</th>
                            <th className="px-6 py-4 w-60">Recall Synonyms</th>
                            <th className="px-6 py-4">Example Sentence</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {discoveredItems.map((item, index) => {
                            const isMastered = item.status === 'mastered';
                            return (
                                <tr key={item.id} className={cn(
                                    "transition-colors",
                                    isMastered ? "bg-green-500/5" : "hover:bg-slate-800/30"
                                )}>
                                    <td className="px-6 py-6 text-slate-600 font-mono text-xs">{index + 1}</td>
                                    <td className="px-6 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-bold text-lg text-white">{item.word}</span>
                                            {item.phonetics && (
                                                <span className="text-[10px] text-slate-500 font-mono">{item.phonetics.us}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="space-y-3">
                                            {item.synonyms.map((_, sIdx) => {
                                                const isCorrect = item.userGuesses.length > sIdx;
                                                return (
                                                    <div key={sIdx}>
                                                        {isCorrect ? (
                                                            <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                <span>{item.userGuesses[sIdx]}</span>
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                placeholder={`Synonym ${sIdx + 1}...`}
                                                                value={localInputs[`${item.id}-${sIdx + 1}`] || ''}
                                                                onChange={(e) => handleInputChange(`${item.id}-${sIdx + 1}`, e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleGuess(item.id, sIdx + 1)}
                                                                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white w-full focus:border-indigo-500 outline-none"
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        {item.examples && item.examples.length > 0 ? (
                                            <div className="space-y-2">
                                                {item.examples.slice(0, 2).map((ex, i) => (
                                                    <p key={i} className="text-slate-400 text-xs italic leading-relaxed">
                                                        "{ex.text}"
                                                    </p>
                                                ))}
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => generateAiExamples(item.id)}
                                                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-black uppercase tracking-widest"
                                            >
                                                Get Examples
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
