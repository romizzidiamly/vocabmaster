'use client';

import { useState, useCallback } from 'react';
import { FileText, Loader2, Save, X, Plus } from 'lucide-react';
import { useVocabStore } from '@/context/VocabContext';
import { parseExcel } from '@/lib/excel-parser';
import { cn } from '@/lib/utils';
import { VocabItem } from '@/types';
import { useRouter } from 'next/navigation';

export function UploadZone() {
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pendingItems, setPendingItems] = useState<VocabItem[] | null>(null);
    const [topicName, setTopicName] = useState('');

    const { addTopic } = useVocabStore();
    const router = useRouter();

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
                setError('Please upload a valid Excel (.xlsx or .xls) file.');
                setIsProcessing(false);
                return;
            }

            if (items.length === 0) {
                setError('No vocabulary found.');
            } else {
                setPendingItems(items);
                // Default name suggestion from filename
                const baseName = file.name.replace(/\.[^/.]+$/, "");
                setTopicName(baseName.split(/[-_ ]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Failed to parse file.');
        } finally {
            setIsProcessing(false);
        }
    }, []);

    const handleSave = () => {
        if (!topicName.trim()) {
            setError("Please enter a topic name.");
            return;
        }
        if (pendingItems) {
            console.log("Saving topic and redirecting...");
            addTopic(topicName.trim(), pendingItems);
            router.push('/');
        }
    };

    const onDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files?.[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [handleFile]);

    if (pendingItems) {
        return (
            <div className="w-full max-w-xl mx-auto bg-slate-900 border border-slate-700 rounded-3xl p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <h3 className="text-2xl font-black mb-6 text-white text-center">Name Your Topic</h3>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2 ml-1">
                            Topic Title
                        </label>
                        <input
                            type="text"
                            value={topicName}
                            onChange={(e) => setTopicName(e.target.value)}
                            placeholder="e.g., Medical Vocabulary"
                            className="w-full bg-slate-950 border-2 border-slate-800 rounded-2xl px-6 py-4 text-xl text-white focus:outline-none focus:border-indigo-500 transition-all shadow-inner"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => setPendingItems(null)}
                            className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            <X className="w-5 h-5" /> Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="flex-3 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" /> Save Topic
                        </button>
                    </div>
                </div>

                {error && (
                    <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-2xl text-center text-sm">
                        {error}
                    </div>
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
                    "relative flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-3xl transition-all duration-300",
                    isDragOver
                        ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
                        : "border-slate-700 bg-slate-950/50 hover:border-slate-600 hover:bg-slate-900 border-slate-800 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]",
                    isProcessing && "opacity-50 pointer-events-none"
                )}
            >
                <div className="bg-slate-900 p-6 rounded-2xl mb-4 shadow-xl border border-slate-800">
                    {isProcessing ? (
                        <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
                    ) : (
                        <FileText className="w-10 h-10 text-indigo-400" />
                    )}
                </div>

                <h3 className="text-2xl font-black mb-2 text-center text-white italic tracking-tight">
                    {isProcessing ? 'Analyzing Excel...' : 'Ready for New Vocabulary?'}
                </h3>
                <p className="text-slate-500 text-center mb-10 max-w-xs font-medium leading-relaxed">
                    Drag and drop your Excel file here. You can name your topic in the next step.
                </p>

                <label className="cursor-pointer">
                    <input
                        type="file"
                        accept=".xlsx, .xls"
                        className="hidden"
                        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                    />
                    <span className="px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3">
                        <Plus className="w-6 h-6 border-2 rounded-lg" /> CHOOSE FILE
                    </span>
                </label>

                {error && (
                    <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-500 font-bold rounded-2xl text-center">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
}
