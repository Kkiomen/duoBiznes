import { ThemedText } from '@/components/themed-text';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

type FillBlankProps = {
  sentence: string;
  placeholder: string;
  correctAnswer: string;
  showResult: boolean;
  onAnswer: (answer: string) => void;
};

export function FillBlank({
  sentence,
  placeholder,
  correctAnswer,
  showResult,
  onAnswer,
}: FillBlankProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    onAnswer(answer.trim().toLowerCase());
  };

  const isCorrect = showResult && answer.trim().toLowerCase() === correctAnswer.toLowerCase();
  const isWrong = showResult && answer.trim().toLowerCase() !== correctAnswer.toLowerCase();

  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>UZUPEŁNIJ LUKĘ</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.sentence}>{sentence}</ThemedText>

      <TextInput
        style={[
          styles.input,
          isCorrect && styles.inputCorrect,
          isWrong && styles.inputWrong,
        ]}
        placeholder={placeholder}
        value={answer}
        onChangeText={setAnswer}
        editable={!showResult}
        autoCapitalize="none"
        autoCorrect={false}
      />

      {showResult && isWrong && (
        <ThemedText style={styles.correctAnswer}>
          Poprawna odpowiedź: {correctAnswer}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  badgeContainer: {
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#ff9600',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  sentence: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: '#3c3c3c',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 16,
    padding: 16,
    fontSize: 18,
    color: '#3c3c3c',
    backgroundColor: '#fff',
  },
  inputCorrect: {
    borderColor: '#58cc02',
    backgroundColor: '#d7ffb8',
  },
  inputWrong: {
    borderColor: '#ea2b2b',
    backgroundColor: '#ffdfe0',
  },
  correctAnswer: {
    fontSize: 14,
    color: '#58cc02',
    fontWeight: '600',
  },
});


