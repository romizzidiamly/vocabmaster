'use client';

import { useVocabStore } from '@/context/VocabContext';
import Link from 'next/link';
import { Plus, Play, Trash2, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopicList() {
    const { topics, deleteTopic, selectTopic } = useVocabStore();

    return (
        <div className="w-full max-w-5xl mx-auto">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16 space-y-6"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light border border-white/10 text-xs font-black text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-top-4 duration-1000">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                    </span>
                    Luxury Vocabulary Mastery
                </div>
                <h2 className="text-5xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                    Transform Knowledge with <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-red-400 to-red-600 bg-[length:200%_auto] animate-pulse">Active Recall.</span>
                </h2>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                    Empower your vocabulary with AI-driven active recall and business-ready examples.
                </p>
                <div className="pt-4">
                    <Link
                        href="/add"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-red-700 hover:bg-red-600 text-white rounded-2xl font-black transition-all shadow-[0_0_40px_rgba(177,18,38,0.3)] hover:scale-105 active:scale-95 group"
                    >
                        <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                        Upload Vocabulary
                    </Link>
                </div>
            </motion.div>

            <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-6">
                <div>
                    <h3 className="text-2xl font-black text-white">Project Library</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Select a module to start practicing</p>
                </div>
                <div className="text-xs font-black text-slate-400 uppercase tracking-widest bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                    {topics.length} {topics.length === 1 ? 'Topic' : 'Topics'}
                </div>
            </div>

            {topics.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-24 glass rounded-[40px] border border-dashed border-white/10"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-red-900/20 to-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                        <BookOpen className="w-10 h-10 text-red-600/50" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-3">No Data Modules</h3>
                    <p className="text-slate-500 mb-10 max-w-sm mx-auto font-medium">Your vocabulary vault is secure but empty. Upload your first dataset to begin.</p>
                    <Link
                        href="/add"
                        className="inline-flex items-center gap-2 px-8 py-4 glass-light hover:bg-white/5 text-white rounded-2xl font-black transition-all border border-white/10"
                    >
                        Initialize Module
                    </Link>
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
                                    className="glass rounded-[32px] p-8 hover:border-red-500/30 transition-all group relative cursor-default overflow-hidden"
                                >
                                    {/* Glass Glow Effect */}
                                    <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/5 blur-[60px] group-hover:bg-red-600/10 transition-all duration-700" />

                                    <div className="flex justify-between items-start mb-8">
                                        <div className="max-w-[80%]">
                                            <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">
                                                <Clock className="w-3 h-3" />
                                                {new Date(topic.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                            <h3 className="text-2xl font-black text-white truncate group-hover:text-red-500 transition-colors" title={topic.name}>
                                                {topic.name}
                                            </h3>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}
                                            className="text-slate-600 hover:text-red-400 p-2.5 rounded-2xl glass-light hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
                                            title="Delete Topic"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-end">
                                            <div className="space-y-1">
                                                <span className="text-3xl font-black text-white leading-none">{topic.items.length}</span>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Vocabulary items</p>
                                            </div>
                                            <div className="text-right space-y-1">
                                                <span className="text-xl font-black text-red-500 leading-none">{percentage}%</span>
                                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mastery</p>
                                            </div>
                                        </div>

                                        <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percentage}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-red-500 to-red-800 shadow-[0_0_15px_rgba(177,18,38,0.5)]"
                                            />
                                        </div>

                                        <button
                                            onClick={() => selectTopic(topic.id)}
                                            className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-red-700 text-white rounded-2xl font-black transition-all border border-white/10 hover:border-red-500/50 shadow-xl group/btn overflow-hidden relative"
                                        >
                                            <span className="relative z-10 flex items-center gap-2">
                                                <BookOpen className="w-4 h-4" />
                                                Start Practice
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                                        </button>
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
