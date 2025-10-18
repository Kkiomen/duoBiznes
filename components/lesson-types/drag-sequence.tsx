import { ThemedText } from '@/components/themed-text';
import { triggerSelectionHaptic } from '@/hooks/use-animation-helpers';
import { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, Layout, useAnimatedStyle, useSharedValue, withSequence, withSpring } from 'react-native-reanimated';

type DragSequenceProps = {
  items: { text: string; icon: string }[];
  userOrder: number[];
  correctOrder: number[];
  showResult: boolean;
  onReorder: (newOrder: number[]) => void;
};

export function DragSequence({
  items,
  userOrder,
  correctOrder,
  showResult,
  onReorder,
}: DragSequenceProps) {
  const moveItem = (fromIndex: number, direction: 'up' | 'down') => {
    triggerSelectionHaptic();
    const newOrder = [...userOrder];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;

    if (toIndex >= 0 && toIndex < newOrder.length) {
      [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
      onReorder(newOrder);
    }
  };

  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(400)}>
      <Animated.View
        style={styles.badgeContainer}
        entering={FadeInDown.delay(100).duration(300)}
      >
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>UŁÓŻ W KOLEJNOŚCI</ThemedText>
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(200).duration(400)}>
        <ThemedText style={styles.instruction}>
          Ułóż kroki workflow w prawidłowej kolejności
        </ThemedText>
      </Animated.View>

      <View style={styles.itemsContainer}>
        {userOrder.map((itemIndex, i) => {
          const item = items[itemIndex];
          const isCorrect = showResult && itemIndex === correctOrder[i];

          return (
            <SequenceItem
              key={`${itemIndex}-${i}`}
              index={i}
              orderNumber={i + 1}
              item={item}
              isCorrect={isCorrect}
              isWrong={showResult && !isCorrect}
              showResult={showResult}
              canMoveUp={i > 0}
              canMoveDown={i < userOrder.length - 1}
              onMoveUp={() => moveItem(i, 'up')}
              onMoveDown={() => moveItem(i, 'down')}
              delay={300 + i * 80}
            />
          );
        })}
      </View>
    </Animated.View>
  );
}

function SequenceItem({
  index,
  orderNumber,
  item,
  isCorrect,
  isWrong,
  showResult,
  canMoveUp,
  canMoveDown,
  onMoveUp,
  onMoveDown,
  delay,
}: {
  index: number;
  orderNumber: number;
  item: { text: string; icon: string };
  isCorrect: boolean;
  isWrong: boolean;
  showResult: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  delay: number;
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isCorrect) {
      scale.value = withSequence(
        withSpring(1.05, { damping: 8 }),
        withSpring(1, { damping: 12 })
      );
    }
  }, [isCorrect]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(400)}
      layout={Layout}
      style={[styles.itemRow, animatedStyle]}
    >
      <View style={styles.orderNumber}>
        <ThemedText style={styles.orderText}>{orderNumber}</ThemedText>
      </View>

      <View style={[
        styles.item,
        isCorrect && styles.itemCorrect,
        isWrong && styles.itemWrong,
        {
          shadowColor: isCorrect ? '#58cc02' : isWrong ? '#ea2b2b' : '#000',
          shadowOpacity: isCorrect || isWrong ? 0.25 : 0.08,
          shadowRadius: isCorrect || isWrong ? 10 : 6,
          shadowOffset: { width: 0, height: 3 },
          elevation: isCorrect || isWrong ? 6 : 3,
        }
      ]}>
        <ThemedText style={styles.itemIcon}>{item.icon}</ThemedText>
        <ThemedText style={[styles.itemText, { color: '#3c3c3c' }]}>
          {item.text}
        </ThemedText>
      </View>

      {!showResult && (
        <View style={styles.controls}>
          <Pressable
            onPress={onMoveUp}
            disabled={!canMoveUp}
            style={({ pressed }) => [
              styles.controlBtn,
              !canMoveUp && styles.controlBtnDisabled,
              { transform: [{ scale: pressed && canMoveUp ? 0.9 : 1 }] }
            ]}
          >
            <ThemedText style={styles.controlIcon}>▲</ThemedText>
          </Pressable>
          <Pressable
            onPress={onMoveDown}
            disabled={!canMoveDown}
            style={({ pressed }) => [
              styles.controlBtn,
              !canMoveDown && styles.controlBtnDisabled,
              { transform: [{ scale: pressed && canMoveDown ? 0.9 : 1 }] }
            ]}
          >
            <ThemedText style={styles.controlIcon}>▼</ThemedText>
          </Pressable>
        </View>
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
    backgroundColor: '#f97316',
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
    color: '#3c3c3c',
  },
  itemsContainer: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  orderNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#666',
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
  },
  itemCorrect: {
    borderColor: '#58cc02',
    backgroundColor: '#d7ffb8',
  },
  itemWrong: {
    borderColor: '#ea2b2b',
    backgroundColor: '#ffdfe0',
  },
  itemIcon: {
    fontSize: 24,
  },
  itemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  controls: {
    gap: 4,
  },
  controlBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#1cb0f6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1cb0f6',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  controlBtnDisabled: {
    backgroundColor: '#e5e5e5',
    shadowOpacity: 0,
  },
  controlIcon: {
    fontSize: 16,
    color: '#fff',
  },
});
