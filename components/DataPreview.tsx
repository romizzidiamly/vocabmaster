'use client';

import { useVocabStore } from '@/context/VocabContext';
import { BookText, Play, X, Volume2, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.05
        }
    }
} as const;

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 15
        }
    }
} as const;

export function DataPreview() {
    const { gameState, setPhase, resetGame, topics } = useVocabStore();
    const { theme } = useTheme();

    const activeTopic = topics.find(t => t.id === gameState.activeTopicId);

    if (gameState.items.length === 0) return null;

    const speak = (text: string, voice: 'en-US' | 'en-GB') => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = voice;
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-12 pb-32">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-xs font-black uppercase tracking-[0.3em] shadow-lg shadow-primary/5">
                    <BookText className="w-3.5 h-3.5" /> Discovery Mode Activated
                </div>
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] leading-none mb-2">Subject Matter</p>
                    <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tighter leading-none uppercase">
                        {activeTopic?.name || "KNOWLEDGE PREPARATION"}
                    </h2>
                </div>
                <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg leading-relaxed">
                    Verify your <span className="text-primary font-black px-2 py-0.5 bg-primary/5 rounded-lg">{gameState.items.length} targets</span>.
                    Absorb the definitions before the recall sequence begins. 🧠✨
                </p>
            </motion.div>

            {/* Knowledge Grid - 2 Columns */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
                {gameState.items.map((item, idx) => (
                    <motion.div
                        key={item.id}
                        variants={itemVariants}
                        className="group relative"
                    >
                        {/* Card */}
                        <div className="h-full bg-white/[0.02] dark:bg-slate-900/40 hover:bg-white/[0.04] border border-white/5 dark:border-white/10 hover:border-primary/30 p-6 rounded-[32px] transition-all duration-500 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/5 blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />

                            <div className="relative z-10 space-y-6">
                                {/* Top Section: Word + Audio */}
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/50" /> Target {idx + 1}
                                        </div>
                                        <h4 className="text-4xl font-black text-foreground group-hover:text-primary transition-colors tracking-tighter uppercase leading-none">
                                            {item.word}
                                        </h4>

                                    </div>

                                    {/* Audio Buttons */}
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => speak(item.word, 'en-US')} className="px-3 py-1.5 flex items-center gap-2 bg-white/5 hover:bg-primary text-slate-400 hover:text-white rounded-xl transition-all shadow-xl active:scale-95 border border-white/5">
                                            <span className="text-[10px] font-black">🇺🇸</span>
                                            <Volume2 className="w-3.5 h-3.5" />
                                        </button>
                                        <button onClick={() => speak(item.word, 'en-GB')} className="px-3 py-1.5 flex items-center gap-2 bg-white/5 hover:bg-primary text-slate-400 hover:text-white rounded-xl transition-all shadow-xl active:scale-95 border border-white/5">
                                            <span className="text-[10px] font-black">🇬🇧</span>
                                            <Volume2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Synonyms */}
                                <div className="space-y-3">
                                    <p className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-[0.2em] leading-none flex items-center gap-2">
                                        <Zap size={14} className="text-primary" /> Accepted Synonyms
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {item.synonyms.map((syn, idx) => (
                                            <span key={idx} className="bg-slate-900 dark:bg-primary text-white border border-white/20 px-4 py-1.5 rounded-xl text-xs font-black shadow-xl shadow-primary/30 transition-all cursor-default scale-100 hover:scale-105">
                                                {syn}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Floating Command Tray */}
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-3 p-3 glass-light border border-white/10 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 backdrop-blur-2xl"
            >
                <button onClick={resetGame} className="flex items-center gap-3 px-8 py-4 bg-white/5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-[22px] font-black text-xs uppercase tracking-widest transition-all border border-white/5 group">
                    <X className="w-4 h-4 group-hover:-rotate-90 transition-transform" />
                    <span>Abort System</span>
                </button>
                <div className="w-px h-8 bg-white/10 mx-2" />
                <button onClick={() => setPhase('playing')} className="flex items-center gap-4 px-12 py-4 bg-primary hover:bg-accent text-white rounded-[22px] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)] hover:scale-105 active:scale-95 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/10 -translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    <span className="relative z-10 flex items-center gap-3">
                        Initiate Recall <Play className="w-5 h-5 fill-current" />
                    </span>
                </button>
            </motion.div>
        </div>
    );
}
