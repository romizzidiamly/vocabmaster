'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, Zap, Sparkles, XCircle } from 'lucide-react';
import { useVocabStore } from '@/context/VocabContext';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function GameInterface() {
    const { gameState, markDiscovered, topics } = useVocabStore();
    const { theme } = useTheme();
    const [input, setInput] = useState('');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const activeTopic = topics.find(t => t.id === gameState.activeTopicId);

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
                setFeedback({ type: 'info', message: `"${found.word}" is already revealed! 👀` });
                setInput('');
                return;
            }

            markDiscovered(found.id);
            setFeedback({ type: 'success', message: `Discovered: "${found.word}"! Amazing! 🔥` });
            setInput('');

            // Auto-clear success feedback
            setTimeout(() => setFeedback(null), 2000);
        } else {
            setFeedback({ type: 'error', message: 'Word not found. Try again! 🤔' });
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto mb-12 relative group">
            {/* Topic Header */}
            <div className="text-center mb-6">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mb-2">Active Challenge</p>
                <h3 className="text-2xl font-black text-foreground tracking-tighter uppercase">{activeTopic?.name || "RECALL SEQUENCE"}</h3>
            </div>

            {/* Background Aura */}
            <div className="absolute -inset-8 bg-primary/10 blur-[60px] rounded-[100px] -z-10 group-hover:bg-primary/15 transition-all duration-700" />

            <div className="glass rounded-[40px] p-2 shadow-2xl overflow-hidden relative border-white/10">
                <form onSubmit={handleSubmit} className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className={cn(
                            "w-full bg-transparent border-none rounded-[32px] px-8 py-7 text-2xl sm:text-3xl font-black text-foreground placeholder:text-slate-600 focus:outline-none transition-all caret-primary",
                            gameState.items.every(i => i.status !== 'hidden') && "opacity-50 cursor-not-allowed"
                        )}
                        placeholder={gameState.items.every(i => i.status !== 'hidden') ? "All words found! 👑" : "Type a word to recall... ⌨️"}
                        autoComplete="off"
                        disabled={gameState.items.every(i => i.status !== 'hidden')}
                    />

                    <button
                        type="submit"
                        disabled={!input.trim() || gameState.items.every(i => i.status !== 'hidden')}
                        className="absolute right-2 top-2 bottom-2 px-8 bg-primary hover:bg-accent text-white rounded-[28px] font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl hover:scale-[1.02] active:scale-95 disabled:opacity-30 disabled:hover:scale-100 group/btn"
                    >
                        <div className="relative z-10 flex items-center gap-2">
                            Reveal <Zap className="w-4 h-4 fill-current group-hover/btn:animate-pulse" />
                        </div>
                        <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                </form>
            </div>

            {/* Feedback Toast */}
            <AnimatePresence mode="wait">
                {feedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className={cn(
                            "mt-6 p-5 rounded-[24px] text-sm font-black flex items-center justify-between border shadow-xl glass",
                            feedback.type === 'success' ? "border-green-500/30 text-green-500 bg-green-500/5" :
                                feedback.type === 'error' ? "border-primary/30 text-primary bg-primary/5" :
                                    "border-blue-500/30 text-blue-500 bg-blue-500/5"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center shadow-lg",
                                feedback.type === 'success' ? "bg-green-500 text-white" :
                                    feedback.type === 'error' ? "bg-primary text-white" :
                                        "bg-blue-500 text-white"
                            )}>
                                {feedback.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> :
                                    feedback.type === 'error' ? <XCircle className="w-5 h-5" /> :
                                        <Sparkles className="w-5 h-5" />}
                            </div>
                            <span className="text-base tracking-tight">{feedback.message}</span>
                        </div>
                        <div className="flex gap-1 h-1.5 w-12 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: feedback.type === 'success' ? 2 : 5 }}
                                className={cn("h-full",
                                    feedback.type === 'success' ? "bg-green-500" :
                                        feedback.type === 'error' ? "bg-primary" : "bg-blue-400"
                                )}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
