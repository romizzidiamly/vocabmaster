'use client';

import { useState, useCallback } from 'react';
import { FileText, Loader2, Save, X, Plus, CheckCircle2 } from 'lucide-react';
import { useVocabStore } from '@/context/VocabContext';
import { parseExcel } from '@/lib/excel-parser';
import { cn } from '@/lib/utils';
import { VocabItem } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

export function UploadZone({ onComplete }: { onComplete?: () => void }) {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingItems, setPendingItems] = useState<VocabItem[] | null>(null);
    const [topicName, setTopicName] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const { addTopic } = useVocabStore();

    const handleFile = useCallback(async (file: File) => {
        setIsProcessing(true);
        setError(null);

        try {
            let items: VocabItem[] = [];

            if (
                file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                file.type === 'application/vnd.ms-excel'
            ) {
                items = await parseExcel(file);
            } else {
                setError('Invalid file format. Please use Excel (.xlsx or .xls). 🛑');
                setIsProcessing(false);
                return;
            }

            if (items.length === 0) {
                setError('No vocabulary data found in the file. 🏜️');
            } else {
                setPendingItems(items);
                const baseName = file.name.replace(/\.[^/.]+$/, "");
                setTopicName(baseName.toUpperCase().replace(/[-_]/g, ' '));
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to read the file. ❌');
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleSave = () => {
        if (!topicName.trim()) {
            setError("Please enter a topic name. ✍️");
            return;
        }
        if (pendingItems) {
            addTopic(topicName.trim(), pendingItems);
            setIsSuccess(true);
            setTimeout(() => {
                if (onComplete) onComplete();
            }, 1500);
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    if (isSuccess) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center"
            >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-2xl shadow-green-500/20">
                    <CheckCircle2 className="w-10 h-10 text-green-500 animate-bounce" />
                </div>
                <h3 className="text-3xl font-black text-white mb-2">Import Successful! 🎉</h3>
                <p className="text-slate-500 font-medium">New module has been added to your library.</p>
            </motion.div>
        );
    }

    if (pendingItems) {
        return (
            <div className="w-full max-w-xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <div className="text-center">
                    <div className="inline-block p-4 bg-primary/10 rounded-2xl mb-4 border border-primary/20">
                        <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-3xl font-black text-white">Confirm Module</h3>
                    <p className="text-slate-500 mt-2 font-medium">Give a name to this vocabulary collection.</p>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 mb-3 ml-1">
                            Module Title
                        </label>
                        <input
                            type="text"
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value.toUpperCase())}
                            placeholder="e.g. MEDICAL VOCABULARY"
                            className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[22px] px-6 py-5 text-xl text-white font-black focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all shadow-2xl"
                            autoFocus
                        />
                        <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-500 pl-1 uppercase tracking-widest">
                            <Database size={12} /> {pendingItems.length} Vocabulary entries detected
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setPendingItems(null)}
                            className="flex-1 px-8 py-5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-all border border-white/5 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-[2] px-8 py-5 bg-primary hover:bg-accent text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group"
                        >
                            <Save className="w-4 h-4 group-hover:scale-125 transition-transform" /> Save Module
                        </button>
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-2xl text-center text-[10px] uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={onDrop}
                className={cn(
                    "relative flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-[40px] transition-all duration-500",
                    isDragOver
                        ? "border-primary bg-primary/10 scale-[1.02] shadow-2xl shadow-primary/10"
                        : "border-white/5 bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04] shadow-2xl",
                    isProcessing && "opacity-50 pointer-events-none"
                )}
            >
                <div className="bg-white/5 p-8 rounded-[32px] mb-8 shadow-2xl border border-white/5 text-primary group-hover:scale-110 transition-transform duration-500">
                    {isProcessing ? (
                        <Loader2 className="w-12 h-12 animate-spin" />
                    ) : (
                        <Plus className="w-12 h-12" />
                    )}
                </div>

                <div className="text-center mb-12">
                    <h3 className="text-3xl font-black mb-3 text-white tracking-tighter">
                        {isProcessing ? 'Analyzing Data...' : 'Ready to Import?'}
                    </h3>
                    <p className="text-slate-500 font-medium max-w-xs mx-auto leading-relaxed">
                        Drag & drop your Excel file here or click the button below.
                    </p>
                </div>

                <label className="cursor-pointer group/btn">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <span className="px-14 py-6 bg-primary hover:bg-accent text-white rounded-[22px] font-black text-xs uppercase tracking-[0.3em] transition-all shadow-2xl shadow-primary/20 active:scale-95 flex items-center gap-4">
                        <FileText className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" /> CHOOSE EXCEL FILE
                    </span>
                </label>

                {error && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-10 p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-black rounded-2xl text-center text-[10px] uppercase tracking-widest">
                        {error}
                    </motion.div>
                )}

                <div className="mt-12 flex items-center gap-3 text-slate-600">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Supports .XLSX & .XLS</span>
                </div>
            </div>
        </div>
    );
}

import { Database } from 'lucide-react';
