import { DragSequence } from '@/components/lesson-types/drag-sequence';
import { FillBlank } from '@/components/lesson-types/fill-blank';
import { MatchPairs } from '@/components/lesson-types/match-pairs';
import { MultipleChoice } from '@/components/lesson-types/multiple-choice';
import { NodePicker } from '@/components/lesson-types/node-picker';
import { SwipeCards } from '@/components/lesson-types/swipe-cards';
import { Translate } from '@/components/lesson-types/translate';
import { TrueFalse } from '@/components/lesson-types/true-false';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { LessonHeader } from '@/components/ui/lesson-header';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

type LessonType = 
  | 'multiple-choice' 
  | 'translate' 
  | 'fill-blank'
  | 'match-pairs'
  | 'drag-sequence'
  | 'true-false'
  | 'swipe-cards'
  | 'node-picker';

interface LessonStep {
  type: LessonType;
  title: string;
  data: any;
  correctAnswer?: any;
}

const lessonSteps: LessonStep[] = [
  // 1. Multiple Choice
  {
    type: 'multiple-choice',
    title: '1. Wielokrotny wybór',
    data: {
      question: 'Który node odbiera dane z zewnętrznego API?',
      options: [
        { text: 'HTTP Request', icon: '🌐' },
        { text: 'Webhook', icon: '🪝' },
        { text: 'Set', icon: '⚙️' },
        { text: 'Email', icon: '📧' },
      ],
    },
    correctAnswer: 0,
  },

  // 2. True/False
  {
    type: 'true-false',
    title: '2. Prawda/Fałsz',
    data: {
      statement: 'Webhook może automatycznie triggerować workflow w n8n',
    },
    correctAnswer: true,
  },

  // 3. Match Pairs
  {
    type: 'match-pairs',
    title: '3. Dopasuj pary',
    data: {
      pairs: [
        { left: 'HTTP Request', leftIcon: '🌐', right: 'Pobiera dane z API' },
        { left: 'Webhook', leftIcon: '🪝', right: 'Odbiera eventy' },
        { left: 'Set', leftIcon: '⚙️', right: 'Manipuluje danymi' },
      ],
    },
    correctAnswer: null,
  },

  // 4. Drag Sequence
  {
    type: 'drag-sequence',
    title: '4. Ułóż w kolejności',
    data: {
      items: [
        { text: 'Webhook', icon: '🪝' },
        { text: 'IF', icon: '❓' },
        { text: 'Set', icon: '⚙️' },
        { text: 'Email', icon: '📧' },
      ],
      initialOrder: [0, 2, 1, 3],
      correctOrder: [0, 1, 2, 3],
    },
    correctAnswer: [0, 1, 2, 3],
  },

  // 5. Node Picker
  {
    type: 'node-picker',
    title: '5. Wybierz właściwy node',
    data: {
      task: 'Chcę wysłać wiadomość na Slacka',
      options: [
        { name: 'HTTP Request', icon: '🌐' },
        { name: 'Slack', icon: '💬' },
        { name: 'Email', icon: '📧' },
        { name: 'Webhook', icon: '🪝' },
      ],
    },
    correctAnswer: 1,
  },

  // 6. Fill Blank
  {
    type: 'fill-blank',
    title: '6. Uzupełnij lukę',
    data: {
      sentence: 'Aby dostać się do pola "email" w JSON używam: {{ $json.___ }}',
      placeholder: 'Wpisz odpowiedź...',
      correctAnswer: 'email',
    },
    correctAnswer: 'email',
  },

  // 7. Swipe Cards
  {
    type: 'swipe-cards',
    title: '7. Swipe Cards',
    data: {
      statement: 'Node "Set" może zapisywać dane bezpośrednio do bazy danych',
    },
    correctAnswer: false,
  },

  // 8. Translate (adaptacja)
  {
    type: 'translate',
    title: '8. Wybierz definicję',
    data: {
      sentence: 'Webhook to endpoint URL, który odbiera dane z zewnętrznych źródeł',
      instruction: 'Wybierz poprawne użycie webhook',
      options: [
        'Trigger workflow automatycznie',
        'Wysłać email',
        'Edytować dane',
      ],
    },
    correctAnswer: 0,
  },

  // 9. Multiple Choice (trudniejsze)
  {
    type: 'multiple-choice',
    title: '9. Scenariusz',
    data: {
      question: 'Masz workflow: Webhook → IF → Email. Kiedy email zostanie wysłany?',
      options: [
        { text: 'Zawsze', icon: '✅' },
        { text: 'Gdy IF = true', icon: '✔️' },
        { text: 'Gdy IF = false', icon: '❌' },
        { text: 'Nigdy', icon: '🚫' },
      ],
    },
    correctAnswer: 1,
  },

  // 10. True/False (końcowe)
  {
    type: 'true-false',
    title: '10. Finał',
    data: {
      statement: 'W n8n możesz łączyć nieograniczoną liczbę node\'ów w jednym workflow',
    },
    correctAnswer: true,
  },
];

