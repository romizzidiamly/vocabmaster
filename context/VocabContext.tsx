'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { VocabItem, GamePhase, GameState, Topic } from '@/types';
import { fetchGroqData } from '@/lib/ai-generator';

interface VocabContextType {
    topics: Topic[];
    gameState: GameState;
    addTopic: (name: string, items: VocabItem[]) => void;
    deleteTopic: (id: string) => void;
    selectTopic: (id: string) => void;
    setPhase: (phase: GamePhase) => void;
    resetGame: () => void;
    resetTopicProgress: () => void;
    markDiscovered: (id: string) => void;
    generateAiExamples: (id: string) => Promise<void>;
    guessSynonym: (wordId: string, synonym: string) => boolean;
    stats: {
        discoveredCount: number;
        masteredCount: number;
        totalCount: number;
    };
}

const VocabContext = createContext<VocabContextType | undefined>(undefined);

export function VocabProvider({ children }: { children: React.ReactNode }) {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [gameState, setGameState] = useState<GameState>({
        phase: 'topic-list',
        activeTopicId: null,
        items: [],
        score: 0,
    });

    const [isLoading, setIsLoading] = useState(true);

    // Initial Fetch from Server
    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch('/api/topics');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setTopics(data);
                }
            } catch (e) {
                console.error("Failed to fetch topics from server", e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTopics();
    }, []);

    // Sync a single topic to server
    const syncTopicToServer = useCallback(async (topic: Topic) => {
        try {
            await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(topic),
            });
        } catch (e) {
            console.error("Failed to sync topic to server", e);
        }
    }, []);

    const addTopic = async (name: string, items: VocabItem[]) => {
        console.log("Adding new topic:", name);
        const newTopic: Topic = {
            id: crypto.randomUUID(),
            name,
            items,
            createdAt: Date.now()
        };
        setTopics(prev => [newTopic, ...prev]);
        setGameState({
            phase: 'preview',
            activeTopicId: newTopic.id,
            items: newTopic.items,
            score: 0
        });
        await syncTopicToServer(newTopic);
    };

    const deleteTopic = async (id: string) => {
        setTopics(prev => prev.filter(t => t.id !== id));
        if (gameState.activeTopicId === id) {
            setGameState(prev => ({ ...prev, phase: 'topic-list', activeTopicId: null, items: [] }));
        }
        try {
            await fetch(`/api/topics?id=${id}`, { method: 'DELETE' });
        } catch (e) {
            console.error("Failed to delete topic from server", e);
        }
    };

    const selectTopic = (id: string) => {
        console.log("Selecting topic:", id);
        const topic = topics.find(t => t.id === id);
        if (topic) {
            setGameState({
                phase: 'preview',
                activeTopicId: id,
                items: topic.items,
                score: 0
            });
        }
    };

    const setPhase = (phase: GamePhase) => {
        setGameState(prev => ({ ...prev, phase }));
    };

    const resetGame = () => {
        setGameState(prev => ({ ...prev, phase: 'topic-list', activeTopicId: null, items: [] }));
    };

    const resetTopicProgress = async () => {
        if (!gameState.activeTopicId) return;

        setGameState(prev => {
            const resetItems = prev.items.map(item => ({
                ...item,
                status: 'hidden' as const,
                userGuesses: []
            }));

            const updatedTopic = topics.find(t => t.id === prev.activeTopicId);
            if (updatedTopic) {
                const newTopic = { ...updatedTopic, items: resetItems };
                setTopics(tList => tList.map(t => t.id === prev.activeTopicId ? newTopic : t));
                syncTopicToServer(newTopic);
            }

            return { ...prev, items: resetItems };
        });
    };

    const markDiscovered = async (id: string) => {
        // Find the word from the CURRENT topics/state
        const topic = topics.find(t => t.id === gameState.activeTopicId);
        const targetWord = topic?.items.find(i => i.id === id)?.word;

        if (!targetWord) return;

        // Phase 1: Reveal immediately
        setGameState(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id ? { ...item, status: 'discovered' as const } : item
            )
        }));

        // Phase 2: Fetch AI Examples & Phonetics
        try {
            const data = await fetchGroqData(targetWord);

            setGameState(prev => {
                const finalItems = prev.items.map(item =>
                    item.id === id ? { ...item, examples: data.examples, phonetics: data.phonetics } : item
                );

                const updatedTopic = topics.find(t => t.id === prev.activeTopicId);
                if (updatedTopic) {
                    const newTopic = { ...updatedTopic, items: finalItems };
                    setTopics(tList => tList.map(t => t.id === prev.activeTopicId ? newTopic : t));
                    syncTopicToServer(newTopic);
                }

                return { ...prev, items: finalItems };
            });
        } catch (e) {
            console.error("AI Generation failed in context:", e);
        }
    };

    const guessSynonym = (wordId: string, synonym: string): boolean => {
        let correct = false;
        setGameState(prev => {
            const newItems = prev.items.map(item => {
                if (item.id === wordId) {
                    const isCorrect = item.synonyms.some(s => s.toLowerCase() === synonym.trim().toLowerCase());
                    if (isCorrect) {
                        correct = true;
                        const alreadyGuessed = item.userGuesses.some(g => g.toLowerCase() === synonym.trim().toLowerCase());
                        if (!alreadyGuessed) {
                            const newUserGuesses = [...item.userGuesses, synonym.trim()];
                            const isFullyMastered = newUserGuesses.length >= item.synonyms.length;
                            return {
                                ...item,
                                userGuesses: newUserGuesses,
                                status: isFullyMastered ? 'mastered' as const : item.status
                            };
                        }
                    }
                }
                return item;
            });

            const updatedTopic = topics.find(t => t.id === prev.activeTopicId);
            if (updatedTopic) {
                const newTopic = { ...updatedTopic, items: newItems };
                setTopics(tList => tList.map(t => t.id === prev.activeTopicId ? newTopic : t));
                syncTopicToServer(newTopic);
            }

            return { ...prev, items: newItems };
        });
        return correct;
    };

    const discoveredCount = gameState.items.filter(i => i.status === 'discovered' || i.status === 'mastered').length;
    const masteredCount = gameState.items.filter(i => i.status === 'mastered').length;
    const totalCount = gameState.items.length;

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Knowledge Base...</p>
                </div>
            </div>
        );
    }

    const generateAiExamples = async (id: string) => {
        const targetWord = gameState.items.find(i => i.id === id)?.word;
        if (!targetWord) return;

        // Reset details to show loading
        setGameState(prev => ({
            ...prev,
            items: prev.items.map(item =>
                item.id === id ? { ...item, examples: undefined, phonetics: undefined } : item
            )
        }));

        try {
            const data = await fetchGroqData(targetWord);

            setGameState(prev => {
                const finalItems = prev.items.map(item =>
                    item.id === id ? { ...item, examples: data.examples, phonetics: data.phonetics } : item
                );

                const updatedTopic = topics.find(t => t.id === prev.activeTopicId);
                if (updatedTopic) {
                    const newTopic = { ...updatedTopic, items: finalItems };
                    setTopics(tList => tList.map(t => t.id === prev.activeTopicId ? newTopic : t));
                    syncTopicToServer(newTopic);
                }

                return { ...prev, items: finalItems };
            });
        } catch (e) {
            console.error("Manual AI Generation failed:", e);
        }
    };

    return (
        <VocabContext.Provider value={{
            topics,
            gameState,
            addTopic,
            deleteTopic,
            selectTopic,
            setPhase,
            resetGame,
            resetTopicProgress,
            markDiscovered,
            generateAiExamples,
            guessSynonym,
            stats: {
                discoveredCount,
                masteredCount,
                totalCount
            }
        }}>
            {children}
        </VocabContext.Provider>
    );
}

export function useVocabStore() {
    const context = useContext(VocabContext);
    if (context === undefined) {
        throw new Error('useVocabStore must be used within a VocabProvider');
    }
    return context;
}
