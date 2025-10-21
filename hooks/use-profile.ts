import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  UserProfile,
  UseProfileReturn,
  CompletedLesson,
  Achievement,
  Stats,
} from '@/types/profile';
import {
  fetchUserProfile,
  saveLessonProgress,
  addXPToBackend,
  unlockModuleOnBackend,
  useHeartOnBackend,
  ApiError,
} from '@/services/api';
import defaultProfile from '@/data/user-profile.json';

const PROFILE_STORAGE_KEY = '@duoBiznes:userProfile';
const PROFILE_TIMESTAMP_KEY = '@duoBiznes:userProfile:timestamp';
const PROFILE_CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache

// XP required for each level (exponential growth)
const XP_PER_LEVEL = [
  0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200, // Levels 1-10
  4000, 5000, 6200, 7600, 9200, 11000, 13000, 15200, 17600, 20200, // Levels 11-20
];

// Calculate level from total XP
function calculateLevel(xp: number): number {
  for (let i = XP_PER_LEVEL.length - 1; i >= 0; i--) {
    if (xp >= XP_PER_LEVEL[i]) {
      return i + 1;
    }
  }
  return 1;
}

// Calculate tier from level
function calculateTier(level: number): Stats['tier'] {
  if (level >= 18) return 'diamond';
  if (level >= 14) return 'platinum';
  if (level >= 10) return 'gold';
  if (level >= 6) return 'silver';
  return 'bronze';
}

