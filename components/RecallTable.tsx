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
                                <th className="px-8 py-6 border-b border-slate-200 dark:border-white/5 max-w-md">IELTS examples 💡</th>
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
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 align-top">
                                            <div className="space-y-4 min-w-[200px]">
                                                {/* Synonym 1 */}
                                                <div>
                                                    <div className="text-[9px] font-black uppercase text-slate-700 dark:text-slate-500 mb-1 leading-none">Synonym 1 💪</div>
                                                    {synonym1Correct ? (
                                                        <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 animate-in zoom-in-95">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            <span className="text-sm">{item.userGuesses[0] || item.synonyms[0]}</span>
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
                                                            <div className="flex items-center gap-2 text-green-500 font-bold bg-green-500/10 p-2.5 rounded-xl border border-green-500/20 animate-in zoom-in-95">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                                <span className="text-sm">{item.userGuesses.slice(1).join(', ') || item.synonyms.slice(1).join(', ')}</span>
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
                                            </div>
                                        </td>
                                        <td className="px-8 py-8 align-top">
                                            {item.examples ? (
                                                <div className="grid gap-3">
                                                    {item.examples.map((ex, i) => (
                                                        <div key={i} className="glass-light border-white/5 p-4 rounded-2xl relative group/ex overflow-hidden">
                                                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-30 group-hover/ex:opacity-100 transition-opacity" />
                                                            <span className="text-[9px] font-black uppercase text-primary tracking-widest block mb-2">{ex.type} Example</span>
                                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-400 italic leading-relaxed">&ldquo;{ex.text}&rdquo;</p>
                                                        </div>
                                                    ))}
                                                    <button onClick={() => generateAiExamples(item.id)} className="w-full flex items-center justify-center gap-2 py-3 glass-light border border-primary/20 hover:border-primary/50 text-primary rounded-xl text-[10px] font-black uppercase transition-all group/ai">
                                                        <Wand2 className="w-3.5 h-3.5 group-hover/ai:rotate-12 transition-transform" /> Regenerate AI Magic ✨
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-6 glass-light rounded-3xl border border-dashed border-white/10 group">
                                                    <Wand2 className="w-8 h-8 text-primary/20 mb-3 group-hover:scale-110 transition-transform" />
                                                    <button onClick={() => generateAiExamples(item.id)} className="px-6 py-2.5 bg-primary hover:bg-accent text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-xl transition-all active:scale-95">
                                                        Generate Magic Examples ✨
                                                    </button>
                                                </div>
                                            )}
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
