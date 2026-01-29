'use client';

import { useState } from 'react';
import { useVocabStore } from '@/context/VocabContext';
import { cn } from '@/lib/utils';
import { Trophy, CheckCircle2, BookText, Volume2, RotateCcw, Target, Sparkles, Wand2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        if (confirm("Reset all progress? You'll need to rediscover words! 🔄")) {
            resetTopicProgress();
        }
    };

    const discoveredItems = gameState.items.filter(i => i.status !== 'hidden');

    if (discoveredItems.length === 0) {
        return (
            <div className="w-full text-center py-20 glass rounded-[40px] border-2 border-dashed border-white/5 animate-pulse">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-primary/40" />
                </div>
                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">Unlock rows by discovering words above 🔍</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Stats Header */}
            <div className="flex flex-wrap gap-4">
                <div className="glass flex-1 min-w-[150px] p-6 rounded-[32px] border-white/5 shadow-xl flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Trophy className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Knowledge 🏆</p>
                        <p className="text-3xl font-black text-foreground tabular-nums">{gameState.score}</p>
                    </div>
                </div>
                <div className="glass flex-1 min-w-[150px] p-6 rounded-[32px] border-white/5 shadow-xl flex items-center gap-4 group">
                    <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-7 h-7 text-green-500" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Mastered ✅</p>
                        <p className="text-3xl font-black text-foreground tabular-nums">{stats.masteredCount}</p>
                    </div>
                </div>
                <div className="glass flex-1 min-w-[200px] p-6 rounded-[32px] border-white/5 shadow-xl flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                            <Target className="w-7 h-7 text-primary" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Progress 🎯</p>
                            <p className="text-3xl font-black text-foreground tabular-nums">{stats.discoveredCount}/{stats.totalCount}</p>
                        </div>
                    </div>
                    <button onClick={handleReset} className="p-3 glass-light hover:bg-red-500/20 text-red-500 rounded-2xl transition-all group/reset">
                        <RotateCcw className="w-5 h-5 group-hover/reset:-rotate-180 transition-transform duration-500" />
                    </button>
                </div>
            </div>

            <div className="glass rounded-[40px] border-white/5 shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 dark:text-slate-400">
                                <th className="px-8 py-6 border-b border-slate-200 dark:border-white/5">Vocabulary 📚</th>
                                <th className="px-8 py-6 border-b border-slate-200 dark:border-white/5">Synonyms entry ✨</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {discoveredItems.map((item) => {
                                const isMastered = item.status === 'mastered';
                                const synonym1Correct = item.userGuesses.length >= 1;
                                const synonym2Correct = item.userGuesses.length >= 2 || item.synonyms.length < 2;

                                return (
                                    <motion.tr layout key={item.id} className={cn("transition-all duration-300", isMastered ? "bg-primary/5" : "hover:bg-white/[0.02]")}>
                                        <td className="px-8 py-8 align-top">
                                            <div className="flex flex-col gap-3">
                                                <div className="flex items-center gap-3">
                                                    <span className={cn("text-2xl font-black tracking-tight", isMastered ? "text-primary" : "text-foreground")}>
                                                        {item.word}
                                                    </span>
                                                    {isMastered && <Sparkles className="w-5 h-5 text-primary animate-pulse" />}
                                                </div>
                                                <div className="flex flex-col gap-2">
                                                    {item.phonetics && typeof item.phonetics === 'object' && (
                                                        <div className="flex gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 font-serif italic mb-1">
                                                            <span>US: [{item.phonetics.us || '...'}]</span>
                                                            <span>UK: [{item.phonetics.uk || '...'}]</span>
                                                        </div>
                                                    )}
                                                    {item.phonetics && typeof item.phonetics === 'string' && (
                                                        <div className="flex gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 font-serif italic mb-1">
                                                            <span>[{item.phonetics}]</span>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <button onClick={() => speak(item.word, 'en-US')} className="flex items-center gap-2 px-3 py-1.5 glass-light hover:bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase transition-all border border-primary/10">
                                                            <Volume2 className="w-3 h-3" /> US
                                                        </button>
                                                        <button onClick={() => speak(item.word, 'en-GB')} className="flex items-center gap-2 px-3 py-1.5 glass-light hover:bg-primary/10 text-primary rounded-xl text-[10px] font-black uppercase transition-all border border-primary/10">
                                                            <Volume2 className="w-3 h-3" /> UK
                                                        </button>
                                                    </div>
                                                    {item.meaning && (
                                                        <div className="mt-2 py-2 px-3 bg-primary/5 rounded-xl border border-primary/10">
                                                            <div className="text-[9px] font-black text-primary uppercase tracking-widest mb-0.5">Arti Kata 🇮🇩</div>
                                                            <div className="text-sm font-black text-slate-800 dark:text-white leading-tight">{item.meaning}</div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 align-top">
                                            <div className="space-y-4 min-w-[300px]">
                                                {/* Synonym 1 */}
                                                <div>
                                                    <div className="text-[9px] font-black uppercase text-slate-700 dark:text-slate-500 mb-1 leading-none">Synonym 1 💪</div>
                                                    {synonym1Correct ? (
                                                        <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 animate-in zoom-in-95">
                                                            <div className="flex items-center gap-2 text-green-500 font-bold">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                <span className="text-sm">{item.userGuesses[0] || item.synonyms[0]}</span>
                                                            </div>
                                                            {item.synonymMeanings && item.synonymMeanings[0] && (
                                                                <div className="text-[9px] font-black text-green-600/70 uppercase tracking-widest pl-6">🇮🇩 {item.synonymMeanings[0]}</div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            placeholder="Type synonym..."
                                                            value={localInputs[`${item.id}-1`] || ''}
                                                            onChange={(e) => handleInputChange(`${item.id}-1`, e.target.value)}
                                                            onKeyDown={(e) => e.key === 'Enter' && handleGuess(item.id, 1)}
                                                            className="w-full bg-white/5 dark:bg-slate-800/50 border border-white/10 dark:border-white/5 rounded-xl px-4 py-2.5 text-xs text-foreground placeholder:text-slate-500 focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                        />
                                                    )}
                                                </div>
                                                {/* Synonym 2 */}
                                                {item.synonyms.length >= 2 && (
                                                    <div>
                                                        <div className="text-[9px] font-black uppercase text-slate-700 dark:text-slate-500 mb-1 leading-none">Synonym 2+ ✨</div>
                                                        {synonym2Correct ? (
                                                            <div className="flex flex-col gap-1.5 p-2.5 rounded-xl bg-green-500/10 border border-green-500/20 animate-in zoom-in-95">
                                                                <div className="flex items-center gap-2 text-green-500 font-bold">
                                                                    <CheckCircle2 className="w-4 h-4" />
                                                                    <span className="text-sm">{item.userGuesses.slice(1).join(', ') || item.synonyms.slice(1).join(', ')}</span>
                                                                </div>
                                                                {item.synonymMeanings && item.synonymMeanings.slice(1).length > 0 && (
                                                                    <div className="text-[9px] font-black text-green-600/70 uppercase tracking-widest pl-6">
                                                                        🇮🇩 {item.synonymMeanings.slice(1).join(', ')}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                placeholder="Type synonym..."
                                                                value={localInputs[`${item.id}-2`] || ''}
                                                                onChange={(e) => handleInputChange(`${item.id}-2`, e.target.value)}
                                                                onKeyDown={(e) => e.key === 'Enter' && handleGuess(item.id, 2)}
                                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                                                            />
                                                        )}
                                                    </div>
                                                )}

                                                {/* Action Button: Regeneration moved here if needed or removed */}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
