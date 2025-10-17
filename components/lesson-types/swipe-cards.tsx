import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeIn, ZoomIn, useAnimatedStyle, useSharedValue, withSpring, withSequence, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { triggerSelectionHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '@/hooks/use-animation-helpers';

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
  const cardScale = useSharedValue(1);
  const cardOpacity = useSharedValue(1);

  const handleSwipe = (correct: boolean) => {
    triggerSelectionHaptic();

    // Card swipe animation
    cardOpacity.value = withTiming(0, { duration: 200 });
    cardScale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withTiming(1, { duration: 0 })
    );

    setTimeout(() => {
      cardOpacity.value = withSpring(1, { damping: 12 });
      cardScale.value = withSpring(1, { damping: 12 });
    }, 250);

    onSwipe(correct);
  };

  useEffect(() => {
    if (wasCorrect === true) {
      triggerSuccessHaptic();
    } else if (wasCorrect === false) {
      triggerErrorHaptic();
    }
  }, [wasCorrect]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    opacity: cardOpacity.value,
    transform: [{ scale: cardScale.value }],
  }));

  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400).springify()}>
      <Animated.View
        style={styles.badgeContainer}
        entering={FadeInDown.delay(100).duration(300)}
      >
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>SWIPE</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <ThemedText style={styles.instruction}>
          Przesuń ✅ jeśli prawda, ❌ jeśli fałsz
        </ThemedText>
      </Animated.View>

      <Animated.View
        style={[styles.card, cardAnimatedStyle]}
        entering={ZoomIn.delay(250).duration(500).springify()}
      >
        <ThemedText style={styles.statement}>{statement}</ThemedText>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <SwipeButton
          icon="❌"
          label="Fałsz"
          color="#ffdfe0"
          borderColor="#ea2b2b"
          disabled={showFeedback}
          onPress={() => handleSwipe(false)}
          delay={350}
        />

        <SwipeButton
          icon="✅"
          label="Prawda"
          color="#d7ffb8"
          borderColor="#58cc02"
          disabled={showFeedback}
          onPress={() => handleSwipe(true)}
          delay={450}
        />
      </View>

      {showFeedback && wasCorrect !== null && (
        <Animated.View
          style={[
            styles.feedback,
            wasCorrect ? styles.feedbackCorrect : styles.feedbackWrong
          ]}
          entering={FadeIn.duration(300)}
        >
          <ThemedText style={styles.feedbackText}>
            {wasCorrect ? '✓ Dobrze!' : '✗ Źle!'}
          </ThemedText>
        </Animated.View>
      )}
    </Animated.View>
  );
}

function SwipeButton({
  icon,
  label,
  color,
  borderColor,
  disabled,
  onPress,
  delay,
}: {
  icon: string;
  label: string;
  color: string;
  borderColor: string;
  disabled: boolean;
  onPress: () => void;
  delay: number;
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={ZoomIn.delay(delay).duration(400).springify()}
      style={[{ flex: 1 }, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.swipeButton,
          {
            backgroundColor: color,
            borderColor: borderColor,
            borderWidth: 2,
            transform: [{ scale: pressed ? 0.92 : 1 }],
            shadowColor: borderColor,
            shadowOpacity: 0.3,
            shadowRadius: 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
            opacity: disabled ? 0.5 : 1,
          }
        ]}
      >
        <ThemedText style={styles.swipeIcon}>{icon}</ThemedText>
        <ThemedText style={styles.swipeLabel}>{label}</ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    alignItems: 'center',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
  },
  badge: {
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    minHeight: 200,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  statement: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: '#3c3c3c',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  swipeButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  swipeIcon: {
    fontSize: 40,
  },
  swipeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3c3c3c',
  },
  feedback: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
  },
  feedbackCorrect: {
    backgroundColor: '#d7ffb8',
    borderWidth: 2,
    borderColor: '#58cc02',
  },
  feedbackWrong: {
    backgroundColor: '#ffdfe0',
    borderWidth: 2,
    borderColor: '#ea2b2b',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#3c3c3c',
  },
});
