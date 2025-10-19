import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_ENDPOINTS, CACHE_CONFIG, REQUEST_TIMEOUT } from '@/constants/api';
import type { Course, Module } from '@/types/course';
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

    const data = await response.json();
    return data as Course;
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
