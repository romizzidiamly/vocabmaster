'use client';

import { useVocabStore } from '@/context/VocabContext';
import { BookText, Play, X, Trophy, Volume2 } from 'lucide-react';

export function DataPreview() {
    const { gameState, setPhase, resetGame, selectTopic } = useVocabStore();

    if (gameState.items.length === 0) return null;

    const speak = (text: string) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-widest">
                    <BookText className="w-3 h-3" /> Vocabulary Review
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight">Study List</h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Review your <span className="text-red-500 font-bold">{gameState.items.length} words</span> before starting the recall test.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {gameState.items.map((item) => (
                    <div
                        key={item.id}
                        className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl hover:border-red-500/30 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h4 className="text-lg font-black text-white group-hover:text-red-500 transition-colors uppercase tracking-tight">{item.word}</h4>
                            <button
                                onClick={() => speak(item.word)}
                                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-all"
                            >
                                <Volume2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                            {item.synonyms.map((syn, idx) => (
                                <span key={idx} className="bg-slate-950 px-2 py-1 rounded-md text-[10px] font-bold text-slate-400 border border-slate-800/50">
                                    {syn}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex gap-4 p-2 bg-slate-950/80 backdrop-blur-xl border border-white/5 rounded-3xl shadow-2xl z-50">
                <button
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-slate-800"
                >
                    <X className="w-4 h-4" /> Exit
                </button>
                <button
                    onClick={() => setPhase('playing')}
                    className="flex items-center gap-3 px-10 py-3 bg-red-700 hover:bg-red-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-900/30 scale-105"
                >
                    <Play className="w-5 h-5 fill-current" /> Start Recall Test
                </button>
            </div>

            <div className="h-24" /> {/* Spacer for fixed buttons */}
        </div>
    );
}