// Check if date is today
function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Check if date is yesterday
function isYesterday(dateString: string): boolean {
  const date = new Date(dateString);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

export function useProfile(): UseProfileReturn {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load profile from API with stale-while-revalidate strategy
  const loadProfile = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first (unless force refresh)
      if (!forceRefresh) {
        const [cachedProfile, cachedTimestamp] = await Promise.all([
          AsyncStorage.getItem(PROFILE_STORAGE_KEY),
          AsyncStorage.getItem(PROFILE_TIMESTAMP_KEY),
        ]);

        if (cachedProfile && cachedTimestamp) {
          const timestamp = parseInt(cachedTimestamp, 10);
          const now = Date.now();
          const cacheAge = now - timestamp;

          if (cacheAge < PROFILE_CACHE_TTL) {
            // Cache is fresh - use it and update in background
            console.log('📦 Profile cache hit - showing cached data');
            const parsed = JSON.parse(cachedProfile) as UserProfile;
            setProfile(parsed);
            setLoading(false);

            // Fetch fresh data in background
            console.log('🔄 Fetching fresh profile in background...');
            try {
              const freshProfile = await fetchUserProfile();
              await Promise.all([
                AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(freshProfile)),
                AsyncStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString()),
              ]);
              setProfile(freshProfile);
              console.log('✅ Profile silently updated in background');
            } catch (bgError) {
              console.log('⚠️ Background profile update failed - using cache');
            }
            return;
          }
        }
      }

      // No cache or force refresh - fetch from API with loading
      console.log('📡 Fetching profile from API...');
      const apiProfile = await fetchUserProfile();

      // Save to cache
      await Promise.all([
        AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(apiProfile)),
        AsyncStorage.setItem(PROFILE_TIMESTAMP_KEY, Date.now().toString()),
      ]);

      setProfile(apiProfile);
      console.log('💾 Profile cached');
    } catch (err) {
      console.error('Profile load error:', err);
      setError(err instanceof Error ? err : new Error('Failed to load profile'));

      // Try to use cached profile as fallback
      try {
        const cachedProfile = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (cachedProfile) {
          console.log('⚠️ Using stale cache as fallback');
          setProfile(JSON.parse(cachedProfile) as UserProfile);
        } else {
          // Last resort - use default profile
          setProfile(defaultProfile as UserProfile);
        }
      } catch {
        setProfile(defaultProfile as UserProfile);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Save profile to AsyncStorage
  const saveProfile = useCallback(async (updatedProfile: UserProfile) => {
    try {
      await AsyncStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save profile'));
    }
  }, []);

  // Use a heart (returns false if no hearts available)
  const useHeart = useCallback(async (): Promise<boolean> => {
    if (!profile) return false;

    if (profile.stats.hearts <= 0) {
      return false;
    }

    try {
      // Call backend API
      const response = await useHeartOnBackend('current-lesson');

      // Refresh profile from API to get updated stats
      await loadProfile(true);

      console.log(`💔 Serce użyte. Pozostało: ${response.hearts}/${response.max_hearts}`);
      return true;
    } catch (error) {
      console.error('Error using heart:', error);

      // Fallback - update locally if API fails
      const updatedProfile: UserProfile = {
        ...profile,
        stats: {
          ...profile.stats,
          hearts: profile.stats.hearts - 1,
        },
      };
      await saveProfile(updatedProfile);
      return true;
    }
  }, [profile, saveProfile, loadProfile]);

  // Restore one heart (e.g., after waiting)
  const restoreHeart = useCallback(async () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      stats: {
        ...profile.stats,
        hearts: Math.min(profile.stats.hearts + 1, profile.stats.maxHearts),
      },
    };

    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Refill all hearts
  const refillHearts = useCallback(async () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      stats: {
        ...profile.stats,
        hearts: profile.stats.maxHearts,
      },
    };

    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Add XP and recalculate level/tier
  const addXP = useCallback(
    async (amount: number, reason: string = 'manual') => {
      if (!profile) return;

      try {
        // Call backend API
        const response = await addXPToBackend(amount, reason);

        // Refresh profile from API to get updated stats
        await loadProfile(true);

        console.log(`✨ +${amount} XP! ${response.data.level_up ? '🎉 Level UP!' : ''}`);
      } catch (error) {
        console.error('Error adding XP:', error);

        // Fallback - update locally if API fails
        const newTotalXP = profile.stats.xp + amount;
        const newDailyXP = profile.stats.dailyXP + amount;
        const newLevel = calculateLevel(newTotalXP);
        const newTier = calculateTier(newLevel);

        const updatedProfile: UserProfile = {
          ...profile,
          stats: {
            ...profile.stats,
            xp: newTotalXP,
            dailyXP: newDailyXP,
            level: newLevel,
            tier: newTier,
          },
          learningStats: {
            ...profile.learningStats,
            totalXPEarned: profile.learningStats.totalXPEarned + amount,
          },
        };

        await saveProfile(updatedProfile);
      }
    },
    [profile, saveProfile, loadProfile]
  );

  // Reset daily XP (call at midnight)
  const resetDailyXP = useCallback(async () => {
    if (!profile) return;

    const updatedProfile: UserProfile = {
      ...profile,
      stats: {
        ...profile.stats,
        dailyXP: 0,
      },
      learningStats: {
        ...profile.learningStats,
        lessonsCompletedToday: 0,
      },
    };

    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Update streak
  const updateStreak = useCallback(async () => {
    if (!profile) return;

    const lastActive = profile.stats.lastActiveDate;
    const now = new Date().toISOString();

    let newStreak = profile.stats.streak;

    if (isToday(lastActive)) {
      // Already active today - no change
      return;
    } else if (isYesterday(lastActive)) {
      // Continue streak
      newStreak += 1;
    } else {
      // Streak broken
      newStreak = 1;
    }

    const updatedProfile: UserProfile = {
      ...profile,
      stats: {
        ...profile.stats,
        streak: newStreak,
        longestStreak: Math.max(newStreak, profile.stats.longestStreak),
        lastActiveDate: now,
      },
      learningStats: {
        ...profile.learningStats,
        bestStreak: Math.max(newStreak, profile.learningStats.bestStreak),
      },
    };

    await saveProfile(updatedProfile);
  }, [profile, saveProfile]);

  // Check and update streak (call on app start)
  const checkAndUpdateStreak = useCallback(async () => {
    if (!profile) return;

    const lastActive = profile.stats.lastActiveDate;

    // If last active was yesterday and it's a new day, reset daily stats
    if (!isToday(lastActive)) {
      await resetDailyXP();

      // If last active was NOT yesterday, break the streak
      if (!isYesterday(lastActive) && profile.stats.streak > 0) {
        const updatedProfile: UserProfile = {
          ...profile,
          stats: {
            ...profile.stats,
            streak: 0,
          },
        };
        await saveProfile(updatedProfile);
      }
    }
  }, [profile, resetDailyXP, saveProfile]);

  // Complete a lesson
  const completeLesson = useCallback(
    async (lesson: Omit<CompletedLesson, 'completedAt'>) => {
      if (!profile) return;

      try {
        const completedAt = new Date().toISOString();

        // Call backend API - this handles everything:
        // - Saves completion
        // - Adds XP
        // - Updates level
        // - Updates streak
        // - Unlocks modules
        // - Unlocks achievements
        const response = await saveLessonProgress({
          lesson_id: lesson.lessonId,
          module_id: lesson.moduleId,
          score: lesson.score,
          accuracy: lesson.accuracy,
          xp_earned: lesson.xpEarned,
          time_spent_minutes: lesson.timeSpentMinutes,
          mistakes: lesson.mistakes,
          completed_at: completedAt,
        });

        // Refresh profile from API to get all updated stats
        await loadProfile(true);

        console.log('🎉 Lekcja ukończona!');
        console.log(`   XP: +${response.data.xp_added}`);
        console.log(`   Level: ${response.data.new_level}`);
        console.log(`   Streak: ${response.data.stats.streak}`);

        if (response.data.unlocked_modules.length > 0) {
          console.log(`   🔓 Odblokowano moduły: ${response.data.unlocked_modules.join(', ')}`);
        }

        if (response.data.achievements_unlocked.length > 0) {
          console.log(`   🏆 Nowe achievementy: ${response.data.achievements_unlocked.length}`);
        }
      } catch (error) {
        console.error('Error completing lesson:', error);

        // Fallback - save locally if API fails
        const completedLesson: CompletedLesson = {
          ...lesson,
          completedAt: new Date().toISOString(),
        };

        const totalLessons = profile.learningStats.totalLessonsCompleted + 1;
        const oldAverage = profile.learningStats.averageAccuracy;
        const newAverage =
          (oldAverage * (totalLessons - 1) + lesson.accuracy) / totalLessons;

        const updatedProfile: UserProfile = {
          ...profile,
          progress: {
            ...profile.progress,
            completedLessons: [...profile.progress.completedLessons, completedLesson],
          },
          learningStats: {
            ...profile.learningStats,
            totalLessonsCompleted: totalLessons,
            totalTimeMinutes: profile.learningStats.totalTimeMinutes + lesson.timeSpentMinutes,
            averageAccuracy: Math.round(newAverage * 100) / 100,
            lessonsCompletedToday: profile.learningStats.lessonsCompletedToday + 1,
            lastLessonDate: completedLesson.completedAt,
          },
        };

        await saveProfile(updatedProfile);
        await addXP(lesson.xpEarned, 'lesson_completion');
        await updateStreak();
      }
    },
    [profile, saveProfile, addXP, updateStreak, loadProfile]
  );

  // Unlock an achievement
  const unlockAchievement = useCallback(
    async (achievement: Omit<Achievement, 'unlockedAt'>) => {
      if (!profile) return;

      // Check if already unlocked
      const alreadyUnlocked = profile.progress.achievements.some(
        (a) => a.id === achievement.id
      );
      if (alreadyUnlocked) return;

      const unlockedAchievement: Achievement = {
        ...achievement,
        unlockedAt: new Date().toISOString(),
      };

      const updatedProfile: UserProfile = {
        ...profile,
        progress: {
          ...profile.progress,
          achievements: [...profile.progress.achievements, unlockedAchievement],
        },
      };

      await saveProfile(updatedProfile);
    },
    [profile, saveProfile]
  );

  // Update current checkpoint
  const updateCheckpoint = useCallback(
    async (checkpointId: string) => {
      if (!profile) return;

      const updatedProfile: UserProfile = {
        ...profile,
        progress: {
          ...profile.progress,
          currentCheckpoint: checkpointId,
        },
      };

      await saveProfile(updatedProfile);
    },
    [profile, saveProfile]
  );

  // Unlock a module
  const unlockModule = useCallback(
    async (moduleId: string) => {
      if (!profile) return;

      // Check if already unlocked
      if (profile.progress.unlockedModules.includes(moduleId)) return;

      try {
        // Call backend API
        await unlockModuleOnBackend(moduleId);

        // Refresh profile from API to get updated unlocked modules
        await loadProfile(true);

        console.log(`🔓 Odblokowano moduł: ${moduleId}`);
      } catch (error) {
        console.error('Error unlocking module:', error);

        // Fallback - update locally if API fails
        const updatedProfile: UserProfile = {
          ...profile,
          progress: {
            ...profile.progress,
            unlockedModules: [...profile.progress.unlockedModules, moduleId],
          },
        };

        await saveProfile(updatedProfile);
      }
    },
    [profile, saveProfile, loadProfile]
  );

  // Update profile with partial data
  const updateProfile = useCallback(
    async (updates: Partial<UserProfile>) => {
      if (!profile) return;

      const updatedProfile: UserProfile = {
        ...profile,
        ...updates,
      };

      await saveProfile(updatedProfile);
    },
    [profile, saveProfile]
  );

  // Reset profile to default
  const resetProfile = useCallback(async () => {
    await saveProfile(defaultProfile as UserProfile);
  }, [saveProfile]);

  // Refresh profile from API (force)
  const refreshProfile = useCallback(async () => {
    await loadProfile(true);
  }, [loadProfile]);

  // Load profile on mount
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Check streak on mount
  useEffect(() => {
    if (profile) {
      checkAndUpdateStreak();
    }
  }, [profile?.user.id]); // Only run when profile is first loaded

  return {
    profile,
    loading,
    error,
    actions: {
      useHeart,
      restoreHeart,
      refillHearts,
      addXP,
      resetDailyXP,
      updateStreak,
      checkAndUpdateStreak,
      completeLesson,
      unlockAchievement,
      updateCheckpoint,
      unlockModule,
      updateProfile,
      resetProfile,
      refreshProfile,
    },
  };
}
