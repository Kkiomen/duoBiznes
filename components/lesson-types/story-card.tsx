import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

type StoryCardProps = {
  character: string;
  story: string;
  characterName?: string;
};

export function StoryCard({ character, story, characterName }: StoryCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(88, 204, 2, 0.15)', 'rgba(88, 204, 2, 0.05)']}
        style={styles.card}
      >
        <View style={styles.characterContainer}>
          <View style={styles.characterBubble}>
            <ThemedText style={styles.character}>{character}</ThemedText>
          </View>
          {characterName && (
            <ThemedText style={styles.characterName}>{characterName}</ThemedText>
          )}
        </View>

        <View style={styles.storyContainer}>
          <ThemedText style={styles.storyText}>{story}</ThemedText>
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
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.2)',
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
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
