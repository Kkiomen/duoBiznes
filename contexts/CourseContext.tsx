import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Course, Module } from '@/types/course';
import { fetchCourseData, findModuleById, ApiError } from '@/services/api';

/**
 * Stan kontekstu kursu
 */
interface CourseContextState {
  // Dane kursu
  course: Course | null;

  // Stany ładowania i błędów
  loading: boolean;
  error: string | null;
  initialLoadComplete: boolean;
  updating: boolean; // True gdy dane aktualizują się w tle (bez loadingu)

  // Akcje
  loadCourse: (courseId: number, forceRefresh?: boolean) => Promise<void>;
  retry: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;

  // Helpery
  getModuleById: (moduleId: string) => Module | undefined;
}

/**
 * Domyślny stan kontekstu
 */
const defaultState: CourseContextState = {
  course: null,
  loading: false,
  error: null,
  initialLoadComplete: false,
  updating: false,
  loadCourse: async () => {},
  retry: async () => {},
  refresh: async () => {},
  clearError: () => {},
  getModuleById: () => undefined,
};

const CourseContext = createContext<CourseContextState>(defaultState);

/**
 * Hook do użycia kontekstu kursu
 */
export function useCourse() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse musi być użyty wewnątrz CourseProvider');
  }
  return context;
}

/**
 * Props dla CourseProvider
 */
interface CourseProviderProps {
  children: ReactNode;
  defaultCourseId?: number; // Domyślny kurs do załadowania
  autoLoad?: boolean; // Automatycznie załaduj przy montowaniu
}

/**
 * Provider kontekstu kursu
 */
export function CourseProvider({
  children,
  defaultCourseId = 1,
  autoLoad = true,
}: CourseProviderProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [lastCourseId, setLastCourseId] = useState<number>(defaultCourseId);

  /**
   * Ładuje dane kursu z API lub cache
   * Używa strategii stale-while-revalidate:
   * - Jeśli jest cache → pokazuje cache natychmiast + aktualizuje w tle
   * - Jeśli nie ma cache → pokazuje loading + pobiera z API
   */
  const loadCourse = async (courseId: number, forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setLastCourseId(courseId);

    try {
      const courseData = await fetchCourseData(courseId, forceRefresh, {
        // Wywołane gdy zwracamy dane z cache
        onCacheHit: () => {
          console.log('📦 Cache hit - zaczynam background update');
          setUpdating(true);
        },
        // Wywołane gdy background update się kończy
        onBackgroundUpdate: (freshData: Course) => {
          console.log('🔄 Cicha aktualizacja danych w tle');
          setCourse(freshData);
          setUpdating(false);
          // NIE ustawiamy loading=true, żeby nie było migania spinnera
        },
      });

      setCourse(courseData);
      setError(null);
    } catch (err) {
      console.error('Błąd ładowania kursu:', err);

      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Wystąpił nieoczekiwany błąd podczas ładowania kursu');
      }

      // Nie czyścimy course - może być stary cache
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
  };

  /**
   * Ponawia ostatnie ładowanie
   */
  const retry = async () => {
    await loadCourse(lastCourseId, true);
  };

  /**
   * Odświeża dane (force refresh)
   */
  const refresh = async () => {
    await loadCourse(lastCourseId, true);
  };

  /**
   * Czyści błąd
   */
  const clearError = () => {
    setError(null);
  };

  /**
   * Znajduje moduł po ID
   */
  const getModuleById = (moduleId: string): Module | undefined => {
    if (!course) return undefined;
    return findModuleById(course, moduleId);
  };

  /**
   * Automatyczne ładowanie przy montowaniu
   */
  useEffect(() => {
    if (autoLoad && !initialLoadComplete) {
      loadCourse(defaultCourseId);
    }
  }, [autoLoad, defaultCourseId, initialLoadComplete]);

  const value: CourseContextState = {
    course,
    loading,
    error,
    initialLoadComplete,
    updating,
    loadCourse,
    retry,
    refresh,
    clearError,
    getModuleById,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
}
