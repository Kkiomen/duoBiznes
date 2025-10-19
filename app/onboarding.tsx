import { ThemedText } from '@/components/themed-text';
import { DuolingoButton } from '@/components/ui/duolingo-button';
import { useLanguage } from '@/contexts/LanguageContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Pressable,
    ScrollView,
    StyleSheet,
    View,
} from 'react-native';
import Animated, {
    FadeIn,
    FadeInDown,
    FadeInRight,
    FadeOut,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ONBOARDING_COMPLETED_KEY = '@onboarding_completed';

interface OnboardingSlide {
  id: number;
  emoji: string;
  titleKey: string;
  descriptionKey: string;
  gradient: [string, string];
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    emoji: '🚀',
    titleKey: 'onboarding.slide1.title',
    descriptionKey: 'onboarding.slide1.description',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    emoji: '🤖',
    titleKey: 'onboarding.slide2.title',
    descriptionKey: 'onboarding.slide2.description',
    gradient: ['#834d9b', '#d04ed6'], // Ciemny fioletowo-różowy
  },
  {
    id: 3,
    emoji: '📝',
    titleKey: 'onboarding.slide3.title',
    descriptionKey: 'onboarding.slide3.description',
    gradient: ['#2c3e50', '#3498db'], // Ciemniejszy niebieski
  },
  {
    id: 4,
    emoji: '📚',
    titleKey: 'onboarding.slide4.title',
    descriptionKey: 'onboarding.slide4.description',
    gradient: ['#0f2027', '#2c5364'], // Ciemny niebieski-zielony
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleSkip = async () => {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handleGetStarted = async () => {
    console.log('🚀 Rozpocznij clicked - redirecting to register');
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    router.replace('/(auth)/register');
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = slides[currentSlide];
  const isLastSlide = currentSlide === slides.length - 1;

  return (
    <View style={styles.container}>
      {/* Background Gradient */}
      <LinearGradient
        colors={slide.gradient}
        style={StyleSheet.absoluteFill}
      />

      {/* Logo */}
      <Animated.View
        entering={FadeInDown.delay(200).duration(600)}
        style={styles.logoContainer}
      >
        <Image
          source={require('@/assets/images/logo_aisello_white.svg')}
          style={styles.logo}
          contentFit="contain"
        />
      </Animated.View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={slide.id}
          entering={FadeInRight.duration(400)}
          exiting={FadeOut.duration(200)}
          style={styles.slideContent}
        >
          {/* Emoji */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(600)}
            style={styles.emojiContainer}
          >
            <ThemedText style={styles.emoji}>{slide.emoji}</ThemedText>
          </Animated.View>

          {/* Title */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={styles.textContainer}
          >
            <ThemedText style={styles.title}>
              {t(slide.titleKey)}
            </ThemedText>
          </Animated.View>

          {/* Description */}
          <Animated.View
            entering={FadeInDown.delay(500).duration(600)}
            style={styles.textContainer}
          >
            <ThemedText style={styles.description}>
              {t(slide.descriptionKey)}
            </ThemedText>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Navigation */}
      <Animated.View
        entering={FadeInDown.delay(600).duration(600)}
        style={styles.bottomContainer}
      >
        {/* Dots Indicator */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentSlide ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsContainer}>
          {currentSlide > 0 ? (
            <Pressable
              onPress={handleBack}
              style={styles.backButton}
            >
              <ThemedText style={styles.backButtonText}>
                {t('onboarding.back')}
              </ThemedText>
            </Pressable>
          ) : !isLastSlide ? (
            <Pressable
              onPress={handleSkip}
              style={styles.backButton}
            >
              <ThemedText style={styles.backButtonText}>
                {t('onboarding.skip')}
              </ThemedText>
            </Pressable>
          ) : null}

          <View style={styles.mainButton}>
            {isLastSlide ? (
              <DuolingoButton
                title={t('onboarding.getStarted')}
                onPress={handleGetStarted}
                variant="primary"
              />
            ) : (
              <DuolingoButton
                title={t('onboarding.next')}
                onPress={handleNext}
                variant="primary"
              />
            )}
          </View>
        </View>

        {/* Already have account link */}
        {isLastSlide && (
          <Animated.View
            entering={FadeIn.delay(200).duration(400)}
            style={styles.loginLink}
          >
            <ThemedText style={styles.loginText}>
              {t('onboarding.hasAccount')}
            </ThemedText>
            <Pressable onPress={handleSkip}>
              <ThemedText style={styles.loginButton}>
                {t('onboarding.login')}
              </ThemedText>
            </Pressable>
          </Animated.View>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 20,
  },
  logo: {
    width: 180,
    height: 60,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  slideContent: {
    alignItems: 'center',
    gap: 24,
  },
  emojiContainer: {
    marginBottom: 20,
  },
  emoji: {
    fontSize: 120,
    lineHeight: 140,
    textAlign: 'center',
  },
  textContainer: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  description: {
    fontSize: 18,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: 28,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bottomContainer: {
    paddingHorizontal: 32,
    paddingBottom: 50,
    gap: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
  dotInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  mainButton: {
    flex: 1,
  },
  loginLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginRight: 4,
  },
  loginButton: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

