import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, SlideInLeft, SlideInRight, useAnimatedStyle, useSharedValue, withSpring, withSequence } from 'react-native-reanimated';
import { useEffect } from 'react';
import { triggerSelectionHaptic, triggerSuccessHaptic, triggerErrorHaptic } from '@/hooks/use-animation-helpers';

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
    <Animated.View style={styles.container} entering={FadeInDown.duration(400).springify()}>
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
      entering={isTrue ? SlideInLeft.delay(300).duration(400).springify() : SlideInRight.delay(300).duration(400).springify()}
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
            borderWidth: selected ? 3 : 2,
            transform: [{ scale: pressed ? 0.95 : 1 }],
            shadowColor: correct ? '#58cc02' : wrong ? '#ea2b2b' : selected ? '#1cb0f6' : '#000',
            shadowOpacity: correct || wrong || selected ? 0.25 : 0.1,
            shadowRadius: correct || wrong || selected ? 12 : 6,
            shadowOffset: { width: 0, height: 4 },
            elevation: correct || wrong || selected ? 8 : 4,
          },
        ]}
      >
        <Animated.View style={iconAnimatedStyle}>
          <ThemedText style={styles.buttonIcon}>{isTrue ? '✓' : '✗'}</ThemedText>
        </Animated.View>
        <ThemedText style={[styles.buttonText, { color: '#3c3c3c' }]}>
          {isTrue ? 'PRAWDA' : 'FAŁSZ'}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 32,
  },
  badgeContainer: {
    alignItems: 'flex-start',
  },
  badge: {
    backgroundColor: '#ec4899',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  statement: {
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 30,
    color: '#3c3c3c',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  button: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    alignItems: 'center',
    gap: 8,
  },
  buttonSelected: {
    borderColor: '#1cb0f6',
    backgroundColor: '#e0f2fe',
  },
  buttonCorrect: {
    borderColor: '#58cc02',
    backgroundColor: '#d7ffb8',
  },
  buttonWrong: {
    borderColor: '#ea2b2b',
    backgroundColor: '#ffdfe0',
  },
  buttonIcon: {
    fontSize: 32,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
  },
});



