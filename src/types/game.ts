export type GameMode = 'individual' | 'team';

export type QuestionCategory =
  | 'BILANGAN_BULAT'
  | 'BILANGAN_RASIONAL'
  | 'RASIO_PERBANDINGAN'
  | 'BENTUK_ALJABAR';

export type QuestionDifficulty = 'Mudah' | 'Sedang' | 'Menantang';

export type QuestionType = 'pilihan_ganda' | 'benar_salah' | 'isian_singkat';

export interface Participant {
  id: string;
  name: string;
  color: string; // hex
  bgClass: string;
  borderClass: string;
  textClass: string;
  avatarIcon: string;
  score: number;
  answeredCount: number;
  correctCount: number;
}

export interface Question {
  id: number;
  code: string;
  category: QuestionCategory;
  categoryLabel: string;
  difficulty: QuestionDifficulty;
  type: QuestionType;
  question: string;
  contextNote?: string;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[]; // for isian singkat variants e.g. ["-12", "- 12"]
  explanation: string;
  points: number;
}

export type QuestionCardStatus = 'unplayed' | 'playing' | 'answered';

export interface QuestionCardState {
  questionId: number;
  status: QuestionCardStatus;
  answeredByParticipantId?: string;
  answeredByParticipantName?: string;
  answeredByParticipantColor?: string;
  selectedAnswer?: string;
  isCorrect?: boolean;
  earnedPoints?: number;
}

export interface GameSettings {
  mode: GameMode;
  questionCount: number; // 10, 20, 30, 40, 50
  timerDuration: number; // 15, 30, 45, 60, 90
  questionOrder: 'random' | 'sequential';
}

export type GameView = 'setup' | 'board' | 'result';
