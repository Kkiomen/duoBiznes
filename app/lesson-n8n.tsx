import { ArticleCard } from '@/components/lesson-types/article-card';
import { ChallengeIntro } from '@/components/lesson-types/challenge-intro';
import { DiagramCard } from '@/components/lesson-types/diagram-card';
import { DragSequence } from '@/components/lesson-types/drag-sequence';
import { ExampleCard } from '@/components/lesson-types/example-card';
import { FillBlank } from '@/components/lesson-types/fill-blank';
import { InfoCard } from '@/components/lesson-types/info-card';
import { MatchPairs } from '@/components/lesson-types/match-pairs';
import { MultipleChoice } from '@/components/lesson-types/multiple-choice';
import { NodePicker } from '@/components/lesson-types/node-picker';
import { StoryCard } from '@/components/lesson-types/story-card';
import { SwipeCards } from '@/components/lesson-types/swipe-cards';
import { TipCard } from '@/components/lesson-types/tip-card';
import { Translate } from '@/components/lesson-types/translate';
import { TrueFalse } from '@/components/lesson-types/true-false';
import { ThemedText } from '@/components/themed-text';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { LessonHeader } from '@/components/ui/lesson-header';
import { LessonSuccess } from '@/components/ui/lesson-success';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCourse } from '@/contexts/CourseContext';
import { useProfile } from '@/hooks/use-profile';
import { LessonStep } from '@/types/course';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function LessonN8nScreen() {
  const { moduleId = 'n8n-basics' } = useLocalSearchParams<{ moduleId?: string }>();
  const { getModuleById, course, loading: courseLoading, refresh } = useCourse();
  const { profile, actions } = useProfile();

  const lessonModule = moduleId ? getModuleById(moduleId) : null;
  const loading = courseLoading;
  const error = !lessonModule && !courseLoading ? `Nie znaleziono modułu: ${moduleId}` : null;
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const [earnedXP, setEarnedXP] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime] = useState(Date.now());
  const lessonCompletedRef = useRef(false);
  const colorScheme = useColorScheme() ?? 'light';
  const router = useRouter();

  // Complete lesson when finished - MUST be before any conditional returns
  useEffect(() => {
    if (!lessonModule || loading) return;
    
    const totalSteps = lessonModule.lessons.length;
    if (step >= totalSteps && !lessonCompletedRef.current && earnedXP > 0) {
      lessonCompletedRef.current = true;

      const timeSpentMinutes = Math.round((Date.now() - startTime) / 1000 / 60);
      const totalQuestions = lessonModule.lessons.filter((l) =>
        [
          'multiple-choice',
          'true-false',
          'match-pairs',
          'drag-sequence',
          'node-picker',
          'fill-blank',
          'swipe-cards',
          'translate',
        ].includes(l.type)
      ).length;
      const correctAnswers = totalQuestions - mistakes;
      const accuracy = totalQuestions > 0 ? correctAnswers / totalQuestions : 1;
      const score = Math.round(accuracy * 100);

      // Save lesson completion to profile
      actions.completeLesson({
        lessonId: moduleId,
        moduleId: moduleId,
        score,
        accuracy,
        xpEarned: earnedXP,
        timeSpentMinutes: Math.max(1, timeSpentMinutes),
        mistakes,
      });

      // Odśwież dane kursu - backend zmienił is_locked dla kolejnej lekcji
      console.log('🔄 Odświeżanie danych kursu po ukończeniu...');
      refresh().catch(err => {
        console.error('⚠️ Błąd odświeżania kursu:', err);
      });
    }
  }, [step, earnedXP, mistakes, moduleId, lessonModule, startTime, actions, loading, refresh]);

  // Initialize userOrder for drag-sequence - MUST be before any conditional returns
  useEffect(() => {
    if (!lessonModule || loading) return;
    
    const currentLesson = lessonModule.lessons[step];
    if (currentLesson?.type === 'drag-sequence' && userOrder.length === 0 && currentLesson.content) {
      const content = currentLesson.content as any;
      if (content?.initialOrder) {
        setUserOrder(content.initialOrder);
      }
    }
  }, [step, lessonModule, userOrder.length, loading]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? 'rgb(19, 29, 45)' : '#F8FAFC' }]}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#58CC02" />
          <ThemedText style={styles.loadingText}>Ładowanie lekcji...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !lessonModule) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? 'rgb(19, 29, 45)' : '#F8FAFC' }]}>
        <View style={styles.centerContainer}>
          <ThemedText style={styles.errorText}>❌ {error || 'Nie znaleziono lekcji'}</ThemedText>
          <DuolingoButton title="Wróć" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const totalSteps = lessonModule.lessons.length;
  const progress = step / totalSteps;
  const currentLesson = lessonModule.lessons[step];

  const isInteractiveLesson = (lesson: LessonStep): boolean => {
    return [
      'multiple-choice',
      'true-false',
      'match-pairs',
      'drag-sequence',
      'node-picker',
      'fill-blank',
      'swipe-cards',
      'translate',
    ].includes(lesson.type);
  };

  const isContentOnly = (lesson: LessonStep): boolean => {
    return ['story', 'info', 'tip', 'example', 'diagram', 'challenge-intro', 'article'].includes(lesson.type);
  };

  const handleSelect = (value: any) => {
    setSelected(value);
  };

  const handleTextAnswer = (answer: string) => {
    setTextAnswer(answer);
  };

  const handleMatchPairs = (leftIndex: number, rightIndex: number) => {
    if (!currentLesson?.content) return;
    const content = currentLesson.content as any;
    if (leftIndex === rightIndex && !matchedPairs.includes(leftIndex)) {
      const newMatched = [...matchedPairs, leftIndex];
      setMatchedPairs(newMatched);
      if (content?.pairs && newMatched.length === content.pairs.length) {
        setShowResult(true);
      }
    }
  };

  const handleReorder = (newOrder: number[]) => {
    setUserOrder(newOrder);
  };

  const handleCheck = async () => {
    setShowResult(true);
    if (isCorrect() && currentLesson.xp) {
      setEarnedXP(earnedXP + currentLesson.xp);
    } else if (!isCorrect()) {
      // Wrong answer - use a heart
      const hasHeart = await actions.useHeart();
      setMistakes(mistakes + 1);

      if (!hasHeart) {
        // No hearts left - could show a modal or redirect
        // For now, just continue
      }
    }
  };

  const handleContinue = () => {
    // Reset state
    setShowResult(false);
    setSelected(null);
    setTextAnswer('');
    setMatchedPairs([]);
    setUserOrder([]);

    if (step + 1 < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);

      // Initialize next lesson if drag-sequence
      const nextLesson = lessonModule.lessons[nextStep];
      if (nextLesson?.type === 'drag-sequence' && nextLesson.content) {
        const content = nextLesson.content as any;
        if (content?.initialOrder) {
          setUserOrder(content.initialOrder);
        }
      }
    } else {
      // Lekcja ukończona
      setStep(step + 1);
    }
  };

  const isCorrect = (): boolean => {
    if (!currentLesson?.content) return false;
    const content = currentLesson.content as any;

    switch (currentLesson.type) {
      case 'fill-blank':
        return textAnswer.trim().toLowerCase() === String(content.correctAnswer).toLowerCase();
      case 'match-pairs':
        return matchedPairs.length === content.pairs.length;
      case 'drag-sequence':
        return JSON.stringify(userOrder) === JSON.stringify(content.correctOrder);
      case 'multiple-choice':
      case 'true-false':
      case 'node-picker':
      case 'translate':
      case 'swipe-cards':
        return selected === content.correctAnswer;
      default:
        return false;
    }
  };

  const canCheck = (): boolean => {
    if (!currentLesson) return false;
    if (currentLesson.type === 'fill-blank') return textAnswer.trim().length > 0;
    if (currentLesson.type === 'match-pairs') {
      if (!currentLesson.content) return false;
      const content = currentLesson.content as any;
      return matchedPairs.length === content?.pairs?.length;
    }
    if (currentLesson.type === 'drag-sequence') return true;
    return selected !== null;
  };

  const renderLesson = (lesson: LessonStep) => {
    if (!lesson || !lesson.content) {
      return <ThemedText>Brak danych lekcji</ThemedText>;
    }

    const content = lesson.content as any;

    switch (lesson.type) {
      // Content types
      case 'story':
        return <StoryCard {...content} />;
      case 'info':
        return <InfoCard {...content} />;
      case 'tip':
        return <TipCard {...content} />;
      case 'example':
        return <ExampleCard {...content} />;
      case 'diagram':
        return <DiagramCard {...content} />;
      case 'challenge-intro':
        return <ChallengeIntro {...content} />;
      case 'article':
        return <ArticleCard {...content} />;

      // Interactive types
      case 'multiple-choice':
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
      case 'true-false':
        return (
          <TrueFalse
            statement={content.statement}
            selected={selected}
            showResult={showResult}
            correctAnswer={content.correctAnswer}
            onSelect={handleSelect}
          />
        );
      case 'match-pairs':
        return (
          <MatchPairs
            pairs={content.pairs}
            selected={selected}
            matched={matchedPairs}
            showResult={showResult}
            onSelectLeft={(i) => {
              if (selected?.rightIndex !== undefined) {
                handleMatchPairs(i, selected.rightIndex);
                setSelected(null);
              } else {
                setSelected({ leftIndex: i });
              }
            }}
            onSelectRight={(i) => {
              if (selected?.leftIndex !== undefined) {
                handleMatchPairs(selected.leftIndex, i);
                setSelected(null);
              } else {
                setSelected({ rightIndex: i });
              }
            }}
          />
        );
      case 'drag-sequence':
        return (
          <DragSequence
            items={content.items}
            userOrder={userOrder}
            correctOrder={content.correctOrder}
            showResult={showResult}
            onReorder={handleReorder}
          />
        );
      case 'node-picker':
        return (
          <NodePicker
            task={content.task}
            options={content.options}
            selected={selected}
            showResult={showResult}
            correctIndex={content.correctAnswer}
            onSelect={handleSelect}
          />
        );
      case 'fill-blank':
        return (
          <FillBlank
            sentence={content.sentence}
            placeholder={content.placeholder}
            correctAnswer={content.correctAnswer}
            showResult={showResult}
            onAnswer={handleTextAnswer}
          />
        );
      case 'swipe-cards':
        return (
          <SwipeCards
            statement={content.statement}
            onSwipe={handleSelect}
            showFeedback={showResult}
            wasCorrect={showResult ? isCorrect() : null}
          />
        );
      case 'translate':
        return (
          <Translate
            sentence={content.sentence}
            instruction={content.instruction}
            options={content.options}
            selected={selected}
            showResult={showResult}
            correctIndex={content.correctAnswer}
            onSelect={handleSelect}
          />
        );
      default:
        return <ThemedText>Nieznany typ lekcji</ThemedText>;
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? 'rgb(19, 29, 45)' : '#F8FAFC' }]}>
      <View style={styles.container}>
        <LessonHeader progress={progress} hearts={profile?.stats.hearts ?? 5} gems={profile?.stats.xp ?? 0} />

        <ScrollView
          style={styles.scrollContent}
          contentContainerStyle={styles.scrollContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {step < totalSteps ? (
            <View style={styles.questionContainer}>{renderLesson(currentLesson)}</View>
          ) : (
            <LessonSuccess
              title="Gratulacje!"
              message={`Ukończyłeś moduł: ${lessonModule.moduleTitle}`}
              xpEarned={earnedXP}
            />
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step < totalSteps && isContentOnly(currentLesson) ? (
            <DuolingoButton title="Dalej" onPress={handleContinue} variant="primary" />
          ) : step < totalSteps && isInteractiveLesson(currentLesson) && !showResult ? (
            <DuolingoButton
              title="Sprawdź"
              onPress={handleCheck}
              disabled={!canCheck()}
              variant={!canCheck() ? 'disabled' : 'primary'}
            />
          ) : step < totalSteps && showResult ? (
            <View style={styles.resultFooter}>
              <View
                style={[styles.resultBanner, { backgroundColor: isCorrect() ? '#d7ffb8' : '#ffdfe0' }]}
              >
                <ThemedText
                  style={[styles.resultText, { color: isCorrect() ? '#58a700' : '#ea2b2b' }]}
                >
                  {isCorrect()
                    ? `✓ Świetnie! +${currentLesson.xp || 0} XP`
                    : '✗ Spróbuj jeszcze raz'}
                </ThemedText>
              </View>
              <DuolingoButton title={`Dalej (${step + 1}/${totalSteps})`} onPress={handleContinue} />
            </View>
          ) : step >= totalSteps ? (
            <DuolingoButton title="Zakończ" onPress={() => router.back()} variant="primary" />
          ) : null}
        </View>
      </View>
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF4B4B',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  questionContainer: {
    gap: 16,
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
    color: '#FFFFFF',
  },
  successText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#D1D5DB',
  },
  xpText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#58CC02',
    marginTop: 12,
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
});
