'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { useVocabStore } from '@/context/VocabContext';
import { cn } from '@/lib/utils';

export function GameInterface() {
    const { gameState, markDiscovered } = useVocabStore();
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Focus input
    useEffect(() => {
        inputRef.current?.focus();
    }, [feedback]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cleanInput = input.trim().toLowerCase();
        if (!cleanInput) return;

        // Word Discovery Only
        const found = gameState.items.find(
            item => item.word.toLowerCase() === cleanInput
        );

        if (found) {
            if (found.status !== 'hidden') {
                setFeedback({ type: 'info', message: `"${found.word}" is already revealed.` });
                setInput('');
                return;
            }

            markDiscovered(found.id);
            setFeedback({ type: 'success', message: `Discovered: "${found.word}"! Clear to next.` });
            setInput(''); // CLEAR IMMEDIATELY as requested

            // Auto-clear success feedback
            setTimeout(() => setFeedback(null), 1500);
        } else {
            setFeedback({ type: 'error', message: 'Word not found. Try another spelling!' });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12">
            <div className="relative z-10">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-red-900/10 rounded-2xl blur-3xl opacity-50" />
                <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-8 shadow-2xl relative">

                    <form onSubmit={handleSubmit} className="relative">
                        <div className="flex justify-between items-center mb-6">
                            <label className="block text-xs font-black uppercase tracking-[0.3em] text-slate-500 ml-1">
                                Word Discovery
                            </label>
                        </div>

                        <div className="relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className={cn(
                                    "w-full bg-slate-950 border-2 rounded-2xl px-8 py-6 text-3xl text-white placeholder:text-slate-800 focus:outline-none focus:ring-4 transition-all shadow-inner",
                                    feedback?.type === 'error' ? "border-red-500/50 focus:ring-red-500/10" :
                                        feedback?.type === 'success' ? "border-green-500/50 focus:ring-green-500/10" :
                                            "border-slate-800 focus:ring-red-600/10"
                                )}
                                placeholder="Recall a word..."
                                autoComplete="off"
                            />
                            <button
                                type="submit"
                                className="absolute right-4 top-4 bottom-4 aspect-square bg-red-700 hover:bg-red-600 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-20 shadow-lg shadow-red-900/30 group active:scale-95"
                                disabled={!input.trim()}
                            >
                                <Send className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                            </button>
                        </div>

                        {/* Feedback Toast */}
                        {feedback && (
                            <div className={cn(
                                "mt-6 p-4 rounded-2xl text-sm font-black flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border",
                                feedback.type === 'success' ? "bg-green-500/10 text-green-500 border-green-500/20" :
                                    feedback.type === 'error' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                            )}>
                                {feedback.type === 'success' && <CheckCircle2 className="w-5 h-5 animate-bounce" />}
                                {feedback.message}
                            </div>
                        )}
                    </form>

                </div>
            </div>
        </div>
    );
}
