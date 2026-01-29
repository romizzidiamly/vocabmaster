'use client';

import { useVocabStore } from '@/context/VocabContext';
import Link from 'next/link';
import { Plus, Play, Trash2, BookOpen, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';

export function TopicList() {
    const { topics, deleteTopic, selectTopic } = useVocabStore();
    const { theme } = useTheme();
    const { isAdmin } = useAuth();

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-white/10 text-xs font-black text-primary uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    {theme === 'vibrant' ? '🚀 Supercharge Your Brain 🚀' : 'Professional Vocabulary Mastery ✨'}
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-foreground tracking-tight leading-[1.1]">
                    Unlock Your Potential <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-pulse">
                        {theme === 'vibrant' ? 'Level Up Now! 💎' : 'Active Recall. 🧠'}
                    </span>
                </h2>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    The ultimate vocabulary toolkit for ambitious learners. <br className="hidden sm:block" />
                    Built for business masters and language legends. 🏆
                </p>
            </motion.div>

            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-2xl font-black text-foreground flex items-center gap-2">
                        Project Library 📚
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium mt-1">Ready to crush another session? 💪</p>
                </div>
                <div className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                    {topics.length} {topics.length === 1 ? 'Module' : 'Modules'} 📦
                </div>
            </div>

            {topics.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 glass rounded-[40px] border border-dashed border-white/10"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-float">
                        <BookOpen className="w-10 h-10 text-primary/50" />
                    </div>
                    <h3 className="text-2xl font-black text-foreground mb-3">Vault is Locked 🏜️</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-10 max-w-sm mx-auto font-medium">No vocabulary detected yet. Only the Admin can initialize new modules. 🏁</p>
                    {!isAdmin && (
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 px-8 py-4 glass-light hover:bg-white/5 text-foreground rounded-2xl font-black transition-all border border-white/10"
                        >
                            Become Admin 🔑
                        </Link>
                    )}
                </motion.div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                    <AnimatePresence>
                        {topics.map((topic) => {
                            const masteredCount = topic.items.filter(i => i.status === 'mastered').length;
                            const percentage = Math.round((masteredCount / topic.items.length) * 100);

                            return (
                                <motion.div
                                    key={topic.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="glass rounded-[32px] p-8 hover:border-primary/50 transition-all group relative cursor-default overflow-hidden"
                                >
                                    {/* Glass Glow Effect */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[60px] group-hover:bg-primary/20 transition-all duration-700" />

                                    <div className="flex justify-between items-start mb-8">
                                        <div className="max-w-[80%]">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest mb-2 text-primary/80">
                                                <Clock className="w-3 h-3" />
                                                Created {new Date(topic.createdAt).toLocaleDateString()} 📅
                                            </div>
                                            <h3 className="text-2xl font-black text-foreground truncate group-hover:text-primary transition-colors pr-4" title={topic.name}>
                                                {topic.name}
                                            </h3>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between text-xs font-bold">
                                            <span className="text-slate-600 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
                                                <BookOpen className="w-4 h-4" /> Mastery Level
                                            </span>
                                            <span className="text-primary font-black">{percentage}%</span>
                                        </div>

                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-primary via-accent to-primary shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]"
                                            />
                                        </div>

                                        <div className="flex items-center justify-between pt-2">
                                            <div className="flex -space-x-2">
                                                {[...Array(3)].map((_, i) => (
                                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                        {i === 2 ? `+${topic.items.length - 2}` : '📖'}
                                                    </div>
                                                ))}
                                            </div>

                                            <button
                                                onClick={() => selectTopic(topic.id)}
                                                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-accent text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg group/btn"
                                            >
                                                <span>Practice Now</span>
                                                <Zap className="w-4 h-4 fill-current group-hover/btn:animate-pulse" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
