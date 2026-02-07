
export enum UserLevel {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced'
}

export type WordPronunciationStatus = 'pending' | 'correct' | 'incorrect';

export interface ChatTurn {
  role: 'user' | 'model';
  text: string;
  isCorrection?: boolean;
}

export interface CustomSentence {
  id: string;
  text: string;
  translation: string;
  source: 'text' | 'image';
  createdAt: string;
}

export interface UserStats {
  name: string;
  gender: 'male' | 'female';
  streak: number;
  points: number;
  level: UserLevel;
  totalMinutes: number;
  lastActive: string;
  perfectSentences: number;
  totalWordsLearned: number;
  customSentences: CustomSentence[];
}

export interface RecognitionResult {
  transcript: string;
  isFinal: boolean;
}
