'use client';

import { useVocabStore } from '@/context/VocabContext';

export function DataPreview() {
    const { gameState, setPhase, resetGame } = useVocabStore();

    if (gameState.items.length === 0) return null;

    return (
        <div className="w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Data Preview</h2>
                <p className="text-slate-400">
                    Found <span className="text-indigo-400 font-mono">{gameState.items.length}</span> vocabulary items.
                    Please verify the extraction below.
                </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden mb-6 max-h-96 overflow-y-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-800 border-b border-slate-700 sticky top-0">
                        <tr>
                            <th className="p-4 font-semibold text-slate-300">Word</th>
                            <th className="p-4 font-semibold text-slate-300">Synonym</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {gameState.items.slice(0, 50).map((item) => (
                            <tr key={item.id} className="hover:bg-slate-700/30">
                                <td className="p-4 font-medium text-slate-200">{item.word}</td>
                                <td className="p-4 text-slate-400">
                                    <div className="flex flex-wrap gap-1">
                                        {item.synonyms.map((syn, idx) => (
                                            <span key={idx} className="bg-slate-700/50 px-2 py-0.5 rounded text-xs border border-slate-600">
                                                {syn}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex gap-4 justify-center">
                <button
                    onClick={resetGame}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors border border-slate-700"
                >
                    Cancel
                </button>
                <button
                    onClick={() => setPhase('playing')}
                    className="px-8 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
                >
                    Start Test
                </button>
            </div>
        </div>
    );
}
