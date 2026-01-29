'use client';

import { useVocabStore } from '@/context/VocabContext';
import Link from 'next/link';
import { Plus, Play, Trash2, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function TopicList() {
    const { topics, deleteTopic, selectTopic } = useVocabStore();

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Saved Topics</h2>
                    <p className="text-slate-400">Select a topic to continue your session logic.</p>
                </div>
                <Link
                    href="/add"
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/20 hover:scale-105"
                >
                    <Plus className="w-5 h-5" />
                    Upload New
                </Link>
            </div>

            {topics.length === 0 ? (
                <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
                    <BookOpen className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-300 mb-2">No topics found</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">Upload an Excel file to start your active recall session.</p>
                    <Link
                        href="/add"
                        className="inline-block px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-all"
                    >
                        Click to Upload
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    <AnimatePresence>
                        {topics.map((topic) => (
                            <motion.div
                                key={topic.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-slate-900 border border-slate-700/50 rounded-2xl p-6 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/5 transition-all group relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xl font-bold text-white truncate mb-1 pr-4" title={topic.name}>
                                            {topic.name}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium uppercase tracking-widest">
                                            <Clock className="w-3 h-3" />
                                            {new Date(topic.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteTopic(topic.id); }}
                                        className="text-slate-600 hover:text-red-400 p-2 rounded-xl hover:bg-red-400/10 transition-all"
                                        title="Delete Topic"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-400">{topic.items.length} Vocabulary Items</span>
                                        <span className="text-indigo-400">
                                            {Math.round((topic.items.filter(i => i.status === 'mastered').length / topic.items.length) * 100)}% Mastered
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-700"
                                            style={{ width: `${(topic.items.filter(i => i.status === 'mastered').length / topic.items.length) * 100}%` }}
                                        />
                                    </div>

                                    <button
                                        onClick={() => selectTopic(topic.id)}
                                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl font-bold transition-all border border-slate-700/50"
                                    >
                                        <BookOpen className="w-4 h-4" />
                                        Review & Practice
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}
