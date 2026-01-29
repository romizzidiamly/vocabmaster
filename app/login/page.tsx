'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Shield, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (login(username, password)) {
            router.push('/');
        } else {
            setError('Invalid credentials. Access Denied. 🛑');
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-[40px] p-10 shadow-2xl relative overflow-hidden border-white/10">
                    {/* Background Glow */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px]" />

                    <div className="text-center mb-8 relative z-10">
                        <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                            <Shield className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-3xl font-black text-foreground tracking-tight">Admin Portal 🏰</h2>
                        <p className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">Identify Yourself</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-4">
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Username"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                    required
                                />
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="w-5 h-5 text-slate-600 group-focus-within:text-primary transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Secret Password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-foreground placeholder:text-slate-600 focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all outline-none"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-500 text-xs font-black uppercase text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-primary hover:bg-accent text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 group"
                        >
                            Authorize Access <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3" /> Encrypted Session <Sparkles className="w-3 h-3" />
                </p>
            </motion.div>
        </div>
    );
}
