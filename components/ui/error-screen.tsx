import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface ErrorScreenProps {
  error: string;
  onRetry: () => void;
}

export function ErrorScreen({ error, onRetry }: ErrorScreenProps) {
  return (
    <ThemedView style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.content}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <ThemedText style={styles.emoji}>😕</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ThemedText style={styles.title}>Coś poszło nie tak</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <View style={styles.errorBox}>
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.buttonContainer}>
          <DuolingoButton title="Spróbuj ponownie" onPress={onRetry} variant="primary" />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <ThemedText style={styles.hint}>
            Sprawdź czy backend działa na localhost:8000
          </ThemedText>
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
    width: '100%',
    maxWidth: 400,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  errorBox: {
    backgroundColor: '#ffdfe0',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ea2b2b',
    width: '100%',
  },
  errorText: {
    fontSize: 14,
    color: '#ea2b2b',
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  hint: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