export default function LessonDemoScreen() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<any>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [userOrder, setUserOrder] = useState<number[]>([]);
  const colorScheme = useColorScheme() ?? 'light';

  const totalSteps = lessonSteps.length;
  const progress = step / totalSteps;
  const currentLesson = lessonSteps[step];

  // Initialize userOrder for drag-sequence
  useState(() => {
    if (currentLesson.type === 'drag-sequence' && userOrder.length === 0) {
      setUserOrder(currentLesson.data.initialOrder);
    }
  });

  const handleSelect = (value: any) => {
    setSelected(value);
  };

  const handleTextAnswer = (answer: string) => {
    setTextAnswer(answer);
  };

  const handleMatchPairs = (leftIndex: number, rightIndex: number) => {
    if (leftIndex === rightIndex && !matchedPairs.includes(leftIndex)) {
      setMatchedPairs([...matchedPairs, leftIndex]);
      if (matchedPairs.length + 1 === currentLesson.data.pairs.length) {
        setShowResult(true);
      }
    }
  };

  const handleReorder = (newOrder: number[]) => {
    setUserOrder(newOrder);
  };

  const handleCheck = () => {
    setShowResult(true);
  };

  const handleContinue = () => {
    setShowResult(false);
    setSelected(null);
    setTextAnswer('');
    setMatchedPairs([]);
    
    if (step + 1 < totalSteps) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      // Initialize drag-sequence
      if (lessonSteps[nextStep].type === 'drag-sequence') {
        setUserOrder(lessonSteps[nextStep].data.initialOrder);
      }
    } else {
      setStep(step + 1);
    }
  };

  const isCorrect = () => {
    if (currentLesson.type === 'fill-blank') {
      return textAnswer.trim().toLowerCase() === String(currentLesson.correctAnswer).toLowerCase();
    }
    if (currentLesson.type === 'match-pairs') {
      return matchedPairs.length === currentLesson.data.pairs.length;
    }
    if (currentLesson.type === 'drag-sequence') {
      return JSON.stringify(userOrder) === JSON.stringify(currentLesson.correctAnswer);
    }
    return selected === currentLesson.correctAnswer;
  };

  const canCheck = () => {
    if (currentLesson.type === 'fill-blank') return textAnswer.trim().length > 0;
    if (currentLesson.type === 'match-pairs') return matchedPairs.length === currentLesson.data.pairs.length;
    if (currentLesson.type === 'drag-sequence') return true;
    if (currentLesson.type === 'swipe-cards') return selected !== null;
    return selected !== null;
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#fff' }]}>
      <ThemedView style={styles.container}>
        <LessonHeader progress={progress} hearts={5} gems={25} />

        <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollContentContainer}>
          {step < totalSteps ? (
            <View style={styles.questionContainer}>
              <ThemedText style={styles.stepTitle}>{currentLesson.title}</ThemedText>

              {currentLesson.type === 'multiple-choice' && (
                <MultipleChoice
                  question={currentLesson.data.question}
                  options={currentLesson.data.options}
                  selected={selected}
                  showResult={showResult}
                  correctIndex={currentLesson.correctAnswer}
                  onSelect={handleSelect}
                />
              )}

              {currentLesson.type === 'true-false' && (
                <TrueFalse
                  statement={currentLesson.data.statement}
                  selected={selected}
                  showResult={showResult}
                  correctAnswer={currentLesson.correctAnswer}
                  onSelect={handleSelect}
                />
              )}

              {currentLesson.type === 'match-pairs' && (
                <MatchPairs
                  pairs={currentLesson.data.pairs}
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
              )}

              {currentLesson.type === 'drag-sequence' && (
                <DragSequence
                  items={currentLesson.data.items}
                  userOrder={userOrder}
                  correctOrder={currentLesson.correctAnswer}
                  showResult={showResult}
                  onReorder={handleReorder}
                />
              )}

              {currentLesson.type === 'node-picker' && (
                <NodePicker
                  task={currentLesson.data.task}
                  options={currentLesson.data.options}
                  selected={selected}
                  showResult={showResult}
                  correctIndex={currentLesson.correctAnswer}
                  onSelect={handleSelect}
                />
              )}

              {currentLesson.type === 'fill-blank' && (
                <FillBlank
                  sentence={currentLesson.data.sentence}
                  placeholder={currentLesson.data.placeholder}
                  correctAnswer={currentLesson.data.correctAnswer}
                  showResult={showResult}
                  onAnswer={handleTextAnswer}
                />
              )}

              {currentLesson.type === 'swipe-cards' && (
                <SwipeCards
                  statement={currentLesson.data.statement}
                  onSwipe={handleSelect}
                  showFeedback={showResult}
                  wasCorrect={showResult ? isCorrect() : null}
                />
              )}

              {currentLesson.type === 'translate' && (
                <Translate
                  sentence={currentLesson.data.sentence}
                  instruction={currentLesson.data.instruction}
                  options={currentLesson.data.options}
                  selected={selected}
                  showResult={showResult}
                  correctIndex={currentLesson.correctAnswer}
                  onSelect={handleSelect}
                />
              )}
            </View>
          ) : (
            <View style={styles.successContainer}>
              <ThemedText style={styles.successIcon}>🎉</ThemedText>
              <ThemedText style={styles.successTitle}>Gratulacje!</ThemedText>
              <ThemedText style={styles.successText}>
                Przetestowałeś wszystkie 10 typów lekcji n8n
              </ThemedText>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {step < totalSteps && !showResult ? (
            <DuolingoButton
              title="Sprawdź"
              onPress={handleCheck}
              disabled={!canCheck()}
              variant={!canCheck() ? 'disabled' : 'primary'}
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
                  {isCorrect() ? '✓ Świetnie!' : '✗ Spróbuj jeszcze raz'}
                </ThemedText>
              </View>
              <DuolingoButton
                title={`Dalej (${step + 1}/${totalSteps})`}
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
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1cb0f6',
    marginBottom: 8,
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
    color: '#3c3c3c',
  },
  successText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#777',
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


