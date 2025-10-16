import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';

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
    const newOrder = [...userOrder];
    const toIndex = direction === 'up' ? fromIndex - 1 : fromIndex + 1;
    
    if (toIndex >= 0 && toIndex < newOrder.length) {
      [newOrder[fromIndex], newOrder[toIndex]] = [newOrder[toIndex], newOrder[fromIndex]];
      onReorder(newOrder);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>UŁÓŻ W KOLEJNOŚCI</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.instruction}>
        Ułóż kroki workflow w prawidłowej kolejności
      </ThemedText>

      <View style={styles.itemsContainer}>
        {userOrder.map((itemIndex, i) => {
          const item = items[itemIndex];
          const isCorrect = showResult && itemIndex === correctOrder[i];
          
          return (
            <View key={i} style={styles.itemRow}>
              <View style={styles.orderNumber}>
                <ThemedText style={styles.orderText}>{i + 1}</ThemedText>
              </View>
              
              <View style={[
                styles.item,
                showResult && isCorrect && styles.itemCorrect,
                showResult && !isCorrect && styles.itemWrong,
              ]}>
                <ThemedText style={styles.itemIcon}>{item.icon}</ThemedText>
                <ThemedText style={[styles.itemText, { color: '#3c3c3c' }]}>
                  {item.text}
                </ThemedText>
              </View>

              {!showResult && (
                <View style={styles.controls}>
                  <Pressable
                    onPress={() => moveItem(i, 'up')}
                    disabled={i === 0}
                    style={[styles.controlBtn, i === 0 && styles.controlBtnDisabled]}
                  >
                    <ThemedText style={styles.controlIcon}>▲</ThemedText>
                  </Pressable>
                  <Pressable
                    onPress={() => moveItem(i, 'down')}
                    disabled={i === userOrder.length - 1}
                    style={[styles.controlBtn, i === userOrder.length - 1 && styles.controlBtnDisabled]}
                  >
                    <ThemedText style={styles.controlIcon}>▼</ThemedText>
                  </Pressable>
                </View>
              )}
            </View>
          );
        })}
      </View>
    </View>
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
  },
  controlBtnDisabled: {
    backgroundColor: '#e5e5e5',
  },
  controlIcon: {
    fontSize: 16,
    color: '#fff',
  },
});



