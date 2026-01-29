'use client';

import { UploadZone } from '@/components/UploadZone';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AddTopicPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 flex items-center gap-6">
                    <Link
                        href="/"
                        className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-2xl transition-all text-slate-400 hover:text-white group"
                    >
                        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-black text-white">New Topic</h1>
                        <p className="text-slate-500">Upload your material to get started.</p>
                    </div>
                </header>

                <main className="animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <UploadZone />
                </main>
            </div>
        </div>
    );
}
