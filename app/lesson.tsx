import { FillBlank } from '@/components/lesson-types/fill-blank';
import { MultipleChoice } from '@/components/lesson-types/multiple-choice';
import { Translate } from '@/components/lesson-types/translate';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { LessonHeader } from '@/components/ui/lesson-header';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

type LessonType = 'multiple-choice' | 'translate' | 'fill-blank';

interface LessonStep {
  type: LessonType;
  data: any;
  correctAnswer: number | string;
}

const lessonSteps: LessonStep[] = [
  {
    type: 'multiple-choice',
    data: {
      question: 'Co oznacza skrót LLM?',
      options: [
        { text: 'Large Language Model', icon: '🤖' },
        { text: 'Long Logic Machine', icon: '⚙️' },
        { text: 'Latent Linear Map', icon: '📊' },
        { text: 'Language Learning Method', icon: '📚' },
      ],
    },
    correctAnswer: 0,
  },
  {
    type: 'translate',
    data: {
      sentence: 'Token to fragment tekstu przetwarzany przez model AI',
      instruction: 'Wybierz prawidłowe tłumaczenie',
      options: [
        'A token is a piece of text',
        'A token is a complete sentence',
        'A token is a file',
      ],
    },
    correctAnswer: 0,
  },
  {
    type: 'fill-blank',
    data: {
      sentence: 'GPT-4 jest przykładem ___ modelu językowego.',
      placeholder: 'Wpisz odpowiedź...',
      correctAnswer: 'dużego',
    },
    correctAnswer: 'dużego',
  },
  {
    type: 'multiple-choice',
    data: {
      question: 'Który z tych jest modelem AI od OpenAI?',
      options: [
        { text: 'GPT', icon: '🧠' },
        { text: 'BERT', icon: '📚' },
        { text: 'T5', icon: '🔤' },
        { text: 'LSTM', icon: '🔄' },
      ],
    },
    correctAnswer: 0,
  },
];

export default function LessonScreen() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const colorScheme = useColorScheme() ?? 'light';

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
    setStep((s) => s + 1);
  };

  const isCorrect = () => {
    if (currentLesson.type === 'fill-blank') {
      return textAnswer.trim().toLowerCase() === String(currentLesson.correctAnswer).toLowerCase();
    }
    return selected === currentLesson.correctAnswer;
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
              {currentLesson.type === 'multiple-choice' && (
                <MultipleChoice
                  question={currentLesson.data.question}
                  options={currentLesson.data.options}
                  selected={selected}
                  showResult={showResult}
                  correctIndex={currentLesson.correctAnswer as number}
                  onSelect={handleSelect}
                />
              )}

              {currentLesson.type === 'translate' && (
                <Translate
                  sentence={currentLesson.data.sentence}
                  instruction={currentLesson.data.instruction}
                  options={currentLesson.data.options}
                  selected={selected}
                  showResult={showResult}
                  correctIndex={currentLesson.correctAnswer as number}
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
            </View>
          ) : (
            <View style={styles.successContainer}>
              <ThemedText style={styles.successIcon}>🎉</ThemedText>
              <ThemedText style={styles.successTitle}>Świetnie!</ThemedText>
              <ThemedText style={styles.successText}>
                Ukończyłeś lekcję podstaw AI
              </ThemedText>
            </View>
          )}
        </View>

        {/* Bottom Button */}
        <View style={styles.footer}>
          {step < totalSteps && !showResult ? (
            <DuolingoButton
              title="Sprawdź"
              onPress={handleCheck}
              disabled={currentLesson.type === 'fill-blank' ? !textAnswer.trim() : selected === null}
              variant={
                currentLesson.type === 'fill-blank' 
                  ? (!textAnswer.trim() ? 'disabled' : 'primary')
                  : (selected === null ? 'disabled' : 'primary')
              }
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
                  {isCorrect() ? '✓ Świetnie!' : `✗ Poprawna odpowiedź: ${
                    currentLesson.type === 'fill-blank' 
                      ? currentLesson.correctAnswer 
                      : currentLesson.data.options[currentLesson.correctAnswer as number].text
                  }`}
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
  },
});


