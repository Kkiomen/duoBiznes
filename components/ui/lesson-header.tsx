import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { ProgressBar } from './progress-bar';

type LessonHeaderProps = {
  progress: number; // 0-1
  hearts?: number;
  gems?: number;
};

export function LessonHeader({ progress, hearts = 5, gems = 0 }: LessonHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.closeButton}>
        <ThemedText style={styles.closeIcon}>✕</ThemedText>
      </Pressable>
      
      <View style={styles.progressContainer}>
        <ProgressBar progress={progress} />
      </View>

      <View style={styles.stats}>
        {hearts > 0 && (
          <View style={styles.stat}>
            <ThemedText style={styles.statIcon}>❤️</ThemedText>
            <ThemedText style={styles.statText}>{hearts}</ThemedText>
          </View>
        )}
        {gems > 0 && (
          <View style={styles.stat}>
            <ThemedText style={styles.statIcon}>💎</ThemedText>
            <ThemedText style={styles.statText}>{gems}</ThemedText>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 24,
    color: '#afafaf',
  },
  progressContainer: {
    flex: 1,
  },
  stats: {
    flexDirection: 'row',
    gap: 12,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statIcon: {
    fontSize: 20,
  },
  statText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#afafaf',
  },
});



