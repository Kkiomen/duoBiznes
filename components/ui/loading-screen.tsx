import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useLanguage } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message }: LoadingScreenProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const { t } = useLanguage();
  const displayMessage = message || t('common.loadingCourse');

  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ThemedText style={styles.emoji}>📚</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.spinnerContainer}>
          <ActivityIndicator
            size="large"
            color={colorScheme === 'dark' ? '#1cb0f6' : '#1cb0f6'}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <ThemedText style={styles.message}>{displayMessage}</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <ThemedText style={styles.hint}>{t('common.loadingHint')}</ThemedText>
        </Animated.View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    gap: 24,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  spinnerContainer: {
    padding: 20,
  },
  message: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
});
