export interface User {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
}

export interface Stats {
  hearts: number;
  maxHearts: number;
  xp: number;
  dailyXP: number;
  streak: number;
  longestStreak: number;
  level: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  lastActiveDate: string;
}

export interface CompletedLesson {
  lessonId: string;
  moduleId: string;
  completedAt: string;
  score: number;
  accuracy: number;
  xpEarned: number;
  timeSpentMinutes: number;
  mistakes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'streak' | 'lessons' | 'xp' | 'accuracy' | 'special';
}

export interface Progress {
  currentCheckpoint: string;
  completedLessons: CompletedLesson[];
  achievements: Achievement[];
  unlockedModules: string[];
}

export interface LearningStats {
  totalTimeMinutes: number;
  totalLessonsCompleted: number;
  averageAccuracy: number;
  bestStreak: number;
  totalXPEarned: number;
  lessonsCompletedToday: number;
  lastLessonDate: string | null;
}

export interface UserProfile {
  user: User;
  stats: Stats;
  progress: Progress;
  learningStats: LearningStats;
}

// Helper types for hook functions
export interface ProfileActions {
  // Hearts management
  useHeart: () => Promise<boolean>;
  restoreHeart: () => Promise<void>;
  refillHearts: () => Promise<void>;

  // XP management
  addXP: (amount: number) => Promise<void>;
  resetDailyXP: () => Promise<void>;

  // Streak management
  updateStreak: () => Promise<void>;
  checkAndUpdateStreak: () => Promise<void>;

  // Lesson completion
  completeLesson: (lesson: Omit<CompletedLesson, 'completedAt'>) => Promise<void>;

  // Achievements
  unlockAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => Promise<void>;

  // Progress
  updateCheckpoint: (checkpointId: string) => Promise<void>;
  unlockModule: (moduleId: string) => Promise<void>;

  // Profile management
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  resetProfile: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export interface UseProfileReturn {
  profile: UserProfile | null;
  loading: boolean;
  error: Error | null;
  actions: ProfileActions;
}
