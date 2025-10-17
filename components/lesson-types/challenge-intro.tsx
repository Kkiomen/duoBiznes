import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn, BounceIn } from 'react-native-reanimated';

type ChallengeIntroProps = {
  title: string;
  description: string;
  emoji: string;
};

export function ChallengeIntro({ title, description, emoji }: ChallengeIntroProps) {
  return (
    <Animated.View style={styles.container} entering={ZoomIn.duration(600).springify()}>
      <LinearGradient
        colors={['rgba(255, 75, 75, 0.2)', 'rgba(224, 60, 60, 0.1)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Animated.View style={styles.emojiContainer} entering={BounceIn.delay(200).duration(800)}>
          <LinearGradient
            colors={['#FF4B4B', '#E03C3C']}
            style={styles.emojiBubble}
          >
            <ThemedText style={styles.emoji}>{emoji}</ThemedText>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <ThemedText style={styles.description}>{description}</ThemedText>
        </Animated.View>

        <Animated.View
          style={styles.readyBadge}
          entering={ZoomIn.delay(600).duration(400).springify()}
        >
          <ThemedText style={styles.readyText}>Gotowy? Scrolluj dalej! 👇</ThemedText>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
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
