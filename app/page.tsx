'use client';

import { useVocabStore } from '@/context/VocabContext';
import { TopicList } from '@/components/TopicList';
import { RecallTable } from '@/components/RecallTable';
import { UploadZone } from '@/components/UploadZone';
import { GameInterface } from '@/components/GameInterface';
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

      {gameState.phase === 'upload' && (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <UploadZone />
        </section>
      )}

      {gameState.phase === 'playing' && (
        <section className="space-y-12 pb-20">
          <GameInterface />
          <RecallTable />
        </section>
      )}
    </div>
  );
}
