import { ThemedText } from '@/components/themed-text';
import { triggerErrorHaptic, triggerSelectionHaptic, triggerSuccessHaptic } from '@/hooks/use-animation-helpers';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

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
    <Animated.View style={styles.container} entering={FadeInDown.duration(400)}>
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
            showResult={showResult}
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
  showResult,
  onPress
}: {
  index: number;
  text: string;
  icon: string;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  showResult: boolean;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
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
    return isDark ? '#404040' : '#e5e5e5';
  };

  const getBackgroundColor = () => {
    if (correct) return isDark ? '#2d5016' : '#d7ffb8';
    if (wrong) return isDark ? '#5c1b1b' : '#ffdfe0';
    if (selected) return isDark ? '#1a5a7a' : '#93c5fd';
    return isDark ? '#1f1f1f' : '#ffffff';
  };

  return (
    <Animated.View
      entering={FadeInDown.delay(300 + index * 100).duration(400)}
      style={[animatedStyle, styles.cardWrapper]}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.answerCard,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            borderWidth: selected || correct || wrong ? 4 : 2,
            opacity: pressed ? 0.9 : 1,
            shadowColor: correct ? '#58cc02' : wrong ? '#ea2b2b' : selected ? '#1cb0f6' : '#000',
            shadowOpacity: correct || wrong ? 0.3 : selected ? 0.35 : 0.1,
            shadowRadius: correct || wrong ? 8 : selected ? 10 : 4,
            shadowOffset: { width: 0, height: correct || wrong ? 3 : selected ? 4 : 1 },
            elevation: correct || wrong ? 6 : selected ? 8 : 2,
          },
        ]}
      >
        <View style={styles.cardContent}>
          {selected && !showResult && (
            <View style={styles.selectedBadge}>
              <ThemedText style={styles.selectedCheckmark}>✓</ThemedText>
            </View>
          )}
          <ThemedText style={styles.cardIcon}>{icon}</ThemedText>
          <ThemedText style={styles.cardText} numberOfLines={3}>{text}</ThemedText>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    paddingHorizontal: 4,
  },
  badgeContainer: {
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  badge: {
    backgroundColor: '#1cb0f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#1cb0f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  question: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  cardWrapper: {
    width: '48%',
    flexGrow: 0,
    flexShrink: 0,
  },
  answerCard: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cardIcon: {
    fontSize: 40,
    lineHeight: 48,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  cardText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },
  selectedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#1cb0f6',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedCheckmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
  },
});



