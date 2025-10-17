import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

type StoryCardProps = {
  character: string;
  story: string;
  characterName?: string;
};

export function StoryCard({ character, story, characterName }: StoryCardProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(500).springify()}>
      <LinearGradient
        colors={['rgba(88, 204, 2, 0.15)', 'rgba(88, 204, 2, 0.05)']}
        style={styles.card}
      >
        <Animated.View
          style={styles.characterContainer}
          entering={ZoomIn.delay(200).duration(600).springify()}
        >
          <View style={styles.characterBubble}>
            <ThemedText style={styles.character}>{character}</ThemedText>
          </View>
          {characterName && (
            <Animated.View entering={FadeInDown.delay(400).duration(300)}>
              <ThemedText style={styles.characterName}>{characterName}</ThemedText>
            </Animated.View>
          )}
        </Animated.View>

        <Animated.View
          style={styles.storyContainer}
          entering={FadeInDown.delay(500).duration(400)}
        >
          <ThemedText style={styles.storyText}>{story}</ThemedText>
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
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.2)',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },
  characterContainer: {
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  characterBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(88, 204, 2, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(88, 204, 2, 0.4)',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  character: {
    fontSize: 48,
  },
  characterName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#58CC02',
  },
  storyContainer: {
    gap: 12,
  },
  storyText: {
    fontSize: 17,
    lineHeight: 26,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
