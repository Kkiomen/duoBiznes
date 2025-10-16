import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';

type TranslateProps = {
  sentence: string;
  instruction: string;
  options: string[];
  selected: number | null;
  showResult: boolean;
  correctIndex: number;
  onSelect: (index: number) => void;
};

export function Translate({
  sentence,
  instruction,
  options,
  selected,
  showResult,
  correctIndex,
  onSelect,
}: TranslateProps) {
  return (
    <View style={styles.container}>
      <ThemedText style={styles.sentence}>{sentence}</ThemedText>
      <ThemedText style={styles.instruction}>{instruction}</ThemedText>

      <View style={styles.optionsVertical}>
        {options.map((option, i) => (
          <AnswerButton
            key={i}
            text={option}
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

function AnswerButton({ 
  text, 
  selected, 
  correct, 
  wrong, 
  onPress 
}: { 
  text: string; 
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
        styles.answerButton,
        {
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
          borderWidth: 2,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <ThemedText style={[styles.buttonText, { color: '#3c3c3c' }]}>{text}</ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  sentence: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    color: '#3c3c3c',
  },
  instruction: {
    fontSize: 16,
    color: '#777',
  },
  optionsVertical: {
    gap: 12,
  },
  answerButton: {
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});



