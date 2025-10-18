import { ThemedText } from '@/components/themed-text';
import { triggerSelectionHaptic, triggerSuccessHaptic } from '@/hooks/use-animation-helpers';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

type Pair = {
  left: string;
  right: string;
  leftIcon?: string;
};

type MatchPairsProps = {
  pairs: Pair[];
  selected: { leftIndex: number; rightIndex: number } | null;
  matched: number[];
  showResult: boolean;
  onSelectLeft: (index: number) => void;
  onSelectRight: (index: number) => void;
};

export function MatchPairs({
  pairs,
  selected,
  matched,
  showResult,
  onSelectLeft,
  onSelectRight,
}: MatchPairsProps) {
  const prevMatchedLength = useSharedValue(0);

  useEffect(() => {
    if (matched.length > prevMatchedLength.value) {
      triggerSuccessHaptic();
    }
    prevMatchedLength.value = matched.length;
  }, [matched.length]);

  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400)}>
      <Animated.View
        style={styles.badgeContainer}
        entering={FadeInDown.delay(100).duration(300)}
      >
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>DOPASUJ PARY</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.instruction}>
          Połącz node n8n z jego funkcją
        </ThemedText>
      </Animated.View>

      <View style={styles.pairsContainer}>
        {/* Left column */}
        <View style={styles.column}>
          {pairs.map((pair, i) => (
            <MatchItem
              key={`left-${i}`}
              index={i}
              text={pair.left}
              icon={pair.leftIcon}
              isSelected={selected?.leftIndex === i}
              isMatched={matched.includes(i)}
              onPress={() => {
                triggerSelectionHaptic();
                onSelectLeft(i);
              }}
              delay={300 + i * 80}
            />
          ))}
        </View>

        {/* Right column */}
        <View style={styles.column}>
          {pairs.map((pair, i) => (
            <MatchItem
              key={`right-${i}`}
              index={i}
              text={pair.right}
              isSelected={selected?.rightIndex === i}
              isMatched={matched.includes(i)}
              onPress={() => {
                triggerSelectionHaptic();
                onSelectRight(i);
              }}
              delay={300 + i * 80 + 40}
            />
          ))}
        </View>
      </View>

      {showResult && matched.length === pairs.length && (
        <Animated.View style={styles.success} entering={FadeIn.duration(600).delay(200)}>
          <ThemedText style={styles.successText}>✓ Wszystkie pary dopasowane!</ThemedText>
        </Animated.View>
      )}
    </Animated.View>
  );
}

function MatchItem({
  index,
  text,
  icon,
  isSelected,
  isMatched,
  onPress,
  delay,
}: {
  index: number;
  text: string;
  icon?: string;
  isSelected: boolean;
  isMatched: boolean;
  onPress: () => void;
  delay: number;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isMatched) {
      scale.value = withSequence(
        withSpring(1.1, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    } else if (isSelected) {
      scale.value = withSpring(1.05, { damping: 10 });
    } else {
      scale.value = withSpring(1, { damping: 12 });
    }
  }, [isSelected, isMatched]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        disabled={isMatched}
        style={({ pressed }) => [
          styles.item,
          isSelected && styles.itemSelected,
          isMatched && styles.itemMatched,
          {
            transform: [{ scale: pressed ? 0.95 : 1 }],
            shadowColor: isMatched ? '#58cc02' : isSelected ? '#1cb0f6' : '#000',
            shadowOpacity: isMatched || isSelected ? 0.25 : 0.08,
            shadowRadius: isMatched || isSelected ? 10 : 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: isMatched || isSelected ? 6 : 3,
          }
        ]}
      >
        {icon && <ThemedText style={styles.icon}>{icon}</ThemedText>}
        <ThemedText style={[styles.itemText, { color: '#3c3c3c' }]}>
          {text}
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
    backgroundColor: '#8b5cf6',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  pairsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  column: {
    flex: 1,
    gap: 12,
  },
  item: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSelected: {
    borderColor: '#1cb0f6',
    backgroundColor: '#e0f2fe',
  },
  itemMatched: {
    borderColor: '#58cc02',
    backgroundColor: '#d7ffb8',
  },
  icon: {
    fontSize: 24,
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  success: {
    padding: 12,
    backgroundColor: '#d7ffb8',
    borderRadius: 12,
  },
  successText: {
    color: '#58a700',
    fontWeight: '700',
    textAlign: 'center',
  },
});



