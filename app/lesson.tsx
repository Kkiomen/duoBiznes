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
import { useLesson } from '@/hooks/use-lesson';
import { useProfile } from '@/hooks/use-profile';
import { useCourse } from '@/contexts/CourseContext';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Alert } from 'react-native';
import type { MultipleChoiceContent, TranslateContent, FillBlankContent } from '@/types/course';
import type { LessonItem, LessonCompletionResponse } from '@/types/lesson';
import { requiresAnswerCheck } from '@/utils/lesson-helpers';

export default function LessonScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const { moduleId } = useLocalSearchParams<{ moduleId: string }>();

  const {
    lesson,
    loading,
    error,
    currentStep,
    totalSteps,
    mistakes,
    earnedXP,
    progress,
    currentLesson,
    isLastStep,
    isCompleted,
    nextStep,
    recordMistake,
    recordCorrect,
    completeLesson,
    resumeLesson,
    resetLesson,
    skipStep,
    hasResumeData,
    resumeData,
  } = useLesson(moduleId || '');

  const { profile, actions: profileActions } = useProfile();
  const { refresh: refreshCourse } = useCourse();

  const [selected, setSelected] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [completionData, setCompletionData] = useState<LessonCompletionResponse | null>(null);

  // Pokazuj dialog wznowienia tylko raz
  useEffect(() => {
    if (hasResumeData && resumeData) {
      Alert.alert(
        'Wznowić naukę?',
        `Masz niezakończoną lekcję (krok ${resumeData.currentStep + 1}/${totalSteps})`,
        [
          {
            text: 'Zacznij od nowa',
            onPress: () => resetLesson(),
            style: 'destructive',
          },
          {
            text: 'Wznów',
            onPress: () => resumeLesson(),
          },
        ]
      );
    }
  }, [hasResumeData]);

  // Sprawdź czy nie ma modułu ID
  if (!moduleId) {
    return (
      <ErrorScreen
        error="Nie podano ID lekcji"
        onRetry={() => router.back()}
      />
    );
  }

  // Loading state
  if (loading && !lesson) {
    return <LoadingScreen message="Ładowanie lekcji..." />;
  }

  // Error state
  if (error && !lesson) {
    return (
      <ErrorScreen
        error={error.message}
        onRetry={() => router.back()}
      />
    );
  }

  // Brak lekcji
  if (!lesson) {
    return (
      <ErrorScreen
        error="Nie udało się załadować lekcji"
        onRetry={() => router.back()}
      />
    );
  }

  // Handlers
  const handleSelect = (index: number) => {
    setSelected(index);
  };

  const handleTextAnswer = (answer: string) => {
    setTextAnswer(answer);
  };

  const handleCheck = () => {
    if (!currentLesson) return;

    if (currentLesson.type === 'fill-blank') {
      if (textAnswer.trim()) {
        setShowResult(true);
      }
    } else if (selected !== null) {
      setShowResult(true);
    }
  };

  const handleContinue = async () => {
    if (!currentLesson) return;

    const correct = isCorrect();

    if (showResult) {
      // Po sprawdzeniu odpowiedzi
      if (correct) {
        recordCorrect(); // Dodaj XP jeśli ma
      } else {
        const heartUsed = await recordMistake(); // Użyj serca
        if (!heartUsed) {
          // Brak serc - pokaż alert
          Alert.alert(
            'Brak serc!',
            'Nie masz już serc. Poczekaj na regenerację lub wróć później.',
            [
              {
                text: 'OK',
                onPress: () => router.back(),
              },
            ]
          );
          return;
        }
      }
    }

    // Reset state
    setShowResult(false);
    setSelected(null);
    setTextAnswer('');

    if (isLastStep) {
      // Ostatni krok - wyślij completion
      console.log('🎉 Kończenie lekcji...');
      const response = await completeLesson();
      if (response) {
        setCompletionData(response);

        // Odśwież dane TERAZ - podczas wyświetlania gratulacji
        // Użytkownik ma czas na oglądanie success screen, a dane będą gotowe gdy wróci
        console.log('🔄 Odświeżanie danych kursu (backend zmienił is_locked)...');
        refreshCourse().catch(err => {
          console.error('⚠️ Błąd odświeżania kursu:', err);
        });

        console.log('🔄 Odświeżanie profilu użytkownika...');
        profileActions.refreshProfile().catch(err => {
          console.error('⚠️ Błąd odświeżania profilu:', err);
        });
      }
    } else {
      // Następny krok
      nextStep();
    }
  };

  const handleSkip = () => {
    skipStep();
    setSelected(null);
    setTextAnswer('');
    setShowResult(false);
  };

  // Sprawdź czy odpowiedź jest poprawna
  const isCorrect = (): boolean => {
    if (!currentLesson) return false;

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

  // Render lesson content
  const renderLessonContent = (lessonItem: LessonItem) => {
    switch (lessonItem.type) {
      case 'multiple-choice': {
        const content = lessonItem.content as MultipleChoiceContent;
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
        const content = lessonItem.content as TranslateContent;
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
        const content = lessonItem.content as FillBlankContent;
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

      // Dla innych typów lekcji (info, story, etc.)
      default:
        return (
          <View>
            <ThemedText style={styles.notImplemented}>
              Typ lekcji "{lessonItem.type}" nie jest jeszcze zaimplementowany
            </ThemedText>
            <ThemedText style={styles.notImplementedHint}>
              Kliknij "Dalej" aby przejść do następnej lekcji
            </ThemedText>
          </View>
        );
    }
  };

  // Success screen po zakończeniu
  if (isCompleted && completionData) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#fff' }]}>
        <ThemedView style={styles.container}>
          <View style={styles.successContainer}>
            <ThemedText style={styles.successIcon}>🎉</ThemedText>
            <ThemedText style={styles.successTitle}>Świetnie!</ThemedText>
            <ThemedText style={styles.successText}>
              Ukończyłeś lekcję: {lesson.moduleTitle}
            </ThemedText>

            {/* XP Earned */}
            <ThemedText style={styles.xpEarned}>
              +{completionData.data.xp_added} XP
            </ThemedText>

            {/* Level Up */}
            {completionData.data.level_up && (
              <View style={styles.levelUp}>
                <ThemedText style={styles.levelUpText}>
                  🎊 Level {completionData.data.new_level}!
                </ThemedText>
              </View>
            )}

            {/* Achievementy */}
            {completionData.data.achievements_unlocked.length > 0 && (
              <View style={styles.achievementsContainer}>
                <ThemedText style={styles.achievementsTitle}>🏆 Nowe osiągnięcia:</ThemedText>
                {completionData.data.achievements_unlocked.map((achievement) => (
                  <View key={achievement.id} style={styles.achievementItem}>
                    <ThemedText style={styles.achievementIcon}>{achievement.icon}</ThemedText>
                    <ThemedText style={styles.achievementTitle}>{achievement.title}</ThemedText>
                  </View>
                ))}
              </View>
            )}

            {/* Unlocked Modules */}
            {completionData.data.unlocked_modules.length > 0 && (
              <View style={styles.unlockedContainer}>
                <ThemedText style={styles.unlockedTitle}>
                  🔓 Odblokowano: {completionData.data.unlocked_modules.join(', ')}
                </ThemedText>
              </View>
            )}

            {/* Stats */}
            <View style={styles.statsContainer}>
              <ThemedText style={styles.statItem}>
                ❤️ Serca: {completionData.data.stats.hearts}
              </ThemedText>
              <ThemedText style={styles.statItem}>
                🔥 Passa: {completionData.data.stats.streak} dni
              </ThemedText>
              <ThemedText style={styles.statItem}>
                📚 Lekcje: {completionData.data.stats.total_lessons_completed}
              </ThemedText>
            </View>

            {/* Continue Button */}
            <View style={styles.footer}>
              <DuolingoButton
                title="Kontynuuj"
                onPress={() => router.back()}
                variant="primary"
              />
            </View>
          </View>
        </ThemedView>
      </SafeAreaView>
    );
  }

  // Main lesson screen
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#fff' }]}>
      <ThemedView style={styles.container}>
        {/* Header z progress barem */}
        <LessonHeader
          progress={progress}
          hearts={profile?.stats.hearts ?? 5}
          gems={earnedXP}
        />

        {/* Question Area */}
        <View style={styles.content}>
          {currentLesson ? (
            <View style={styles.questionContainer}>
              {renderLessonContent(currentLesson)}
            </View>
          ) : (
            <View style={styles.questionContainer}>
              <ThemedText style={styles.notImplemented}>
                Brak kolejnych kroków w lekcji
              </ThemedText>
            </View>
          )}
        </View>

        {/* Bottom Button */}
        <View style={styles.footer}>
          {currentLesson && !showResult && requiresAnswerCheck(currentLesson.type) ? (
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
          ) : currentLesson && !showResult && !requiresAnswerCheck(currentLesson.type) ? (
            // Dla lekcji bez interakcji (info, story, etc.)
            <DuolingoButton
              title="Dalej"
              onPress={handleSkip}
              variant="primary"
            />
          ) : currentLesson && showResult ? (
            <View style={styles.resultFooter}>
              <View style={[
                styles.resultBanner,
                { backgroundColor: isCorrect() ? '#d7ffb8' : '#ffdfe0' }
              ]}>
                <ThemedText style={[
                  styles.resultText,
                  { color: isCorrect() ? '#58a700' : '#ea2b2b' }
                ]}>
                  {isCorrect()
                    ? `✓ Świetnie! ${currentLesson.xp ? `+${currentLesson.xp} XP` : ''}`
                    : '✗ Niepoprawnie. Tracisz serce 💔'}
                </ThemedText>
              </View>
              <DuolingoButton
                title={isLastStep ? 'Zakończ' : 'Dalej'}
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
    paddingTop: 40,
    paddingHorizontal: 20,
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
    fontSize: 28,
    fontWeight: '800',
    color: '#58cc02',
  },
  levelUp: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 8,
  },
  levelUpText: {
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  achievementsContainer: {
    marginTop: 16,
    gap: 12,
    alignItems: 'center',
  },
  achievementsTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  achievementIcon: {
    fontSize: 24,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  unlockedContainer: {
    marginTop: 16,
  },
  unlockedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#58cc02',
  },
  statsContainer: {
    marginTop: 20,
    gap: 8,
    alignItems: 'center',
  },
  statItem: {
    fontSize: 14,
    color: '#777',
  },
  footer: {
    padding: 20,
    paddingBottom: 32,
    width: '100%',
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
