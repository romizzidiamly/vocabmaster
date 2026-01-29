'use client';

import { useState, useEffect } from 'react';
import { useVocabStore } from '@/context/VocabContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { UploadZone } from '@/components/UploadZone';
import {
    Trash2, Plus, BookOpen, Clock, ArrowLeft,
    ShieldCheck, Zap, LayoutDashboard, Database,
    Settings, LogOut, Search, Edit3, Check, X,
    BarChart3, Hash, Award, ChevronRight, Save,
    PlusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Topic, VocabItem } from '@/types';

type DashboardView = 'overview' | 'modules' | 'settings' | 'detailed-edit' | 'import';

export default function AdminDashboard() {
    const { topics, deleteTopic, updateTopic } = useVocabStore();
    const { isAdmin, logout } = useAuth();
    const router = useRouter();

    // View Management
    const [activeView, setActiveView] = useState<DashboardView>('overview');
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);

    // Search/Filter
    const [searchQuery, setSearchQuery] = useState('');

    // Topic Rename State
    const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
    const [editTopicName, setEditTopicName] = useState('');

    // Detailed Item Editor State
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editWord, setEditWord] = useState('');
    const [editSynonyms, setEditSynonyms] = useState('');

    // New Item State
    const [showNewItemForm, setShowNewItemForm] = useState(false);
    const [newWord, setNewWord] = useState('');
    const [newSynonyms, setNewSynonyms] = useState('');

    useEffect(() => {
        if (!isAdmin) {
            router.push('/login');
        }
    }, [isAdmin, router]);

    if (!isAdmin) return null;

    const selectedTopic = topics.find(t => t.id === selectedTopicId);

    // Stats
    const totalWords = topics.reduce((acc, t) => acc + t.items.length, 0);
    const globalMastery = topics.length > 0
        ? Math.round((topics.reduce((acc, t) => {
            const mastered = t.items.filter(i => i.status === 'mastered').length;
            return acc + (mastered / t.items.length);
        }, 0) / topics.length) * 100)
        : 0;

    // Module CRUD Handlers
    const handleStartRename = (topic: Topic) => {
        setEditingTopicId(topic.id);
        setEditTopicName(topic.name);
    };

    const handleSaveRename = (topic: Topic) => {
        updateTopic(topic.id, { ...topic, name: editTopicName });
        setEditingTopicId(null);
    };

    // Item CRUD Handlers
    const handleStartEditItem = (item: VocabItem) => {
        setEditingItemId(item.id);
        setEditWord(item.word);
        setEditSynonyms(item.synonyms.join(', '));
    };

    const handleSaveItem = (topic: Topic, itemId: string) => {
        const updatedItems = topic.items.map(item =>
            item.id === itemId
                ? { ...item, word: editWord, synonyms: editSynonyms.split(',').map(s => s.trim()).filter(s => s !== '') }
                : item
        );
        updateTopic(topic.id, { ...topic, items: updatedItems });
        setEditingItemId(null);
    };

    const handleDeleteItem = (topic: Topic, itemId: string) => {
        const updatedItems = topic.items.filter(item => item.id !== itemId);
        updateTopic(topic.id, { ...topic, items: updatedItems });
    };

    const handleAddItem = (topic: Topic) => {
        if (!newWord.trim()) return;
        const newItem: VocabItem = {
            id: crypto.randomUUID(),
            word: newWord.trim(),
            synonyms: newSynonyms.split(',').map(s => s.trim()).filter(s => s !== ''),
            status: 'hidden',
            userGuesses: []
        };
        updateTopic(topic.id, { ...topic, items: [...topic.items, newItem] });
        setNewWord('');
        setNewSynonyms('');
        setShowNewItemForm(false);
    };

    const navigateToTopicEdit = (id: string) => {
        setSelectedTopicId(id);
        setActiveView('detailed-edit');
    };

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] text-slate-200">
            {/* Sidebar Navigation */}
            <aside className="w-72 border-r border-white/5 bg-[#0f0f0f] flex flex-col fixed h-full z-50">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center font-black text-white text-xl shadow-lg shadow-primary/20">V</div>
                        <div className="flex flex-col">
                            <h1 className="font-black text-xl tracking-tighter leading-none">Admin<span className="text-primary italic">OS</span></h1>
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">v2.0 Managed Vault</span>
                        </div>
                    </div>

                    <nav className="space-y-1.5">
                        <NavItem
                            icon={<LayoutDashboard size={20} />}
                            label="System Overview"
                            active={activeView === 'overview'}
                            onClick={() => setActiveView('overview')}
                        />
                        <NavItem
                            icon={<Database size={20} />}
                            label="Knowledge Base"
                            active={activeView === 'modules' || activeView === 'detailed-edit'}
                            onClick={() => setActiveView('modules')}
                        />
                        <NavItem
                            icon={<PlusCircle size={20} />}
                            label="Import Unit"
                            active={activeView === 'import'}
                            onClick={() => setActiveView('import')}
                        />
                    </nav>
                </div>

                <div className="mt-auto p-8 space-y-6">
                    <div className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 mb-4">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Authenticated User</p>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent" />
                            <span className="font-black text-xs uppercase">Romizzidi9999</span>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-6 py-4 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all group"
                    >
                        <LogOut size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Exit to Home</span>
                    </Link>
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3 text-xs font-black text-slate-500 hover:text-white transition-colors uppercase tracking-[0.2em] group">
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Public Interface
                        </Link>
                        <button
                            onClick={() => logout()}
                            className="flex items-center gap-3 text-xs font-black text-red-500/70 hover:text-red-500 transition-colors uppercase tracking-[0.2em]"
                        >
                            <LogOut size={16} /> Terminate Session
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-72 p-16 max-w-[1600px] overflow-y-auto">
                <AnimatePresence mode="wait">
                    {activeView === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <header className="mb-12">
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Dashboard</h1>
                                <p className="text-slate-500 font-medium text-lg">System analytics and repository performance metrics.</p>
                            </header>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                                <StatCard icon={<Database size={24} className="text-blue-500" />} label="Active Units" value={topics.length} suffix="Modules" gradient="from-blue-500/10 to-transparent" />
                                <StatCard icon={<Hash size={24} className="text-primary" />} label="Vocabulary Pool" value={totalWords} suffix="Entries" gradient="from-primary/10 to-transparent" />
                                <StatCard icon={<Award size={24} className="text-yellow-500" />} label="Global Health" value={globalMastery} suffix="%" gradient="from-yellow-500/10 to-transparent" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-8 shadow-2xl">
                                    <h3 className="font-black text-xl mb-6">Recent Activity</h3>
                                    <div className="space-y-6">
                                        {topics.slice(0, 4).map(t => (
                                            <div key={t.id} className="flex items-center justify-between p-4 bg-white/[0.02] rounded-2xl border border-white/5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 font-black">
                                                        <BookOpen size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white">{t.name}</p>
                                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Added {new Date(t.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="font-black text-primary text-xs">{t.items.length} words</p>
                                                        <p className="text-[10px] text-slate-600 uppercase font-black">Capacity</p>
                                                    </div>
                                                    <ChevronRight className="text-slate-700" size={16} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-3xl p-10 flex flex-col justify-between">
                                    <div>
                                        <ShieldCheck size={48} className="text-primary mb-6" />
                                        <h3 className="text-3xl font-black text-white mb-4 italic">Security Guard Active</h3>
                                        <p className="text-slate-400 font-medium leading-relaxed">
                                            Your session is highly encrypted and restricted. All changes to the vocabulary repository are instantly synchronized with the cloud infrastructure.
                                        </p>
                                    </div>
                                    <button onClick={() => setActiveView('modules')} className="w-full py-4 mt-8 bg-white/5 hover:bg-white/10 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all border border-white/10">
                                        Access Modules ⚔️
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'modules' && (
                        <motion.div
                            key="modules"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <header className="flex justify-between items-end mb-12">
                                <div>
                                    <h2 className="text-5xl font-black text-white tracking-tighter mb-4">Knowledge Base</h2>
                                    <p className="text-slate-500 font-medium text-lg">Detailed management of your vocabulary units.</p>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Filter topics..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="bg-[#0f0f0f] border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-sm focus:outline-none focus:border-primary/50 transition-all w-80 shadow-2xl"
                                    />
                                </div>
                            </header>

                            <div className="bg-[#0f0f0f] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-600 bg-white/[0.01]">
                                            <th className="px-10 py-8">Topic Profile</th>
                                            <th className="px-10 py-8 text-right">Operations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map(topic => (
                                            <tr key={topic.id} className="group hover:bg-white/[0.01] transition-all">
                                                <td className="px-10 py-8">
                                                    {editingTopicId === topic.id ? (
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                autoFocus
                                                                value={editTopicName}
                                                                onChange={(e) => setEditTopicName(e.target.value.toUpperCase())}
                                                                className="bg-[#1a1a1a] border-2 border-primary/50 rounded-xl px-4 py-2 text-xl font-black text-white focus:outline-none uppercase"
                                                            />
                                                            <button onClick={() => handleSaveRename(topic)} className="p-3 bg-green-500/20 text-green-500 rounded-xl"><Check size={20} /></button>
                                                            <button onClick={() => setEditingTopicId(null)} className="p-3 bg-red-500/20 text-red-500 rounded-xl"><X size={20} /></button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 bg-white/5 rounded-[22px] flex items-center justify-center text-slate-500 font-black text-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                                                {topic.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <h4 className="text-2xl font-black text-white mb-1">{topic.name}</h4>
                                                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                                                    <span>{topic.items.length} Entries</span>
                                                                    <span>•</span>
                                                                    <span>Created {new Date(topic.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => navigateToTopicEdit(topic.id)}
                                                            className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all"
                                                        >
                                                            <Zap size={14} className="text-yellow-500" /> Manage Content
                                                        </button>
                                                        <button onClick={() => handleStartRename(topic)} className="p-3 hover:bg-white/5 text-slate-500 hover:text-white rounded-xl transition-all"><Edit3 size={18} /></button>
                                                        <button onClick={() => deleteTopic(topic.id)} className="p-3 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {activeView === 'detailed-edit' && selectedTopic && (
                        <motion.div
                            key="detailed-edit"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <header className="flex items-center gap-8 mb-12">
                                <button
                                    onClick={() => setActiveView('modules')}
                                    className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-all text-slate-400 hover:text-white"
                                >
                                    <ArrowLeft size={24} />
                                </button>
                                <div>
                                    <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2">
                                        <Database size={14} /> Content Management Mode
                                    </div>
                                    <h2 className="text-5xl font-black text-white tracking-tighter">{selectedTopic.name}</h2>
                                </div>
                                <button
                                    onClick={() => setShowNewItemForm(true)}
                                    className="ml-auto flex items-center gap-3 px-8 py-5 bg-primary hover:bg-accent text-white rounded-[22px] font-black text-xs uppercase tracking-[0.2em] shadow-2xl transition-all hover:scale-105"
                                >
                                    <PlusCircle size={20} />
                                    Add New Word
                                </button>
                            </header>

                            <div className="space-y-6">
                                <AnimatePresence>
                                    {showNewItemForm && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-primary/5 border-2 border-dashed border-primary/30 p-10 rounded-[32px] grid grid-cols-1 md:grid-cols-3 gap-8 items-end"
                                        >
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Primary Word</label>
                                                <input
                                                    autoFocus
                                                    placeholder="Enter word..."
                                                    value={newWord}
                                                    onChange={(e) => setNewWord(e.target.value)}
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-6 py-4 font-black text-white focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Synonyms (Comma separated)</label>
                                                <input
                                                    placeholder="e.g. happy, joyful, glad"
                                                    value={newSynonyms}
                                                    onChange={(e) => setNewSynonyms(e.target.value)}
                                                    className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl px-6 py-4 font-black text-white focus:outline-none focus:border-primary"
                                                />
                                            </div>
                                            <div className="flex gap-4">
                                                <button
                                                    onClick={() => handleAddItem(selectedTopic)}
                                                    className="flex-1 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transition-all"
                                                >
                                                    Insert Word
                                                </button>
                                                <button
                                                    onClick={() => setShowNewItemForm(false)}
                                                    className="p-4 bg-white/5 hover:bg-white/10 text-slate-500 rounded-2xl transition-all"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="bg-[#0f0f0f] rounded-[40px] border border-white/5 overflow-hidden shadow-2xl">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-600 bg-white/[0.01]">
                                                <th className="px-10 py-6">Word / Entry</th>
                                                <th className="px-10 py-6">Synonyms Database</th>
                                                <th className="px-10 py-6">Progression</th>
                                                <th className="px-10 py-6 text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {selectedTopic.items.map(item => (
                                                <tr key={item.id} className="group hover:bg-white/[0.01] transition-all">
                                                    <td className="px-10 py-6">
                                                        {editingItemId === item.id ? (
                                                            <input
                                                                autoFocus
                                                                value={editWord}
                                                                onChange={(e) => setEditWord(e.target.value)}
                                                                className="bg-[#1a1a1a] border border-primary rounded-xl px-4 py-3 text-lg font-black text-white outline-none"
                                                            />
                                                        ) : (
                                                            <span className="text-xl font-black text-white">{item.word}</span>
                                                        )}
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        {editingItemId === item.id ? (
                                                            <input
                                                                value={editSynonyms}
                                                                onChange={(e) => setEditSynonyms(e.target.value)}
                                                                className="w-full bg-[#1a1a1a] border border-primary rounded-xl px-4 py-3 text-sm font-bold text-slate-300 outline-none"
                                                            />
                                                        ) : (
                                                            <div className="flex flex-wrap gap-2">
                                                                {item.synonyms.map((s, i) => (
                                                                    <span key={i} className="text-[10px] font-black bg-white/5 text-slate-500 px-3 py-1 rounded-full uppercase tracking-tighter">
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-10 py-6">
                                                        <select
                                                            value={item.status}
                                                            onChange={(e) => {
                                                                const newStatus = e.target.value as any;
                                                                const updatedItems = selectedTopic.items.map(i =>
                                                                    i.id === item.id ? { ...i, status: newStatus } : i
                                                                );
                                                                updateTopic(selectedTopic.id, { ...selectedTopic, items: updatedItems });
                                                            }}
                                                            className={`bg-transparent border-none text-[10px] font-black uppercase tracking-widest cursor-pointer focus:outline-none rounded-lg px-2 py-1 transition-all ${item.status === 'mastered' ? 'text-green-500 bg-green-500/10' :
                                                                item.status === 'discovered' ? 'text-yellow-500 bg-yellow-500/10' :
                                                                    'text-slate-500 bg-slate-500/10'
                                                                }`}
                                                        >
                                                            <option value="hidden" className="bg-[#1a1a1a]">Hidden</option>
                                                            <option value="discovered" className="bg-[#1a1a1a]">Discovered</option>
                                                            <option value="mastered" className="bg-[#1a1a1a]">Mastered</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-10 py-6 text-right">
                                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                                                            {editingItemId === item.id ? (
                                                                <>
                                                                    <button onClick={() => handleSaveItem(selectedTopic, item.id)} className="p-3 bg-green-500/20 text-green-500 rounded-xl"><Save size={18} /></button>
                                                                    <button onClick={() => setEditingItemId(null)} className="p-3 bg-red-500/20 text-red-500 rounded-xl"><X size={18} /></button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <button onClick={() => handleStartEditItem(item)} className="p-3 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all"><Edit3 size={18} /></button>
                                                                    <button onClick={() => handleDeleteItem(selectedTopic, item.id)} className="p-3 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-xl transition-all"><Trash2 size={18} /></button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {activeView === 'import' && (
                        <motion.div
                            key="import"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <header className="mb-12">
                                <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Import Material</h1>
                                <p className="text-slate-500 font-medium text-lg">Load your Excel vocabulary datasets into the system.</p>
                            </header>

                            <div className="bg-[#0f0f0f] border border-white/5 rounded-[40px] p-20 shadow-2xl">
                                <UploadZone onComplete={() => setActiveView('modules')} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}

function NavItem({ icon, label, active = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-4 px-6 py-5 rounded-[22px] font-black text-xs uppercase tracking-[0.2em] transition-all cursor-pointer group relative overflow-hidden ${active ? 'text-white' : 'text-slate-600 hover:text-slate-300'
                }`}>
            {active && (
                <motion.div
                    layoutId="active-nav"
                    className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 -z-10"
                />
            )}
            <span className={`${active ? 'text-white' : 'group-hover:text-primary transition-colors'}`}>{icon}</span>
            <span className="relative z-10">{label}</span>
            {active && <motion.div layoutId="active-nav-dot" className="ml-auto w-2 h-2 rounded-full bg-white shadow-[0_0_10px_white]" />}
        </div>
    );
}

function StatCard({ icon, label, value, suffix, gradient }: { icon: React.ReactNode, label: string, value: string | number, suffix: string, gradient: string }) {
    return (
        <div className={`bg-[#0f0f0f] p-10 rounded-[40px] border border-white/5 shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all`}>
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10">
                <div className="flex items-center gap-5 mb-8">
                    <div className="p-4 bg-white/[0.03] rounded-2xl group-hover:scale-110 transition-transform duration-500">{icon}</div>
                    <span className="text-slate-500 font-extrabold text-xs uppercase tracking-[0.3em]">{label}</span>
                </div>
                <div className="flex items-baseline gap-3">
                    <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-6xl font-black text-white tracking-tighter"
                    >
                        {value}
                    </motion.span>
                    <span className="text-slate-600 font-black text-sm uppercase tracking-widest">{suffix}</span>
                </div>
            </div>
        </div>
    );
}
