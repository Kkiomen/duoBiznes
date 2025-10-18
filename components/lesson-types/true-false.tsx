import { ThemedText } from '@/components/themed-text';
import { triggerErrorHaptic, triggerSelectionHaptic, triggerSuccessHaptic } from '@/hooks/use-animation-helpers';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { FadeInDown, SlideInLeft, SlideInRight, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

type TrueFalseProps = {
  statement: string;
  selected: boolean | null;
  showResult: boolean;
  correctAnswer: boolean;
  onSelect: (answer: boolean) => void;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function TrueFalse({
  statement,
  selected,
  showResult,
  correctAnswer,
  onSelect,
}: TrueFalseProps) {
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
        <TrueFalseButton
          isTrue={true}
          selected={selected === true}
          showResult={showResult}
          correct={showResult && correctAnswer === true}
          wrong={showResult && selected === true && correctAnswer !== true}
          onPress={() => {
            triggerSelectionHaptic();
            onSelect(true);
          }}
        />

        <TrueFalseButton
          isTrue={false}
          selected={selected === false}
          showResult={showResult}
          correct={showResult && correctAnswer === false}
          wrong={showResult && selected === false && correctAnswer !== false}
          onPress={() => {
            triggerSelectionHaptic();
            onSelect(false);
          }}
        />
      </View>
    </Animated.View>
  );
}

function TrueFalseButton({
  isTrue,
  selected,
  showResult,
  correct,
  wrong,
  onPress,
}: {
  isTrue: boolean;
  selected: boolean;
  showResult: boolean;
  correct: boolean;
  wrong: boolean;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (correct) {
      triggerSuccessHaptic();
      scale.value = withSequence(
        withSpring(1.05, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
      iconScale.value = withSequence(
        withSpring(1.3, { damping: 6 }),
        withSpring(1, { damping: 10 })
      );
    } else if (wrong) {
      triggerErrorHaptic();
      scale.value = withSequence(
        withSpring(0.95, { damping: 5 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [correct, wrong]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
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
    if (selected) return isDark ? '#0c3a4d' : '#dbeafe';
    return isDark ? '#1f1f1f' : '#ffffff';
  };

  return (
    <Animated.View
      entering={isTrue ? SlideInLeft.delay(300).duration(400) : SlideInRight.delay(300).duration(400)}
      style={[{ flex: 1 }, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        disabled={showResult}
        style={({ pressed }) => [
          styles.button,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
            borderWidth: selected || correct || wrong ? 3 : 2,
            opacity: pressed ? 0.9 : 1,
            shadowColor: correct ? '#58cc02' : wrong ? '#ea2b2b' : selected ? '#1cb0f6' : '#000',
            shadowOpacity: correct || wrong ? 0.3 : selected ? 0.2 : 0.1,
            shadowRadius: correct || wrong ? 8 : selected ? 6 : 4,
            shadowOffset: { width: 0, height: correct || wrong ? 3 : selected ? 2 : 1 },
            elevation: correct || wrong ? 6 : selected ? 4 : 2,
          },
        ]}
      >
        <Animated.View style={iconAnimatedStyle}>
          <ThemedText style={styles.buttonIcon}>{isTrue ? '✓' : '✗'}</ThemedText>
        </Animated.View>
        <ThemedText style={styles.buttonText}>
          {isTrue ? 'PRAWDA' : 'FAŁSZ'}
        </ThemedText>
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
    backgroundColor: '#ec4899',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#ec4899',
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
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 4,
  },
  button: {
    flex: 1,
    minHeight: 140,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    overflow: 'hidden',
  },
  buttonIcon: {
    fontSize: 48,
    lineHeight: 56,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});



