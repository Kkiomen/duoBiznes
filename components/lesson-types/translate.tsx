import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, SlideInUp, useAnimatedStyle, useSharedValue, withSpring, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';
import { triggerSelectionHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '@/hooks/use-animation-helpers';

type TranslateProps = {
  sentence: string;
  instruction: string;
  options: string[];
  selected: number | null;
  showResult: boolean;
  correctIndex: number;
  onSelect: (index: number) => void;
};

export function Translate({
  sentence,
  instruction,
  options,
  selected,
  showResult,
  correctIndex,
  onSelect,
}: TranslateProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400).springify()}>
      <Animated.View entering={FadeInDown.delay(100).duration(400)}>
        <ThemedText style={styles.sentence}>{sentence}</ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.instruction}>{instruction}</ThemedText>
      </Animated.View>

      <View style={styles.optionsVertical}>
        {options.map((option, i) => (
          <AnswerButton
            key={i}
            index={i}
            text={option}
            selected={selected === i}
            correct={showResult && i === correctIndex}
            wrong={showResult && selected === i && i !== correctIndex}
            onPress={() => {
              triggerSelectionHaptic();
              onSelect(i);
            }}
          />
        ))}
      </View>
    </Animated.View>
  );
}

function AnswerButton({
  index,
  text,
  selected,
  correct,
  wrong,
  onPress
}: {
  index: number;
  text: string;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (correct) {
      triggerSuccessHaptic();
      scale.value = withSequence(
        withSpring(1.03, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    } else if (wrong) {
      triggerErrorHaptic();
      scale.value = withSequence(
        withSpring(0.97, { damping: 5 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [correct, wrong]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const getBorderColor = () => {
    if (correct) return '#58cc02';
    if (wrong) return '#ea2b2b';
    if (selected) return '#1cb0f6';
    return '#e5e5e5';
  };

  const getBackgroundColor = () => {
    if (correct) return '#d7ffb8';
    if (wrong) return '#ffdfe0';
    if (selected) return '#e0f2fe';
    return '#fff';
  };

  return (
    <Animated.View
      entering={SlideInUp.delay(300 + index * 80).duration(400).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.answerButton,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            borderWidth: selected ? 3 : 2,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            shadowColor: correct ? '#58cc02' : wrong ? '#ea2b2b' : selected ? '#1cb0f6' : '#000',
            shadowOpacity: correct || wrong || selected ? 0.2 : 0.08,
            shadowRadius: correct || wrong || selected ? 10 : 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: correct || wrong || selected ? 6 : 3,
          },
        ]}
      >
        <ThemedText style={[styles.buttonText, { color: '#3c3c3c' }]}>{text}</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  sentence: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: '#3c3c3c',
  },
  instruction: {
    fontSize: 16,
    color: '#777',
    fontWeight: '600',
  },
  optionsVertical: {
    gap: 12,
  },
  answerButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
