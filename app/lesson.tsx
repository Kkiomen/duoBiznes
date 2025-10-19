import { FillBlank } from '@/components/lesson-types/fill-blank';
import { MultipleChoice } from '@/components/lesson-types/multiple-choice';
import { Translate } from '@/components/lesson-types/translate';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { LessonHeader } from '@/components/ui/lesson-header';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { ErrorScreen } from '@/components/ui/error-screen';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCourse } from '@/contexts/CourseContext';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import type { LessonStep, MultipleChoiceContent, TranslateContent, FillBlankContent } from '@/types/course';

export default function LessonScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();
  const { getModuleById, course } = useCourse();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);

  // Pobierz moduł z kontekstu
  const module = moduleId ? getModuleById(moduleId) : null;

  // Jeśli nie ma modułu, pokaż błąd
  if (!moduleId) {
    return (
      <ErrorScreen
        error="Nie podano ID lekcji"
        onRetry={() => router.back()}
      />
    );
  }

  if (!course) {
    return <LoadingScreen message="Ładowanie kursu..." />;
  }

  if (!module) {
    return (
      <ErrorScreen
        error={`Nie znaleziono lekcji o ID: ${moduleId}`}
        onRetry={() => router.back()}
      />
    );
  }

  const lessonSteps = module.lessons;
  const totalSteps = lessonSteps.length;
  const progress = step / totalSteps;
  const currentLesson = lessonSteps[step];

  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleTextAnswer = (answer: string) => {
    setTextAnswer(answer);
  };

  const handleCheck = () => {
    if (currentLesson.type === 'fill-blank') {
      if (textAnswer.trim()) {
        setShowResult(true);
      }
    } else if (selected !== null) {
      setShowResult(true);
    }
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelected(null);
    setTextAnswer('');

    if (step < totalSteps - 1) {
      setStep((s) => s + 1);
    } else {
      // Koniec lekcji - wróć do ścieżki
      router.back();
    }
  };

  const isCorrect = (): boolean => {
    if (currentLesson.type === 'multiple-choice') {
      const content = currentLesson.content as MultipleChoiceContent;
      return selected === content.correctAnswer;
    } else if (currentLesson.type === 'translate') {
      const content = currentLesson.content as TranslateContent;
      return selected === (content.correctAnswer ?? 0);
    } else if (currentLesson.type === 'fill-blank') {
      const content = currentLesson.content as FillBlankContent;
      return textAnswer.trim().toLowerCase() === content.correctAnswer.toLowerCase();
    }
    return false;
  };

  const renderLessonContent = (lesson: LessonStep) => {
    switch (lesson.type) {
      case 'multiple-choice': {
        const content = lesson.content as MultipleChoiceContent;
        return (
          <MultipleChoice
            question={content.question}
            options={content.options}
            selected={selected}
            showResult={showResult}
            correctIndex={content.correctAnswer}
            onSelect={handleSelect}
          />
        );
      }

      case 'translate': {
        const content = lesson.content as TranslateContent;
        return (
          <Translate
            sentence={content.sentence}
            instruction={content.instruction}
            options={content.options}
            selected={selected}
            showResult={showResult}
            correctIndex={content.correctAnswer ?? 0}
            onSelect={handleSelect}
          />
        );
      }

      case 'fill-blank': {
        const content = lesson.content as FillBlankContent;
        return (
          <FillBlank
            sentence={content.sentence}
            placeholder={content.placeholder}
            correctAnswer={content.correctAnswer}
            showResult={showResult}
            onAnswer={handleTextAnswer}
          />
        );
      }

      // Dla innych typów lekcji (info, story, etc.) można dodać później
      default:
        return (
          <View>
            <ThemedText style={styles.notImplemented}>
              Typ lekcji "{lesson.type}" nie jest jeszcze zaimplementowany
            </ThemedText>
            <ThemedText style={styles.notImplementedHint}>
              Kliknij "Dalej" aby przejść do następnej lekcji
            </ThemedText>
          </View>
        );
    }
  };

  // Sprawdź czy aktualny lesson wymaga interakcji
  const requiresAnswer = (lesson: LessonStep): boolean => {
    return ['multiple-choice', 'translate', 'fill-blank', 'true-false', 'match-pairs', 'drag-sequence', 'node-picker', 'swipe-cards'].includes(lesson.type);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#fff' }]}>
      <ThemedView style={styles.container}>
        {/* Header z progress barem */}
        <LessonHeader progress={progress} hearts={5} gems={25} />

        {/* Question Area */}
        <View style={styles.content}>
          {step < totalSteps ? (
            <View style={styles.questionContainer}>
              {renderLessonContent(currentLesson)}
            </View>
          ) : (
            <View style={styles.successContainer}>
              <ThemedText style={styles.successIcon}>🎉</ThemedText>
              <ThemedText style={styles.successTitle}>Świetnie!</ThemedText>
              <ThemedText style={styles.successText}>
                Ukończyłeś lekcję: {module.moduleTitle}
              </ThemedText>
              <ThemedText style={styles.xpEarned}>
                +{module.totalXP} XP
              </ThemedText>
            </View>
          )}
        </View>

        {/* Bottom Button */}
        <View style={styles.footer}>
          {step < totalSteps && !showResult && requiresAnswer(currentLesson) ? (
            <DuolingoButton
              title="Sprawdź"
              onPress={handleCheck}
              disabled={
                currentLesson.type === 'fill-blank'
                  ? !textAnswer.trim()
                  : selected === null
              }
              variant={
                currentLesson.type === 'fill-blank'
                  ? (!textAnswer.trim() ? 'disabled' : 'primary')
                  : (selected === null ? 'disabled' : 'primary')
              }
            />
          ) : step < totalSteps && !showResult && !requiresAnswer(currentLesson) ? (
            // Dla lekcji bez interakcji (info, story, etc.)
            <DuolingoButton
              title="Dalej"
              onPress={handleContinue}
              variant="primary"
            />
          ) : step < totalSteps && showResult ? (
            <View style={styles.resultFooter}>
              <View style={[
                styles.resultBanner,
                { backgroundColor: isCorrect() ? '#d7ffb8' : '#ffdfe0' }
              ]}>
                <ThemedText style={[
                  styles.resultText,
                  { color: isCorrect() ? '#58a700' : '#ea2b2b' }
                ]}>
                  {isCorrect() ? `✓ Świetnie! +${currentLesson.xp ?? 10} XP` : '✗ Spróbuj jeszcze raz'}
                </ThemedText>
              </View>
              <DuolingoButton
                title="Dalej"
                onPress={handleContinue}
              />
            </View>
          ) : null}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  questionContainer: {
    gap: 24,
  },
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 60,
  },
  successIcon: {
    fontSize: 80,
  },
  successTitle: {
    fontSize: 32,
    fontWeight: '800',
  },
  successText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
  },
  xpEarned: {
    fontSize: 24,
    fontWeight: '800',
    color: '#58cc02',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
  },
  resultFooter: {
    gap: 12,
  },
  resultBanner: {
    padding: 16,
    borderRadius: 12,
  },
  resultText: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  notImplemented: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: '#777',
    marginBottom: 12,
  },
  notImplementedHint: {
    fontSize: 14,
    textAlign: 'center',
    color: '#999',
  },
});
