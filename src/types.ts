/**
 * Types and interfaces for Smart Study Hub.
 */

export enum SubjectCategory {
  SCIENCE = "Science",
  MATH = "Math",
  COMPUTER = "Computer",
  ENGLISH = "English",
  GK = "GK",
}

export enum DifficultyLevel {
  EASY = "Easy",
  MEDIUM = "Medium",
  HARD = "Hard",
}

export interface StudyNote {
  id: string;
  title: string;
  category: SubjectCategory;
  content: string; // Markdown supported
  downloadUrl?: string;
  readingTimeMinutes: number;
}

export interface MCQQuestion {
  id: string;
  category: SubjectCategory;
  difficulty: DifficultyLevel;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface EducationalVideo {
  id: string;
  title: string;
  category: SubjectCategory;
  youtubeId: string; // YouTube Video ID
  duration: string;
  thumbnailUrl: string;
  description: string;
}

export interface LeaderboardEntry {
  uid: string;
  name: string;
  avatar: string;
  score: number;
  quizzesCompleted: number;
  isCurrentUser?: boolean;
}

export interface UserProgress {
  score: number;
  studyTimeMinutes: number;
  completedQuizzesCount: number;
  completedNotesCount: number;
  streakDays: number;
  lastStudyDate?: string; // YYYY-MM-DD
  badges: Badge[];
  bookmarkedNoteIds?: string[];
  favoriteVideoIds?: string[];
  watchedVideoIds?: string[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // lucide icon name
  unlockedAt?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  profilePic?: string;
  schoolName?: string;
  preferredLanguage: "English" | "Nepali";
  dailyGoalMinutes: number;
}

export interface SavedActivity {
  id: string;
  type: "quiz" | "note" | "video";
  title: string;
  meta: string;
  timestamp: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
  isSuggestion?: boolean;
}
