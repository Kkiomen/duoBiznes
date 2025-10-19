import { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import Animated, { FadeInRight, FadeOutLeft } from 'react-native-reanimated';
import { ThemedText } from '@/components/themed-text';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RegisterScreen() {
  // Multi-step state
  const [step, setStep] = useState(0);

  // Form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  const nextStep = () => {
    setError(null);
    setStep(step + 1);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
  };

  const handleRegister = async () => {
    // Final validation
    if (!firstName || !email || !password || !passwordConfirmation) {
      setError('Wypełnij wszystkie wymagane pola');
      return;
    }

    if (password.length < 8) {
      setError('Hasło musi mieć minimum 8 znaków');
      return;
    }

    if (password !== passwordConfirmation) {
      setError('Hasła nie są identyczne');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await register({
        first_name: firstName,
        last_name: lastName || '', // Opcjonalne - może być pusty string
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      // Navigation will be handled by _layout.tsx
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Wystąpił błąd podczas rejestracji');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Validation for each step
  const canProceedStep0 = firstName.trim().length > 0;
  const canProceedStep1 = email.trim().length > 0 && email.includes('@');
  const canProceedStep2 = password.length >= 8 && passwordConfirmation.length >= 8;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <ThemedText style={styles.stepTitle}>Hej!</ThemedText>
              <ThemedText style={styles.stepSubtitle}>Powiedz nam jak się nazywasz</ThemedText>
            </View>

            <View style={styles.stepForm}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Imię</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colorScheme === 'dark' ? '#1a1f35' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                  placeholder="Jan"
                  placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus
                />
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Nazwisko</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colorScheme === 'dark' ? '#1a1f35' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                  placeholder="Kowalski"
                  placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={lastName}
                  onChangeText={setLastName}
                  autoCapitalize="words"
                  autoCorrect={false}
                />
                <ThemedText style={styles.hint}>Możesz pominąć</ThemedText>
              </View>

              <DuolingoButton
                title="Dalej"
                onPress={nextStep}
                disabled={!canProceedStep0}
                variant={!canProceedStep0 ? 'disabled' : 'primary'}
              />
            </View>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <ThemedText style={styles.stepTitle}>Świetnie, {firstName}!</ThemedText>
              <ThemedText style={styles.stepSubtitle}>Jaki jest Twój adres email?</ThemedText>
            </View>

            <View style={styles.stepForm}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Email</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colorScheme === 'dark' ? '#1a1f35' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                  placeholder="twoj@email.com"
                  placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
              </View>

              <View style={styles.buttonRow}>
                <Pressable onPress={prevStep} style={styles.backButton}>
                  <ThemedText style={styles.backButtonText}>← Wstecz</ThemedText>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <DuolingoButton
                    title="Dalej"
                    onPress={nextStep}
                    disabled={!canProceedStep1}
                    variant={!canProceedStep1 ? 'disabled' : 'primary'}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View entering={FadeInRight} exiting={FadeOutLeft} style={styles.stepContainer}>
            <View style={styles.stepHeader}>
              <ThemedText style={styles.stepTitle}>Ostatni krok!</ThemedText>
              <ThemedText style={styles.stepSubtitle}>Wymyśl bezpieczne hasło</ThemedText>
            </View>

            <View style={styles.stepForm}>
              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Hasło</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colorScheme === 'dark' ? '#1a1f35' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                />
                <ThemedText style={styles.hint}>Minimum 8 znaków</ThemedText>
              </View>

              <View style={styles.inputGroup}>
                <ThemedText style={styles.label}>Potwierdź hasło</ThemedText>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colorScheme === 'dark' ? '#1a1f35' : '#fff', color: colorScheme === 'dark' ? '#fff' : '#000' },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colorScheme === 'dark' ? '#6B7280' : '#9CA3AF'}
                  value={passwordConfirmation}
                  onChangeText={setPasswordConfirmation}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
                </View>
              )}

              <View style={styles.buttonRow}>
                <Pressable onPress={prevStep} style={styles.backButton} disabled={isLoading}>
                  <ThemedText style={styles.backButtonText}>← Wstecz</ThemedText>
                </Pressable>
                <View style={{ flex: 1 }}>
                  <DuolingoButton
                    title={isLoading ? 'Tworzenie...' : 'Utwórz konto'}
                    onPress={handleRegister}
                    disabled={!canProceedStep2 || isLoading}
                    variant={!canProceedStep2 || isLoading ? 'disabled' : 'primary'}
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colorScheme === 'dark' ? '#0B1220' : '#F8FAFC' }]}>
      <LinearGradient
        colors={colorScheme === 'dark' ? ['#0B1220', '#1a1f35', '#0B1220'] : ['#F8FAFC', '#E0F2FE', '#F8FAFC']}
        style={styles.gradient}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require('@/assets/images/logo_aisello_white.svg')}
                style={styles.logo}
                contentFit="contain"
              />
            </View>

            {/* Current Step */}
            {renderStep()}

            {/* Login Link - tylko na pierwszym kroku */}
            {step === 0 && (
              <View style={styles.loginLink}>
                <ThemedText style={styles.loginText}>Masz już konto? </ThemedText>
                <TouchableOpacity onPress={() => router.back()}>
                  <ThemedText style={styles.loginButton}>Zaloguj się</ThemedText>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 180,
    height: 60,
  },
  stepContainer: {
    gap: 32,
  },
  stepHeader: {
    alignItems: 'center',
    gap: 12,
  },
  stepEmoji: {
    fontSize: 64,
  },
  stepTitle: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 18,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  stepForm: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  hint: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: -4,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1cb0f6',
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  loginText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  loginButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1cb0f6',
  },
});
