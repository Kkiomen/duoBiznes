import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

type ChallengeIntroProps = {
  title: string;
  description: string;
  emoji: string;
};

export function ChallengeIntro({ title, description, emoji }: ChallengeIntroProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 75, 75, 0.2)', 'rgba(224, 60, 60, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.emojiContainer}>
          <LinearGradient
            colors={['#FF4B4B', '#E03C3C']}
            style={styles.emojiBubble}
          >
            <ThemedText style={styles.emoji}>{emoji}</ThemedText>
          </LinearGradient>
        </View>

        <ThemedText style={styles.title}>{title}</ThemedText>
        <ThemedText style={styles.description}>{description}</ThemedText>

        <View style={styles.readyBadge}>
          <ThemedText style={styles.readyText}>Gotowy? Scrolluj dalej! 👇</ThemedText>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    borderWidth: 2,
    borderColor: 'rgba(255, 75, 75, 0.3)',
    shadowColor: '#FF4B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    gap: 16,
    alignItems: 'center',
  },
  emojiContainer: {
    marginBottom: 8,
  },
  emojiBubble: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    shadowColor: '#FF4B4B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  emoji: {
    fontSize: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FF4B4B',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  readyBadge: {
    backgroundColor: 'rgba(255, 75, 75, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 75, 75, 0.4)',
    marginTop: 8,
  },
  readyText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FF4B4B',
  },
});
