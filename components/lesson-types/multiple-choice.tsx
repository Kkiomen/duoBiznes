import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSpring, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';
import { triggerSelectionHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '@/hooks/use-animation-helpers';

type MultipleChoiceProps = {
  question: string;
  options: { text: string; icon?: string }[];
  selected: number | null;
  showResult: boolean;
  correctIndex: number;
  onSelect: (index: number) => void;
};

export function MultipleChoice({
  question,
  options,
  selected,
  showResult,
  correctIndex,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400).springify()}>
      <Animated.View
        style={styles.badgeContainer}
        entering={FadeInDown.delay(100).duration(300)}
      >
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>WIELOKROTNY WYBÓR</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.question}>{question}</ThemedText>
      </Animated.View>

      <View style={styles.optionsGrid}>
        {options.map((option, i) => (
          <AnswerCard
            key={i}
            index={i}
            text={option.text}
            icon={option.icon || '📝'}
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

function AnswerCard({
  index,
  text,
  icon,
  selected,
  correct,
  wrong,
  onPress
}: {
  index: number;
  text: string;
  icon: string;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);

  // Trigger animations on state changes
  useEffect(() => {
    if (correct) {
      triggerSuccessHaptic();
      // Success bounce
      scale.value = withSequence(
        withSpring(1.05, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    } else if (wrong) {
      triggerErrorHaptic();
      // Shake animation
      translateX.value = withSequence(
        withSpring(-8, { damping: 5 }),
        withSpring(8, { damping: 5 }),
        withSpring(-8, { damping: 5 }),
        withSpring(0, { damping: 8 })
      );
    }
  }, [correct, wrong]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value }
    ],
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
      entering={FadeInDown.delay(300 + index * 100).duration(400).springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.answerCard,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            borderWidth: selected ? 3 : 2,
            transform: [{ scale: pressed ? 0.95 : 1 }],
            shadowColor: correct ? '#58cc02' : wrong ? '#ea2b2b' : selected ? '#1cb0f6' : '#000',
            shadowOpacity: correct || wrong || selected ? 0.25 : 0.08,
            shadowRadius: correct || wrong || selected ? 12 : 8,
            elevation: correct || wrong || selected ? 8 : 4,
          },
        ]}
      >
        <ThemedText style={styles.cardIcon}>{icon}</ThemedText>
        <ThemedText style={[styles.cardText, { color: '#3c3c3c' }]}>{text}</ThemedText>
      </Pressable>
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
    backgroundColor: '#1cb0f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: '#3c3c3c',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  cardIcon: {
    fontSize: 40,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});



