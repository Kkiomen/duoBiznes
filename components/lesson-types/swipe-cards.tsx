import { ThemedText } from '@/components/themed-text';
import { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

type SwipeCardsProps = {
  statement: string;
  onSwipe: (correct: boolean) => void;
  showFeedback: boolean;
  wasCorrect: boolean | null;
};

export function SwipeCards({
  statement,
  onSwipe,
  showFeedback,
  wasCorrect,
}: SwipeCardsProps) {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSwipe = (correct: boolean) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    
    onSwipe(correct);
  };

  return (
    <View style={styles.container}>
      <View style={styles.badgeContainer}>
        <View style={styles.badge}>
          <ThemedText style={styles.badgeText}>SWIPE</ThemedText>
        </View>
      </View>

      <ThemedText style={styles.instruction}>
        Przesuń ✅ jeśli prawda, ❌ jeśli fałsz
      </ThemedText>

      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <ThemedText style={styles.statement}>{statement}</ThemedText>
      </Animated.View>

      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={() => handleSwipe(false)}
          disabled={showFeedback}
          style={({ pressed }) => [
            styles.swipeButton,
            styles.wrongButton,
            { transform: [{ scale: pressed ? 0.9 : 1 }] }
          ]}
        >
          <ThemedText style={styles.swipeIcon}>❌</ThemedText>
          <ThemedText style={styles.swipeLabel}>Fałsz</ThemedText>
        </Pressable>

        <Pressable
          onPress={() => handleSwipe(true)}
          disabled={showFeedback}
          style={({ pressed }) => [
            styles.swipeButton,
            styles.correctButton,
            { transform: [{ scale: pressed ? 0.9 : 1 }] }
          ]}
        >
          <ThemedText style={styles.swipeIcon}>✅</ThemedText>
          <ThemedText style={styles.swipeLabel}>Prawda</ThemedText>
        </Pressable>
      </View>

      {showFeedback && wasCorrect !== null && (
        <View style={[
          styles.feedback,
          wasCorrect ? styles.feedbackCorrect : styles.feedbackWrong
        ]}>
          <ThemedText style={styles.feedbackText}>
            {wasCorrect ? '✓ Dobrze!' : '✗ Źle!'}
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
    alignItems: 'center',
  },
  badgeContainer: {
    alignSelf: 'flex-start',
  },
  badge: {
    backgroundColor: '#f59e0b',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#777',
    textAlign: 'center',
  },
  card: {
    width: '100%',
    minHeight: 200,
    padding: 24,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#e5e5e5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  statement: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    color: '#3c3c3c',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 20,
    width: '100%',
  },
  swipeButton: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 8,
  },
  correctButton: {
    backgroundColor: '#d7ffb8',
  },
  wrongButton: {
    backgroundColor: '#ffdfe0',
  },
  swipeIcon: {
    fontSize: 40,
  },
  swipeLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3c3c3c',
  },
  feedback: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
  },
  feedbackCorrect: {
    backgroundColor: '#d7ffb8',
  },
  feedbackWrong: {
    backgroundColor: '#ffdfe0',
  },
  feedbackText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#3c3c3c',
  },
});


