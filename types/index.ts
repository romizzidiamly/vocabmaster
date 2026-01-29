export interface VocabItem {
  id: string;
  word: string;
  synonyms: string[];
  phonetics?: { us: string, uk: string }; // Phonetic symbols
  examples?: { type: string, text: string }[]; // IELTS Sentence varieties
  userGuesses: string[]; // Track which synonyms were correctly guessed
  status: 'hidden' | 'discovered' | 'mastered';
}

export interface Topic {
  id: string;
  name: string;
  items: VocabItem[];
  createdAt: number;
}

export type GamePhase = 'topic-list' | 'preview' | 'playing' | 'upload';

export interface GameState {
  phase: GamePhase;
  activeTopicId: string | null;
  items: VocabItem[];
  score: number;
}
