'use client';

import { useVocabStore } from '@/context/VocabContext';
import { TopicList } from '@/components/TopicList';
import { RecallTable } from '@/components/RecallTable';
import { GameInterface } from '@/components/GameInterface';
import { DataPreview } from '@/components/DataPreview';
import { MasteryGrid } from '@/components/MasteryGrid';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Home() {
  const { gameState } = useVocabStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {gameState.phase === 'topic-list' && (
        <TopicList />
      )}

      {gameState.phase === 'preview' && (
        <DataPreview />
      )}

      {gameState.phase === 'playing' && (
        <section className="space-y-12 pb-20">
          <GameInterface />
          <MasteryGrid />
          <RecallTable />
        </section>
      )}
    </div>
  );
}
