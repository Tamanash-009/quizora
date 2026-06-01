/**
 * Quizora TypeScript Types and Interfaces
 */

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  uuid?: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: string;
  bio?: string;
  avatarUrl?: string;
  emoji?: string; // Gen Z vibe check emoji
  xp?: number; // Experience Points
  level?: number; 
  streak?: number; // Streaks track
  badges?: string[]; // Badges lists
  lastActiveDate?: string;
}

export interface Quiz {
  id: string;
  uuid?: string;
  title: string;
  description?: string;
  category: string;
  timeLimit: number; // in seconds
  createdBy: string; // username or "System"
  creatorId?: string;
  isPublic: boolean;
  allowComments?: boolean;
  showCorrectAnswers?: boolean;
  maxAttempts?: number;
  totalAttempts?: number;
  averageScore?: number;
  completionRate?: number;
  shareCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  createdAt: string;
  questions: Question[];
  vibeTags?: string[]; // e.g. ["#funny", "#chaos", "#study"]
}

export interface Question {
  id: string;
  quizId: string;
  text: string;
  questionType: 'mcq' | 'tf' | 'scale' | 'ranking' | 'short_answer' | 'image_choice';
  points: number;
  order?: number;
  isRequired?: boolean;
  options: Option[];
  
  // Custom question fields
  scaleMin?: number;
  scaleMax?: number;
  scaleMinLabel?: string;
  scaleMaxLabel?: string;
  acceptedKeywords?: string[];
  caseSensitive?: boolean;
}

export interface Option {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  imageUrl?: string;
  order?: number;
  points?: number; // For partial points if applicable
}

export interface Attempt {
  id: string;
  userId: string;
  username: string;
  quizId: string;
  quizTitle: string;
  category: string;
  score: number;
  totalPoints: number;
  timeTaken: number; // in seconds
  completedAt: string;
  deviceType?: string;
  browser?: string;
  ipAddress?: string;
  isFlagged?: boolean;
}

export interface Answer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionId?: string;
  textAnswer?: string;
  scaleValue?: number;
  rankingOrder?: string[];
  isCorrect: boolean;
  pointsEarned?: number;
  timeSpent?: number;
}

export interface QuizCategory {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  description: string;
  color: string; // Tailwind gradient colors e.g., "from-pink-500 to-indigo-500"
}

