import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';

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
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>WYBIERZ NODE</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.task}>
        Zadanie: {task}
      </ThemedText>

      <ThemedText style={styles.instruction}>
        Który node n8n użyjesz?
      </ThemedText>

      <View style={styles.optionsGrid}>
        {options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = showResult && i === correctIndex;
          const isWrong = showResult && selected === i && i !== correctIndex;

          return (
            <Pressable
              key={i}
              onPress={() => onSelect(i)}
              disabled={showResult}
              style={({ pressed }) => [
                styles.option,
                isSelected && !showResult && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrong && styles.optionWrong,
                { transform: [{ scale: pressed ? 0.95 : 1 }] }
              ]}
            >
              <ThemedText style={styles.optionIcon}>{option.icon}</ThemedText>
              <ThemedText style={[styles.optionText, { color: '#3c3c3c' }]}>
                {option.name}
              </ThemedText>
            </Pressable>
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
    backgroundColor: '#e0f2fe',
  },
  optionCorrect: {
    borderColor: '#58cc02',
    backgroundColor: '#d7ffb8',
  },
  optionWrong: {
    borderColor: '#ea2b2b',
    backgroundColor: '#ffdfe0',
  },
  optionIcon: {
    fontSize: 48,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});



