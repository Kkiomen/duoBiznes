import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { useProfile } from '@/hooks/use-profile';
import { Link, useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { profile } = useProfile();

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">duoBiznes AI</ThemedText>
        <HelloWave />
      </ThemedView>

      {/* User stats */}
      {profile && (
        <ThemedView style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ThemedText style={styles.statIcon}>🔥</ThemedText>
            <ThemedText style={styles.statValue}>{profile.stats.streak}</ThemedText>
            <ThemedText style={styles.statLabel}>Dni streak</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statIcon}>⚡</ThemedText>
            <ThemedText style={styles.statValue}>{profile.stats.xp}</ThemedText>
            <ThemedText style={styles.statLabel}>Całkowite XP</ThemedText>
          </View>
          <View style={styles.statCard}>
            <ThemedText style={styles.statIcon}>❤️</ThemedText>
            <ThemedText style={styles.statValue}>{profile.stats.hearts}</ThemedText>
            <ThemedText style={styles.statLabel}>Energia</ThemedText>
          </View>
        </ThemedView>
      )}

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">🎯 TEST 10 TYPÓW LEKCJI</ThemedText>
        <ThemedText>
          Przetestuj wszystkie nowe typy lekcji n8n: dopasuj pary, ułóż w kolejności, swipe cards i więcej!
        </ThemedText>
        <DuolingoButton
          title="Rozpocznij test"
          onPress={() => router.push('/lesson-demo')}
        />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({
              ios: 'cmd + d',
              android: 'cmd + m',
              web: 'F12',
            })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <Link href="/modal">
          <Link.Trigger>
            <ThemedText type="subtitle">Step 2: Explore</ThemedText>
          </Link.Trigger>
          <Link.Preview />
          <Link.Menu>
            <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
            <Link.MenuAction
              title="Share"
              icon="square.and.arrow.up"
              onPress={() => alert('Share pressed')}
            />
            <Link.Menu title="More" icon="ellipsis">
              <Link.MenuAction
                title="Delete"
                icon="trash"
                destructive
                onPress={() => alert('Delete pressed')}
              />
            </Link.Menu>
          </Link.Menu>
        </Link>

        <ThemedText>
          {`Tap the Explore tab to learn more about what's included in this starter app.`}
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          {`When you're ready, run `}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(88, 204, 2, 0.1)',
    borderRadius: 16,
    padding: 16,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 2, 0.2)',
  },
  statIcon: {
    fontSize: 32,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#58CC02',
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.7,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
