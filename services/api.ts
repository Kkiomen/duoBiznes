import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, CACHE_CONFIG, REQUEST_TIMEOUT } from '@/constants/api';
import type { Course, Module } from '@/types/course';
import type {
  UserProfile,
  LessonProgressData,
  LessonProgressResponse,
  AddXPData,
  XPResponse,
  UnlockModuleData,
  UnlockModuleResponse,
  UseHeartData,
  UseHeartResponse,
} from '@/types/profile';
import type { LessonModule } from '@/types/lesson';
import { getToken } from './token-storage';

/**
 * Błąd API z dodatkowymi informacjami
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public originalError?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Wrapper dla fetch z timeoutem i automatyczną injekcją tokenu
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    // Automatycznie dodaj token do headera jeśli istnieje
    const token = await getToken();
    const headers = new Headers(options.headers);

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if ((error as Error).name === 'AbortError') {
      throw new ApiError('Przekroczono czas oczekiwania na odpowiedź serwera');
    }
    throw error;
  }
}

/**
 * Pobiera dane kursu z cache
 */
export async function getCachedCourseData(): Promise<Course | null> {
  try {
    const [cachedData, cachedTimestamp] = await Promise.all([
      AsyncStorage.getItem(CACHE_CONFIG.KEYS.COURSE_DATA),
      AsyncStorage.getItem(CACHE_CONFIG.KEYS.COURSE_TIMESTAMP),
    ]);

    if (!cachedData || !cachedTimestamp) {
      return null;
    }

    const timestamp = parseInt(cachedTimestamp, 10);
    const now = Date.now();

    // Sprawdź czy cache nie wygasł
    if (now - timestamp > CACHE_CONFIG.TTL) {
      // Cache wygasł - usuń
      await clearCourseCache();
      return null;
    }

    return JSON.parse(cachedData) as Course;
  } catch (error) {
    console.error('Błąd odczytu cache:', error);
    return null;
  }
}

/**
 * Zapisuje dane kursu do cache
 */
export async function setCachedCourseData(courseData: Course): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.setItem(CACHE_CONFIG.KEYS.COURSE_DATA, JSON.stringify(courseData)),
      AsyncStorage.setItem(CACHE_CONFIG.KEYS.COURSE_TIMESTAMP, Date.now().toString()),
    ]);
  } catch (error) {
    console.error('Błąd zapisu do cache:', error);
    // Nie rzucamy błędu - cache jest opcjonalny
  }
}

/**
 * Czyści cache kursu
 */
export async function clearCourseCache(): Promise<void> {
  try {
    await Promise.all([
      AsyncStorage.removeItem(CACHE_CONFIG.KEYS.COURSE_DATA),
      AsyncStorage.removeItem(CACHE_CONFIG.KEYS.COURSE_TIMESTAMP),
    ]);
  } catch (error) {
    console.error('Błąd czyszczenia cache:', error);
  }
}

/**
 * Mapuje dane z API (snake_case) na TypeScript types (camelCase)
 */
function mapApiResponseToCourse(apiData: any): Course {
  return {
    id: apiData.id,
    title: apiData.title,
    slug: apiData.slug,
    description: apiData.description,
    character: apiData.character,
    characterName: apiData.characterName || apiData.character_name,
    chapters: apiData.chapters.map((chapter: any) => ({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      icon: chapter.icon,
      order: chapter.order,
      isChapterLocked: chapter.is_chapter_locked ?? false,
      isChapterCompleted: chapter.is_chapter_completed ?? false,
      lessons: chapter.lessons.map((lesson: any) => ({
        id: lesson.id,
        moduleId: lesson.id.toString(), // API zwraca id, używamy jako moduleId
        moduleTitle: lesson.title,
        character: lesson.icon,
        characterName: apiData.characterName || apiData.character_name,
        totalXP: lesson.total_xp,
        isLocked: lesson.is_locked ?? false,
        lessons: (lesson.exercieses || lesson.exercises || []).map((exercise: any) => ({
          id: exercise.id,
          type: exercise.type,
          xp: exercise.xp,
          content: exercise.content,
        })),
      })),
    })),
  };
}

/**
 * Pobiera dane kursu z API
 */
export async function fetchCourseFromApi(courseId: number): Promise<Course> {
  try {
    const response = await fetchWithTimeout(API_ENDPOINTS.getCourse(courseId));

    if (!response.ok) {
      throw new ApiError(
        `Błąd serwera: ${response.statusText}`,
        response.status
      );
    }

    const apiData = await response.json();
    const courseData = mapApiResponseToCourse(apiData);
    return courseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if ((error as Error).message.includes('Network request failed')) {
      throw new ApiError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
    }

    if ((error as Error).message.includes('Failed to fetch')) {
      throw new ApiError('Nie można połączyć się z serwerem. Upewnij się, że backend działa na localhost:8000');
    }

    throw new ApiError('Wystąpił nieoczekiwany błąd podczas pobierania danych', undefined, error);
  }
}

/**
 * Rewaliduje cache w tle (stale-while-revalidate pattern)
 * Pobiera świeże dane z API i aktualizuje cache, ale nie blokuje
 */
