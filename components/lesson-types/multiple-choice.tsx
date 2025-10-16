import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';

type MultipleChoiceProps = {
  question: string;
  options: { text: string; icon?: string }[];
  selected: number | null;
  showResult: boolean;
  correctIndex: number;
  onSelect: (index: number) => void;
};

export function MultipleChoice({
  question,
  options,
  selected,
  showResult,
  correctIndex,
  onSelect,
}: MultipleChoiceProps) {
  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>WIELOKROTNY WYBÓR</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.question}>{question}</ThemedText>

      <View style={styles.optionsGrid}>
        {options.map((option, i) => (
          <AnswerCard
            key={i}
            text={option.text}
            icon={option.icon || '📝'}
            selected={selected === i}
            correct={showResult && i === correctIndex}
            wrong={showResult && selected === i && i !== correctIndex}
            onPress={() => onSelect(i)}
          />
        ))}
      </View>
    </View>
  );
}

function AnswerCard({ 
  text, 
  icon, 
  selected, 
  correct, 
  wrong, 
  onPress 
}: { 
  text: string; 
  icon: string; 
  selected: boolean; 
  correct: boolean; 
  wrong: boolean; 
  onPress: () => void;
}) {
  const getBorderColor = () => {
    if (correct) return '#58cc02';
    if (wrong) return '#ea2b2b';
    if (selected) return '#1cb0f6';
    return '#e5e5e5';
  };

  const getBackgroundColor = () => {
    if (correct) return '#d7ffb8';
    if (wrong) return '#ffdfe0';
    return '#fff';
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.answerCard,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
          borderWidth: 2,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <ThemedText style={styles.cardIcon}>{icon}</ThemedText>
      <ThemedText style={[styles.cardText, { color: '#3c3c3c' }]}>{text}</ThemedText>
    </Pressable>
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
    backgroundColor: '#1cb0f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  question: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: '#3c3c3c',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  answerCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cardIcon: {
    fontSize: 40,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});



