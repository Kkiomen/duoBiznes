import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { CourseProvider } from '@/contexts/CourseContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

/**
 * Main navigation component with auth protection
 */
function RootLayoutNav() {
  const { isAuthenticated, initialCheckComplete } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!initialCheckComplete) {
      // Still checking auth status - don't redirect yet
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // User is not authenticated and trying to access protected routes
      // Redirect to login
      console.log('🔒 Not authenticated - redirecting to login');
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // User is authenticated but still on auth screens
      // Redirect to main app
      console.log('✅ Authenticated - redirecting to main app');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, initialCheckComplete, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson" options={{ presentation: 'card' }} />
        <Stack.Screen name="lesson-demo" options={{ presentation: 'card' }} />
        <Stack.Screen name="lesson-n8n" options={{ presentation: 'card' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

/**
 * Root layout with providers
 */
export default function RootLayout() {
  return (
    <AuthProvider>
      <CourseProvider defaultCourseId={1} autoLoad={true}>
        <RootLayoutNav />
      </CourseProvider>
    </AuthProvider>
  );
}
