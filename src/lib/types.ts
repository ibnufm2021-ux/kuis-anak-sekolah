export type EducationLevel = "TK" | "SD" | "SMP" | "SMA";

export type DifficultyLevel = "sepele" | "gampang" | "sedeng lah" | "sulit" | "olimpiade ini mah";

export interface QuizQuestion {
  id: number;
  question: string;
  options: [string, string, string, string]; // exactly 4 options
  correctAnswerIndex: number; // 0, 1, 2, or 3
  explanation: string;
}

export interface QuizGenerationRequest {
  childName: string;
  level: EducationLevel;
  grade: string;
  subject?: string;
  topic?: string;
  difficulty: DifficultyLevel;
  questionCount: number; // n (max 20)
}

export interface GeneratedQuizData {
  childName: string;
  level: EducationLevel;
  grade: string;
  subject: string;
  topic: string;
  difficulty: DifficultyLevel;
  activeCount: number; // n questions displayed per attempt
  poolCount: number; // total 4 x n questions
  questions: QuizQuestion[];
  generatedAt: string;
}
