import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import '@/locales/i18n';

const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

/**
 * Main navigation component with auth protection
 */
function RootLayoutNav() {
  const { isAuthenticated, initialCheckComplete } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const [onboardingComplete, setOnboardingComplete] = useState<boolean | null>(null);

  // Check if onboarding was completed
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        setOnboardingComplete(completed === 'true');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setOnboardingComplete(false);
      }
    };

    checkOnboarding();
  }, []);

  useEffect(() => {
    if (!initialCheckComplete || onboardingComplete === null) {
      // Still checking auth status or onboarding - don't redirect yet
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === 'onboarding';

    // If not authenticated and onboarding not completed, show onboarding
    if (!isAuthenticated && !onboardingComplete && !inOnboarding) {
      console.log('👋 First time user - showing onboarding');
      router.replace('/onboarding');
      return;
    }

    if (!isAuthenticated && !inAuthGroup && !inOnboarding) {
      // User is not authenticated and trying to access protected routes
      // Redirect to login
      console.log('🔒 Not authenticated - redirecting to login');
      router.replace('/(auth)/login');
    } else if (isAuthenticated && (inAuthGroup || inOnboarding)) {
      // User is authenticated but still on auth/onboarding screens
      // Redirect to main app
      console.log('✅ Authenticated - redirecting to main app');
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, initialCheckComplete, segments, onboardingComplete]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ gestureEnabled: false }} />
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
    <LanguageProvider>
      <AuthProvider>
        <CourseProvider defaultCourseId={1} autoLoad={true}>
          <RootLayoutNav />
        </CourseProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
