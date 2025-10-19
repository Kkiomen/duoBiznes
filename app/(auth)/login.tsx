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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { ThemedText } from '@/components/themed-text';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { useAuth } from '@/contexts/AuthContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme() ?? 'light';

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Wprowadź email i hasło');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await login({ email, password });
      // Navigation will be handled by _layout.tsx
      router.replace('/(tabs)');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Wystąpił błąd podczas logowania');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    // TODO: Implement Google Sign-In flow
    setError('Logowanie przez Google będzie wkrótce dostępne');
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
            {/* Logo/Header */}
            <View style={styles.header}>
              <Image
                source={require('@/assets/images/logo_aisello_white.svg')}
                style={styles.logo}
                contentFit="contain"
              />
              <ThemedText style={styles.title}>Witaj z powrotem!</ThemedText>
              <ThemedText style={styles.subtitle}>Zaloguj się, aby kontynuować naukę</ThemedText>
            </View>

            {/* Login Form */}
            <View style={styles.form}>
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
                  editable={!isLoading}
                />
              </View>

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
                  editable={!isLoading}
                />
              </View>

              {error && (
                <View style={styles.errorBox}>
                  <ThemedText style={styles.errorText}>⚠️ {error}</ThemedText>
                </View>
              )}

              <DuolingoButton
                title={isLoading ? 'Logowanie...' : 'Zaloguj się'}
                onPress={handleLogin}
                disabled={isLoading || !email || !password}
                variant={isLoading || !email || !password ? 'disabled' : 'primary'}
              />

              {/* Divider */}
              <View style={styles.divider}>
                <View style={[styles.dividerLine, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }]} />
                <ThemedText style={styles.dividerText}>lub</ThemedText>
                <View style={[styles.dividerLine, { backgroundColor: colorScheme === 'dark' ? '#374151' : '#E5E7EB' }]} />
              </View>

              {/* Google Sign-In Button */}
              <TouchableOpacity
                style={[styles.googleButton, { backgroundColor: colorScheme === 'dark' ? '#1a1f35' : '#fff' }]}
                onPress={handleGoogleLogin}
                disabled={isLoading}
              >
                <ThemedText style={styles.googleButtonText}>🌐 Zaloguj się przez Google</ThemedText>
              </TouchableOpacity>

              {/* Register Link */}
              <View style={styles.registerLink}>
                <ThemedText style={styles.registerText}>Nie masz konta? </ThemedText>
                <TouchableOpacity onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
                  <ThemedText style={styles.registerButton}>Zarejestruj się</ThemedText>
                </TouchableOpacity>
              </View>
            </View>
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  form: {
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#9CA3AF',
  },
  googleButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  registerText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  registerButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1cb0f6',
  },
});