export async function revalidateInBackground(
  courseId: number,
  onUpdate?: (freshData: Course) => void
): Promise<void> {
  try {
    console.log('🔄 Background revalidation - pobieram świeże dane z API...');
    const freshData = await fetchCourseFromApi(courseId);
    console.log(`✨ Zaktualizowano: ${freshData.chapters[0]?.lessons.length || 0} lekcji`);

    // Zapisz do cache
    await setCachedCourseData(freshData);
    console.log('💾 Cache zaktualizowany w tle');

    // Wywołaj callback z nowymi danymi
    if (onUpdate) {
      onUpdate(freshData);
    }
  } catch (error) {
    console.log('⚠️ Background revalidation failed (offline?) - używam cache');
    // Cicho ignoruj błędy - użytkownik ma cache
  }
}

/**
 * Główna funkcja do pobierania danych kursu
 * Strategia: stale-while-revalidate
 * - Jeśli jest cache → zwróć cache natychmiast + zaktualizuj w tle
 * - Jeśli nie ma cache → pobierz z API (z loadingiem)
 */
export async function fetchCourseData(
  courseId: number,
  forceRefresh = false,
  callbacks?: {
    onBackgroundUpdate?: (freshData: Course) => void;
    onCacheHit?: () => void;
  }
): Promise<Course> {
  // Jeśli forceRefresh = true, pomijamy cache
  if (forceRefresh) {
    console.log('🔄 FORCE REFRESH - pomijam cache, pobieram z API...');
    const courseData = await fetchCourseFromApi(courseId);
    console.log(`✨ Pobrano z API: ${courseData.chapters[0]?.lessons.length || 0} lekcji`);
    await setCachedCourseData(courseData);
    console.log('💾 Zapisano do cache');
    return courseData;
  }

  // Sprawdź cache
  const cachedData = await getCachedCourseData();

  if (cachedData) {
    console.log('✅ Zwracam dane z cache (bez loadingu)');
    console.log(`   📚 Lekcji w cache: ${cachedData.chapters[0]?.lessons.length || 0}`);

    // Powiadom że używamy cache (aby ustawić updating=true)
    callbacks?.onCacheHit?.();

    // KLUCZOWA ZMIANA: Aktualizuj cache w tle (asynchronicznie)
    // Użytkownik widzi cache od razu, a nowe dane pojawią się za chwilę
    revalidateInBackground(courseId, callbacks?.onBackgroundUpdate);

    return cachedData;
  }

  // Brak cache - pierwszy load z loadingiem
  console.log('📡 Brak cache - pierwszy load z API...');
  const courseData = await fetchCourseFromApi(courseId);
  console.log(`✨ Pobrano z API: ${courseData.chapters[0]?.lessons.length || 0} lekcji`);
  await setCachedCourseData(courseData);
  console.log('💾 Zapisano do cache');

  return courseData;
}

/**
 * Helper do znajdowania modułu po ID
 */
export function findModuleById(course: Course, moduleId: string): Module | undefined {
  for (const chapter of course.chapters) {
    const module = chapter.lessons.find((m) => m.moduleId === moduleId);
    if (module) {
      return module;
    }
  }
  return undefined;
}

/**
 * Helper do znajdowania modułu po indeksie
 */
export function getModuleByIndex(course: Course, chapterIndex: number, lessonIndex: number): Module | undefined {
  const chapter = course.chapters[chapterIndex];
  if (!chapter) return undefined;

  return chapter.lessons[lessonIndex];
}

/**
 * Pobiera profil użytkownika z API
 * Używa endpoint /api/auth/me który zwraca pełny profil + progress + stats
 */
