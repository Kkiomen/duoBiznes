import { ThemedText } from '@/components/themed-text';
import { triggerErrorHaptic, triggerSelectionHaptic, triggerSuccessHaptic } from '@/hooks/use-animation-helpers';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

type NodeOption = {
  name: string;
  icon: string;
};

type NodePickerProps = {
  task: string;
  options: NodeOption[];
  selected: number | null;
  showResult: boolean;
  correctIndex: number;
  onSelect: (index: number) => void;
};

export function NodePicker({
  task,
  options,
  selected,
  showResult,
  correctIndex,
  onSelect,
}: NodePickerProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400)}>
      <Animated.View
        style={styles.badgeContainer}
        entering={FadeInDown.delay(100).duration(300)}
      >
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>WYBIERZ NODE</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(150).duration(400)}>
        <ThemedText style={styles.task}>
          Zadanie: {task}
        </ThemedText>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.instruction}>
          Który node n8n użyjesz?
        </ThemedText>
      </Animated.View>

      <View style={styles.optionsGrid}>
        {options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = showResult && i === correctIndex;
          const isWrong = showResult && selected === i && i !== correctIndex;

          return (
            <NodeOption
              key={i}
              index={i}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrect}
              isWrong={isWrong}
              onPress={() => {
                triggerSelectionHaptic();
                onSelect(i);
              }}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

function NodeOption({
  index,
  option,
  isSelected,
  isCorrect,
  isWrong,
  onPress,
}: {
  index: number;
  option: NodeOption;
  isSelected: boolean;
  isCorrect: boolean;
  isWrong: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const iconScale = useSharedValue(1);

  useEffect(() => {
    if (isCorrect) {
      triggerSuccessHaptic();
      scale.value = withSequence(
        withSpring(1.1, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
      iconScale.value = withSequence(
        withSpring(1.3, { damping: 6 }),
        withSpring(1, { damping: 10 })
      );
    } else if (isWrong) {
      triggerErrorHaptic();
      scale.value = withSequence(
        withSpring(0.95, { damping: 5 }),
        withSpring(1, { damping: 10 })
      );
    }
  }, [isCorrect, isWrong]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  return (
    <Animated.View
      entering={ZoomIn.delay(300 + index * 100).duration(400)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        disabled={isCorrect || isWrong}
        style={({ pressed }) => [
          styles.option,
          isSelected && !isCorrect && !isWrong && styles.optionSelected,
          isCorrect && styles.optionCorrect,
          isWrong && styles.optionWrong,
          {
            transform: [{ scale: pressed ? 0.95 : 1 }],
            shadowColor: isCorrect ? '#58cc02' : isWrong ? '#ea2b2b' : isSelected ? '#1cb0f6' : '#000',
            shadowOpacity: isCorrect || isWrong || isSelected ? 0.25 : 0.08,
            shadowRadius: isCorrect || isWrong || isSelected ? 12 : 8,
            shadowOffset: { width: 0, height: 4 },
            elevation: isCorrect || isWrong || isSelected ? 8 : 4,
          }
        ]}
      >
        <Animated.View style={iconAnimatedStyle}>
          <ThemedText style={styles.optionIcon}>{option.icon}</ThemedText>
        </Animated.View>
        <ThemedText style={[styles.optionText, { color: '#3c3c3c' }]}>
          {option.name}
        </ThemedText>
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
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  task: {
    fontSize: 20,
    fontWeight: '700',
    color: '#3c3c3c',
    lineHeight: 28,
  },
  instruction: {
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  option: {
    width: '48%',
    aspectRatio: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  optionSelected: {
    borderColor: '#1cb0f6',
    borderWidth: 3,
    backgroundColor: '#e0f2fe',
  },
  optionCorrect: {
    borderColor: '#58cc02',
    borderWidth: 3,
    backgroundColor: '#d7ffb8',
  },
  optionWrong: {
    borderColor: '#ea2b2b',
    borderWidth: 3,
    backgroundColor: '#ffdfe0',
  },
  optionIcon: {
    fontSize: 48,
    lineHeight: 56,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
