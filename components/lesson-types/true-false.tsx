import { ThemedText } from '@/components/themed-text';
import { Pressable, StyleSheet, View } from 'react-native';

type TrueFalseProps = {
  statement: string;
  selected: boolean | null;
  showResult: boolean;
  correctAnswer: boolean;
  onSelect: (answer: boolean) => void;
};

export function TrueFalse({
  statement,
  selected,
  showResult,
  correctAnswer,
  onSelect,
}: TrueFalseProps) {
  const getButtonStyle = (isTrue: boolean) => {
    if (!showResult) {
      return selected === isTrue ? styles.buttonSelected : {};
    }
    
    if (selected === isTrue) {
      return isTrue === correctAnswer ? styles.buttonCorrect : styles.buttonWrong;
    }
    
    return {};
  };

  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>PRAWDA/FAŁSZ</ThemedText>
        </View>
      </View>
      
      <ThemedText style={styles.statement}>{statement}</ThemedText>

      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={() => onSelect(true)}
          disabled={showResult}
          style={({ pressed }) => [
            styles.button,
            getButtonStyle(true),
            { transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]}
        >
          <ThemedText style={styles.buttonIcon}>✓</ThemedText>
          <ThemedText style={[styles.buttonText, { color: '#3c3c3c' }]}>
            PRAWDA
          </ThemedText>
        </Pressable>

        <Pressable
          onPress={() => onSelect(false)}
          disabled={showResult}
          style={({ pressed }) => [
            styles.button,
            getButtonStyle(false),
            { transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]}
        >
          <ThemedText style={styles.buttonIcon}>✗</ThemedText>
          <ThemedText style={[styles.buttonText, { color: '#3c3c3c' }]}>
            FAŁSZ
          </ThemedText>
        </Pressable>
      </View>
    </View>
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