export async function fetchUserProfile(): Promise<UserProfile> {
  try {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Brak tokenu autoryzacji', 401);
    }

    const response = await fetchWithTimeout(API_ENDPOINTS.me(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new ApiError('Sesja wygasła. Zaloguj się ponownie.', response.status);
      }

      throw new ApiError(
        `Błąd pobierania profilu: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();
    const apiData = responseData.data || responseData;

    // Mapowanie z API response na UserProfile typ (snake_case → camelCase)
    const profile: UserProfile = {
      user: {
        id: String(apiData.user.id),
        name: apiData.user.name,
        avatar: apiData.user.avatar || '👤',
        joinDate: apiData.user.created_at || new Date().toISOString(),
      },
      stats: {
        hearts: apiData.user.stats.hearts,
        maxHearts: apiData.user.stats.max_hearts,
        xp: apiData.user.stats.xp,
        dailyXP: apiData.user.stats.daily_xp,
        streak: apiData.user.stats.streak,
        longestStreak: apiData.user.stats.longest_streak,
        level: apiData.user.stats.level,
        tier: apiData.user.stats.tier as 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond',
        lastActiveDate: apiData.user.stats.last_active_date || new Date().toISOString(),
      },
      progress: {
        currentCheckpoint: apiData.user.progress.currentCheckpoint || null,
        completedLessons: apiData.user.progress.completedLessons || [],
        achievements: apiData.user.progress.achievements || [],
        unlockedModules: apiData.user.progress.unlockedModules || [],
      },
      learningStats: {
        totalTimeMinutes: apiData.user.stats.total_time_minutes,
        totalLessonsCompleted: apiData.user.stats.total_lessons_completed,
        averageAccuracy: parseFloat(apiData.user.stats.average_accuracy) || 0,
        bestStreak: apiData.user.stats.best_streak,
        totalXPEarned: apiData.user.stats.total_xp_earned,
        lessonsCompletedToday: apiData.user.stats.lessons_completed_today,
        lastLessonDate: apiData.user.stats.last_lesson_date,
      },
    };

    console.log('✅ Profil pobrany z API');
    return profile;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if ((error as Error).message.includes('Network request failed')) {
      throw new ApiError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
    }

    throw new ApiError('Wystąpił nieoczekiwany błąd podczas pobierania profilu', undefined, error);
  }
}

/**
 * Pobiera pojedynczą lekcję/moduł z API
 * Endpoint: GET /api/lessons/{moduleId}
 */
export async function fetchLesson(moduleId: string): Promise<LessonModule> {
  try {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Brak tokenu autoryzacji', 401);
    }

    const response = await fetchWithTimeout(API_ENDPOINTS.getLesson(moduleId), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.message || 'Lekcja jest zablokowana. Ukończ poprzednią lekcję.',
          response.status
        );
      }

      if (response.status === 404) {
        throw new ApiError('Nie znaleziono lekcji', response.status);
      }

      throw new ApiError(
        `Błąd pobierania lekcji: ${response.statusText}`,
        response.status
      );
    }

    const lessonData = await response.json();
    console.log(`✅ Lekcja pobrana: ${lessonData.moduleTitle} (${lessonData.lessons.length} kroków)`);
    return lessonData as LessonModule;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if ((error as Error).message.includes('Network request failed')) {
      throw new ApiError('Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie.');
    }

    throw new ApiError('Wystąpił nieoczekiwany błąd podczas pobierania lekcji', undefined, error);
  }
}

// ========================================
// Progress & Learning API Functions
// ========================================

/**
 * Zapisuje ukończenie lekcji do backendu
 * Backend automatycznie:
 * - Dodaje XP i przelicza level
 * - Aktualizuje streak
 * - Odblokowuje moduły
 * - Odblokowuje achievementy
 * - Aktualizuje wszystkie statystyki
 */
export async function saveLessonProgress(data: LessonProgressData): Promise<LessonProgressResponse> {
  try {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Brak tokenu autoryzacji', 401);
    }

    const response = await fetchWithTimeout(API_ENDPOINTS.saveLessonProgress(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Błąd zapisywania postępu lekcji: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();
    console.log('✅ Postęp lekcji zapisany');
    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Wystąpił nieoczekiwany błąd podczas zapisywania postępu', undefined, error);
  }
}

/**
 * Dodaje XP do profilu użytkownika (bonusy, eventy)
 * Backend automatycznie przelicza level
 */
export async function addXPToBackend(amount: number, reason: string): Promise<XPResponse> {
  try {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Brak tokenu autoryzacji', 401);
    }

    const data: AddXPData = { amount, reason };

    const response = await fetchWithTimeout(API_ENDPOINTS.addXP(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Błąd dodawania XP: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();
    console.log(`✅ Dodano ${amount} XP (${reason})`);
    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Wystąpił nieoczekiwany błąd podczas dodawania XP', undefined, error);
  }
}

/**
 * Odblokowuje moduł dla użytkownika
 * (np. manualne odblokowywanie przez premium)
 */
export async function unlockModuleOnBackend(moduleId: string): Promise<UnlockModuleResponse> {
  try {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Brak tokenu autoryzacji', 401);
    }

    const data: UnlockModuleData = { module_id: moduleId };

    const response = await fetchWithTimeout(API_ENDPOINTS.unlockModule(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.message || `Błąd odblokowywania modułu: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();
    console.log(`✅ Odblokowano moduł: ${moduleId}`);
    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Wystąpił nieoczekiwany błąd podczas odblokowywania modułu', undefined, error);
  }
}

/**
 * Używa serca przy błędzie w lekcji
 */
export async function useHeartOnBackend(lessonId: string): Promise<UseHeartResponse> {
  try {
    const token = await getToken();
    if (!token) {
      throw new ApiError('Brak tokenu autoryzacji', 401);
    }

    const data: UseHeartData = { lesson_id: lessonId };

    const response = await fetchWithTimeout(API_ENDPOINTS.useHeart(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      if (response.status === 400 && errorData.message?.includes('No hearts')) {
        throw new ApiError('Brak serc! Poczekaj na regenerację.', response.status);
      }

      throw new ApiError(
        errorData.message || `Błąd używania serca: ${response.statusText}`,
        response.status
      );
    }

    const responseData = await response.json();
    console.log(`💔 Użyto serca. Pozostało: ${responseData.hearts}/${responseData.max_hearts}`);
    return responseData;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Wystąpił nieoczekiwany błąd podczas używania serca', undefined, error);
  }
}
