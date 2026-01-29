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
        <div className="w-full max-w-6xl mx-auto overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Top Progress Info Bar */}
            <div className="bg-slate-950/80 backdrop-blur-sm p-6 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <p className="text-slate-500 text-xs font-black uppercase tracking-widest text-center sm:text-left">
                        Fill in both synonyms for total mastery. Press <kbd className="px-2 py-1 bg-slate-900 rounded-lg text-[10px] text-slate-300 border border-slate-700 font-mono">ENTER</kbd>
                    </p>
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20"
                    >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset Session
                    </button>
                </div>
                <div className="flex items-center gap-6 bg-slate-900 px-6 py-2 rounded-2xl border border-slate-700/50">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_rgba(177,18,38,0.5)]" />
                        <span className="text-white font-black">{stats.discoveredCount}</span>
                        <span className="text-slate-600 text-[10px] font-black uppercase">Revealed</span>
                    </div>
                    <div className="w-px h-4 bg-slate-800" />
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                        <span className="text-white font-black">{stats.masteredCount}</span>
                        <span className="text-slate-600 text-[10px] font-black uppercase">Mastered</span>
                    </div>
                    <div className="w-px h-4 bg-slate-800" />
                    <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-black">{stats.totalCount}</span>
                        <span className="text-slate-600 text-[10px] font-black uppercase">Goal</span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                            <th className="px-6 py-4 border-b border-slate-800 w-12 text-center">#</th>
                            <th className="px-6 py-4 border-b border-slate-800 w-40">Vocabulary</th>
                            <th className="px-6 py-4 border-b border-slate-800 w-44">Synonyms Entry</th>
                            <th className="px-6 py-4 border-b border-slate-800">IELTS Task 2 Examples (Simple / Complex / Compound / Compound-Complex)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {discoveredItems.map((item, index) => {
                            const isMastered = item.status === 'mastered';
                            const synonym1Correct = item.userGuesses.length >= 1;
                            const synonym2Correct = item.userGuesses.length >= 2 || item.synonyms.length < 2;

                            return (
                                <tr key={item.id} className={cn(
                                    "transition-all duration-300",
                                    isMastered ? "bg-emerald-500/5" : "hover:bg-slate-800/30"
                                )}>
                                    <td className="px-6 py-8 text-slate-700 font-mono italic text-xs text-center align-top">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-8 align-top">
                                        <div className="flex flex-col gap-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-black text-xl text-white tracking-tight">{item.word}</span>
                                                {isMastered && (
                                                    <div className="bg-emerald-500/10 p-0.5 rounded">
                                                        <Trophy className="w-4 h-4 text-emerald-500" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Phonetic Symbols */}
                                            {item.phonetics && (
                                                <div className="flex gap-4 text-[10px] font-mono text-slate-500">
                                                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">🇺🇸 {item.phonetics.us}</span>
                                                    <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800">🇬🇧 {item.phonetics.uk}</span>
                                                </div>
                                            )}

                                            {/* Pronunciation Buttons */}
                                            <div className="flex items-center gap-2 mt-1">
                                                <button
                                                    onClick={() => speak(item.word, 'en-US')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-red-500 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-slate-700/50"
                                                    title="American Pronunciation"
                                                >
                                                    <Volume2 className="w-3.5 h-3.5" /> US
                                                </button>
                                                <button
                                                    onClick={() => speak(item.word, 'en-GB')}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-red-700 hover:text-white rounded-lg transition-all text-[10px] font-black uppercase tracking-widest border border-slate-700/50"
                                                    title="British Pronunciation"
                                                >
                                                    <Volume2 className="w-3.5 h-3.5" /> UK
                                                </button>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Synonyms Single Column Column */}
                                    <td className="px-6 py-8 align-top">
                                        <div className="space-y-4">
                                            <div>
                                                <div className="text-[9px] font-black uppercase text-slate-600 mb-1">Synonym 1</div>
                                                {synonym1Correct ? (
                                                    <div className="flex items-center gap-2 text-green-400 font-bold animate-in fade-in duration-500">
                                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                                        <span className="text-sm">{item.userGuesses[0] || item.synonyms[0]}</span>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        placeholder="..."
                                                        value={localInputs[`${item.id}-1`] || ''}
                                                        onChange={(e) => handleInputChange(`${item.id}-1`, e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleGuess(item.id, 1);
                                                        }}
                                                        className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white w-full focus:border-red-600 transition-all shadow-inner"
                                                    />
                                                )}
                                            </div>

                                            {item.synonyms.length >= 2 && (
                                                <div>
                                                    <div className="text-[9px] font-black uppercase text-slate-600 mb-1">Synonym 2+</div>
                                                    {synonym2Correct ? (
                                                        <div className="flex items-center gap-2 text-emerald-400 font-bold animate-in fade-in duration-500">
                                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                                            <span className="text-sm">
                                                                {item.userGuesses.slice(1).join(', ') || item.synonyms.slice(1).join(', ')}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            placeholder="..."
                                                            value={localInputs[`${item.id}-2`] || ''}
                                                            onChange={(e) => handleInputChange(`${item.id}-2`, e.target.value)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') handleGuess(item.id, 2);
                                                            }}
                                                            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white w-full focus:border-red-600 transition-all shadow-inner"
                                                        />
                                                    )}

                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    {/* Detailed IELTS Examples Column */}
                                    <td className="px-6 py-8">
                                        {item.examples ? (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-700">
                                                    {item.examples.map((ex, i) => (
                                                        <div key={i} className="bg-slate-950/40 border border-slate-800/50 rounded-xl p-3 hover:border-slate-700 transition-colors group/ex">
                                                            <div className="flex items-center gap-2 mb-1.5">
                                                                <BookText className="w-3 h-3 text-red-500 group-hover/ex:rotate-12 transition-transform" />
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-red-400">{ex.type}</span>
                                                            </div>
                                                            <p className="text-slate-400 text-xs leading-relaxed italic">
                                                                {ex.text}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="flex justify-end">
                                                    <button
                                                        onClick={() => generateAiExamples(item.id)}
                                                        className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border border-slate-700/50 group"
                                                    >
                                                        <RefreshCcw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                                                        Re-generate with Groq
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 border border-dashed border-slate-800 rounded-2xl bg-slate-950/20 group">
                                                <div className="relative mb-4">
                                                    <Wand2 className="w-8 h-8 text-red-600/30 animate-pulse" />
                                                    <Loader2 className="w-5 h-5 text-red-500 animate-spin absolute -top-1 -right-1" />
                                                </div>
                                                <button
                                                    onClick={() => generateAiExamples(item.id)}
                                                    className="px-6 py-2.5 bg-red-700 hover:bg-red-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-red-900/40 transition-all active:scale-95 flex items-center gap-2"
                                                >
                                                    <Wand2 className="w-4 h-4" />
                                                    Generate Examples
                                                </button>
                                            </div>

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
