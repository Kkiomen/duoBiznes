import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';

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
  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>DOPASUJ PARY</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.instruction}>
        Połącz node n8n z jego funkcją
      </ThemedText>

      <View style={styles.pairsContainer}>
        {/* Left column */}
        <View style={styles.column}>
          {pairs.map((pair, i) => (
            <Pressable
              key={`left-${i}`}
              onPress={() => onSelectLeft(i)}
              disabled={matched.includes(i)}
              style={({ pressed }) => [
                styles.item,
                selected?.leftIndex === i && styles.itemSelected,
                matched.includes(i) && styles.itemMatched,
                { transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
            >
              {pair.leftIcon && <ThemedText style={styles.icon}>{pair.leftIcon}</ThemedText>}
              <ThemedText style={[styles.itemText, { color: '#3c3c3c' }]}>
                {pair.left}
              </ThemedText>
            </Pressable>
          ))}
        </View>

        {/* Right column */}
        <View style={styles.column}>
          {pairs.map((pair, i) => (
            <Pressable
              key={`right-${i}`}
              onPress={() => onSelectRight(i)}
              disabled={matched.includes(i)}
              style={({ pressed }) => [
                styles.item,
                selected?.rightIndex === i && styles.itemSelected,
                matched.includes(i) && styles.itemMatched,
                { transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
            >
              <ThemedText style={[styles.itemText, { color: '#3c3c3c' }]}>
                {pair.right}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {showResult && matched.length === pairs.length && (
        <View style={styles.success}>
          <ThemedText style={styles.successText}>✓ Wszystkie pary dopasowane!</ThemedText>
        </View>
      )}
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
    color: '#3c3c3c',
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



