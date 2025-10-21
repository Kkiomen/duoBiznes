import { Platform } from 'react-native';

/**
 * Konfiguracja URL API
 *
 * React Native wymaga różnych URL dla różnych platform:
 * - Android emulator: 10.0.2.2 zamiast localhost
 * - iOS simulator: localhost działa normalnie
 * - Fizyczne urządzenie: IP komputera w sieci lokalnej
 */

// Port na którym działa backend
const API_PORT = 8000;

/**
 * Zwraca odpowiedni base URL w zależności od platformy
 */
function getBaseUrl(): string {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator używa 10.0.2.2 jako localhost
      return `http://10.0.2.2:${API_PORT}`;
    } else if (Platform.OS === 'ios') {
      // iOS simulator może używać localhost
      return `http://localhost:${API_PORT}`;
    } else if (Platform.OS === 'web') {
      // Web development
      return `http://localhost:${API_PORT}`;
    }
  }

  // Production mode - zmień na swój produkcyjny URL
  // TODO: Ustaw produkcyjny URL gdy będziesz wdrażać
  return `http://localhost:${API_PORT}`;
}

export const API_BASE_URL = getBaseUrl();

/**
 * Endpointy API
 */
export const API_ENDPOINTS = {
  /**
   * Pobiera pełne dane kursu z wszystkimi modułami i lekcjami
   */
  getCourse: (courseId: number) => `${API_BASE_URL}/api/courses/${courseId}/full`,

  /**
   * Pobiera pojedynczą lekcję/moduł po ID
   */
  getLesson: (moduleId: string) => `${API_BASE_URL}/api/lessons/${moduleId}`,

  /**
   * Pobiera profil użytkownika
   */
  getUserProfile: () => `${API_BASE_URL}/api/profile`,

  /**
   * Aktualizuje postęp użytkownika
   */
  updateUserProgress: () => `${API_BASE_URL}/api/user/progress`,

  // ========================================
  // Authentication Endpoints
  // ========================================

  /**
   * Rejestracja nowego użytkownika
   */
  register: () => `${API_BASE_URL}/api/auth/register`,

  /**
   * Logowanie użytkownika
   */
  login: () => `${API_BASE_URL}/api/auth/login`,

  /**
   * Logowanie przez Google OAuth
   */
  googleAuth: () => `${API_BASE_URL}/api/auth/google`,

  /**
   * Pobiera aktualnie zalogowanego użytkownika
   */
  me: () => `${API_BASE_URL}/api/auth/me`,

  /**
   * Wylogowanie z bieżącego urządzenia
   */
  logout: () => `${API_BASE_URL}/api/auth/logout`,

  /**
   * Wylogowanie ze wszystkich urządzeń
   */
  logoutAll: () => `${API_BASE_URL}/api/auth/logout-all`,

  // ========================================
  // Progress & Learning Endpoints
  // ========================================

  /**
   * Zapisanie ukończonej lekcji
   */
  saveLessonProgress: () => `${API_BASE_URL}/api/progress/lesson`,

  /**
   * Dodanie XP (bonusy, eventy)
   */
  addXP: () => `${API_BASE_URL}/api/progress/xp`,

  /**
   * Odblokowanie modułu
   */
  unlockModule: () => `${API_BASE_URL}/api/progress/unlock-module`,

  /**
   * Użycie serca (przy błędzie)
   */
  useHeart: () => `${API_BASE_URL}/api/progress/use-heart`,
};

/**
 * Konfiguracja cache
 */
export const CACHE_CONFIG = {
  // Czas życia cache w milisekundach (24 godziny)
  TTL: 24 * 60 * 60 * 1000,

  // Klucze AsyncStorage
  KEYS: {
    COURSE_DATA: 'course_data',
    COURSE_TIMESTAMP: 'course_timestamp',
    USER_PROFILE: 'user_profile',
  },
};

/**
 * Timeout dla requestów (10 sekund)
 */
export const REQUEST_TIMEOUT = 10000;
