import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Initial redirect screen
 * Checks auth state and redirects to either login or main app
 */
export default function IndexScreen() {
  const { isAuthenticated, initialCheckComplete } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  useEffect(() => {
    if (!initialCheckComplete) {
      // Still checking auth - wait
      return;
    }

    // Auth check complete - redirect based on auth status
    if (isAuthenticated) {
      console.log('✅ User authenticated - redirecting to main app');
      router.replace('/(tabs)');
    } else {
      console.log('🔒 User not authenticated - redirecting to login');
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, initialCheckComplete]);

  // Show loading while checking auth
  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#F8FAFC' }]}>
      <ThemedText style={styles.emoji}>🔐</ThemedText>
      <ActivityIndicator size="large" color="#1cb0f6" />
      <ThemedText style={styles.text}>Sprawdzanie autoryzacji...</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  emoji: {
    fontSize: 80,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#9CA3AF',
  },
});
