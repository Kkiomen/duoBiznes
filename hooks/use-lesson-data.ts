import { LessonModule } from '@/types/lesson';
import { useEffect, useState } from 'react';

// Symulacja fetch z API - obecnie ładuje lokalny JSON
// W przyszłości wystarczy zmienić na: fetch('https://api.example.com/lessons/${moduleId}')
export function useLessonData(moduleId: string) {
  const [data, setData] = useState<LessonModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        setLoading(true);
        setError(null);

        // Symuluj opóźnienie sieciowe
        await new Promise(resolve => setTimeout(resolve, 500));

        // Załaduj lokalny JSON - w przyszłości zamień na fetch()
        const lessonData = await loadLocalLesson(moduleId);

        if (!lessonData) {
          throw new Error(`Moduł ${moduleId} nie został znaleziony`);
        }

        setData(lessonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Błąd ładowania lekcji');
        console.error('Error loading lesson:', err);
      } finally {
        setLoading(false);
      }
    }

    void loadLesson();
  }, [moduleId]);

  return { data, loading, error };
}

// Helper function do ładowania lokalnego JSON
// W przyszłości usuń tę funkcję i użyj bezpośrednio fetch()
async function loadLocalLesson(moduleId: string): Promise<LessonModule | null> {
  try {
    // Mapowanie moduleId na pliki JSON
    const moduleFiles: Record<string, any> = {
      'n8n-basics': require('@/data/lessons/n8n-module-1.json'),
      'n8n-lesson-1': require('@/data/lessons/lesson-1-czym-jest-n8n.json'),
      'n8n-lesson-2': require('@/data/lessons/lesson-2-podstawy-workflow.json'),
      'n8n-lesson-3': require('@/data/lessons/lesson-3-nody-w-n8n.json'),
      'n8n-lesson-4': require('@/data/lessons/lesson-4-webhook-triggery.json'),
      'n8n-lesson-5': require('@/data/lessons/lesson-5-praca-z-danymi.json'),
      'n8n-lesson-6': require('@/data/lessons/lesson-6-pierwszy-workflow.json'),
    };

    return moduleFiles[moduleId] || null;
  } catch (err) {
    console.error('Error loading local lesson:', err);
    return null;
  }
}

// Funkcja pomocnicza do przyszłego fetch z API
export async function fetchLessonFromAPI(moduleId: string): Promise<LessonModule> {
  // Przykład jak będzie wyglądać w przyszłości:
  const response = await fetch(`https://api.example.com/lessons/${moduleId}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data: LessonModule = await response.json();
  return data;
}
