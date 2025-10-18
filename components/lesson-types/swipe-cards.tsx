import { ThemedText } from '@/components/themed-text';
import { triggerErrorHaptic, triggerSelectionHaptic, triggerSuccessHaptic } from '@/hooks/use-animation-helpers';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { FadeInDown, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

type SwipeCardsProps = {
  statement: string;
  onSwipe: (correct: boolean) => void;
  showFeedback: boolean;
  wasCorrect: boolean | null;
};

export function SwipeCards({
  statement,
  onSwipe,
  showFeedback,
  wasCorrect,
}: SwipeCardsProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [selected, setSelected] = useState<boolean | null>(null);

  const handleSwipe = (correct: boolean) => {
    triggerSelectionHaptic();
    setSelected(correct);
    onSwipe(correct);
  };

  useEffect(() => {
    if (!showFeedback) {
      setSelected(null);
    }
  }, [showFeedback]);

  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400)}>
      <Animated.View
        style={styles.badgeContainer}
        entering={FadeInDown.delay(100).duration(300)}
      >
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>PRAWDA/FAŁSZ</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.statement}>{statement}</ThemedText>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <SwipeButton
          icon="❌"
          label="Fałsz"
          isTrue={false}
          selected={selected === false}
          correct={showFeedback && wasCorrect !== null && !wasCorrect}
          wrong={showFeedback && selected === false && wasCorrect === true}
          showResult={showFeedback}
          isDark={isDark}
          onPress={() => handleSwipe(false)}
          delay={300}
        />

        <SwipeButton
          icon="✅"
          label="Prawda"
          isTrue={true}
          selected={selected === true}
          correct={showFeedback && wasCorrect !== null && wasCorrect}
          wrong={showFeedback && selected === true && wasCorrect === false}
          showResult={showFeedback}
          isDark={isDark}
          onPress={() => handleSwipe(true)}
          delay={400}
        />
      </View>
    </Animated.View>
  );
}

function SwipeButton({
  icon,
  label,
  isTrue,
  selected,
  correct,
  wrong,
  showResult,
  isDark,
  onPress,
  delay,
}: {
  icon: string;
  label: string;
  isTrue: boolean;
  selected: boolean;
  correct: boolean;
  wrong: boolean;
  showResult: boolean;
  isDark: boolean;
  onPress: () => void;
  delay: number;
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
    return isDark ? '#404040' : '#e5e5e5';
  };

  const getBackgroundColor = () => {
    if (correct) return isDark ? '#2d5016' : '#d7ffb8';
    if (wrong) return isDark ? '#5c1b1b' : '#ffdfe0';
    if (selected) return isDark ? '#1a5a7a' : '#dbeafe';
    return isDark ? '#1f1f1f' : '#ffffff';
  };

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).duration(400)}
      style={[{ flex: 1 }, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        disabled={showResult}
        style={({ pressed }) => [
          styles.swipeButton,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: selected || correct || wrong ? 4 : 2,
            opacity: pressed ? 0.9 : 1,
            shadowColor: correct ? '#58cc02' : wrong ? '#ea2b2b' : selected ? '#1cb0f6' : '#000',
            shadowOpacity: correct || wrong ? 0.3 : selected ? 0.35 : 0.1,
            shadowRadius: correct || wrong ? 8 : selected ? 10 : 4,
            shadowOffset: { width: 0, height: correct || wrong ? 3 : selected ? 4 : 2 },
            elevation: correct || wrong ? 6 : selected ? 8 : 2,
          }
        ]}
      >
        {selected && !showResult && (
          <View style={styles.selectedBadge}>
            <ThemedText style={styles.selectedCheckmark}>✓</ThemedText>
          </View>
        )}
        <ThemedText style={styles.swipeIcon}>{icon}</ThemedText>
        <ThemedText style={styles.swipeLabel}>{label}</ThemedText>
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
    backgroundColor: '#f59e0b',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#f59e0b',
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
  statement: {
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 4,
    paddingHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  swipeButton: {
    minHeight: 140,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  swipeIcon: {
    fontSize: 48,
    lineHeight: 56,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  swipeLabel: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
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
