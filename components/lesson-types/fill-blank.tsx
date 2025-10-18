import { ThemedText } from '@/components/themed-text';
import { triggerErrorHaptic, triggerSuccessHaptic } from '@/hooks/use-animation-helpers';
import { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

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
  const inputScale = useSharedValue(1);
  const checkmarkOpacity = useSharedValue(0);

  const isCorrect = showResult && answer.trim().toLowerCase() === correctAnswer.toLowerCase();
  const isWrong = showResult && answer.trim().toLowerCase() !== correctAnswer.toLowerCase();

  useEffect(() => {
    if (isCorrect) {
      triggerSuccessHaptic();
      inputScale.value = withSequence(
        withSpring(1.03, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
      checkmarkOpacity.value = withSpring(1, { damping: 10 });
    } else if (isWrong) {
      triggerErrorHaptic();
      inputScale.value = withSequence(
        withSpring(0.97, { damping: 5 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [isCorrect, isWrong]);

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: inputScale.value }],
  }));

  const checkmarkAnimatedStyle = useAnimatedStyle(() => ({
    opacity: checkmarkOpacity.value,
    transform: [{ scale: checkmarkOpacity.value }],
  }));

  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400)}>
      <Animated.View
        style={styles.badgeContainer}
        entering={FadeInDown.delay(100).duration(300)}
      >
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>UZUPEŁNIJ LUKĘ</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.sentence}>{sentence}</ThemedText>
      </Animated.View>

      <Animated.View
        style={[styles.inputWrapper, inputAnimatedStyle]}
        entering={FadeInDown.delay(300).duration(400)}
      >
        <TextInput
          style={[
            styles.input,
            isCorrect && styles.inputCorrect,
            isWrong && styles.inputWrong,
            {
              shadowColor: isCorrect ? '#58cc02' : isWrong ? '#ea2b2b' : '#1cb0f6',
              shadowOpacity: isCorrect || isWrong ? 0.25 : 0.15,
              shadowRadius: isCorrect || isWrong ? 10 : 6,
              shadowOffset: { width: 0, height: 3 },
              elevation: isCorrect || isWrong ? 6 : 3,
            }
          ]}
          placeholder={placeholder}
          placeholderTextColor="#999"
          value={answer}
          onChangeText={setAnswer}
          editable={!showResult}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {isCorrect && (
          <Animated.View style={[styles.checkmark, checkmarkAnimatedStyle]}>
            <ThemedText style={styles.checkmarkText}>✓</ThemedText>
          </Animated.View>
        )}
      </Animated.View>

      {showResult && isWrong && (
        <Animated.View style={styles.correctAnswerContainer} entering={FadeInDown.duration(300)}>
          <ThemedText style={styles.correctAnswer}>
            Poprawna odpowiedź: <ThemedText style={styles.correctAnswerBold}>{correctAnswer}</ThemedText>
          </ThemedText>
        </Animated.View>
      )}
    </Animated.View>
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
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 26,
    color: '#1f2937',
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e5e5',
    borderRadius: 12,
    padding: 16,
    paddingRight: 50,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
    minHeight: 56,
    fontWeight: '600',
  },
  inputCorrect: {
    borderColor: '#58cc02',
    borderWidth: 2,
    backgroundColor: '#d7ffb8',
  },
  inputWrong: {
    borderColor: '#ea2b2b',
    borderWidth: 2,
    backgroundColor: '#ffdfe0',
  },
  checkmark: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#58cc02',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    fontSize: 24,
    lineHeight: 28,
    color: '#fff',
    fontWeight: '700',
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  correctAnswerContainer: {
    padding: 12,
    backgroundColor: '#e0f2fe',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1cb0f6',
  },
  correctAnswer: {
    fontSize: 14,
    color: '#1cb0f6',
    fontWeight: '600',
  },
  correctAnswerBold: {
    fontWeight: '800',
    color: '#0e8ecb',
  },
});
