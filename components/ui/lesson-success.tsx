import { ThemedText } from '@/components/themed-text';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { Dimensions, StyleSheet, View, useColorScheme } from 'react-native';
import Animated, {
    FadeInUp,
    ZoomIn,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withRepeat,
    withSequence,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface LessonSuccessProps {
  title?: string;
  message?: string;
  xpEarned?: number;
}

export function LessonSuccess({
  title,
  message,
  xpEarned,
}: LessonSuccessProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { t } = useLanguage();
  
  const displayTitle = title || t('lesson.success.title');
  const displayMessage = message || t('lesson.success.lessonComplete');

  // Confetti particles (increased count)
  const confettiCount = 50;
  const confetti = Array.from({ length: confettiCount }, (_, i) => i);

  // Fireworks (launching from bottom)
  const fireworksCount = 8;
  const fireworks = Array.from({ length: fireworksCount }, (_, i) => i);

  return (
    <View style={styles.container}>
      {/* Animated Gradient Background */}
      <AnimatedBackground isDark={isDark} />

      {/* Fireworks from bottom */}
      {fireworks.map((i) => (
        <Firework key={`firework-${i}`} index={i} isDark={isDark} />
      ))}

      {/* Confetti from top */}
      {confetti.map((i) => (
        <ConfettiParticle key={`confetti-${i}`} index={i} isDark={isDark} />
      ))}

      {/* Main Content */}
      <Animated.View
        style={styles.content}
        entering={ZoomIn.duration(800).delay(400)}
      >
        {/* Trophy Icon with enhanced animation */}
        <TrophyIcon />

        {/* Stars */}
        <View style={styles.starsContainer}>
          <StarIcon delay={1000} />
          <StarIcon delay={1100} scale={1.4} />
          <StarIcon delay={1200} />
        </View>

        {/* Title with bounce */}
        <Animated.View entering={FadeInUp.duration(600).delay(800)}>
          <ThemedText style={[styles.title, isDark && styles.titleDark]}>
            {displayTitle}
          </ThemedText>
        </Animated.View>

        {/* Message */}
        <Animated.View entering={FadeInUp.duration(600).delay(900)}>
          <ThemedText style={[styles.message, isDark && styles.messageDark]}>
            {displayMessage}
          </ThemedText>
        </Animated.View>

        {/* XP Badge if provided */}
        {xpEarned && (
          <Animated.View
            entering={ZoomIn.duration(600).delay(1100)}
            style={styles.xpContainer}
          >
            <AnimatedXPBadge xp={xpEarned} isDark={isDark} />
          </Animated.View>
        )}

        {/* Achievement Badge */}
        <Animated.View
          entering={ZoomIn.duration(600).delay(1200)}
          style={styles.achievementContainer}
        >
          <View style={[styles.achievementBadge, isDark && styles.achievementBadgeDark]}>
            <ThemedText style={styles.achievementIcon}>🏆</ThemedText>
            <ThemedText style={[styles.achievementText, isDark && styles.achievementTextDark]}>
              {t('lesson.success.title')}
            </ThemedText>
          </View>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function TrophyIcon() {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Initial zoom in
    scale.value = withDelay(
      400,
      withSpring(1, {
        damping: 8,
        stiffness: 100,
      })
    );

    // Continuous pulse
    scale.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withSpring(1.1, { damping: 10 }),
          withSpring(1, { damping: 10 })
        ),
        -1,
        false
      )
    );

    // Wiggle animation
    rotate.value = withDelay(
      1200,
      withRepeat(
        withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 200 }),
          withTiming(0, { duration: 100 })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={styles.trophyIcon}>🏆</ThemedText>
    </Animated.View>
  );
}

function StarIcon({ delay = 0, scale: targetScale = 1 }) {
  const scale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      delay,
      withSpring(targetScale, {
        damping: 6,
        stiffness: 80,
      })
    );

    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: 3000 }),
        -1,
        false
      )
    );
  }, [delay, targetScale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedText style={styles.star}>⭐</ThemedText>
    </Animated.View>
  );
}

// Animated Background with gradient
function AnimatedBackground({ isDark }: { isDark: boolean }) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
      <LinearGradient
        colors={
          isDark
            ? ['rgba(88, 204, 2, 0.15)', 'rgba(255, 215, 0, 0.1)', 'rgba(236, 72, 153, 0.1)']
            : ['rgba(88, 204, 2, 0.08)', 'rgba(255, 215, 0, 0.05)', 'rgba(236, 72, 153, 0.05)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
}

// Firework launching from bottom
function Firework({ index, isDark }: { index: number; isDark: boolean }) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = 300 + index * 150;
    const startX = (SCREEN_WIDTH / 10) * (index + 1);
    const endY = -SCREEN_HEIGHT * 0.5 - Math.random() * 200;
    const endX = startX + (Math.random() - 0.5) * 100;

    // Launch from bottom
    translateX.value = startX;
    translateY.value = SCREEN_HEIGHT;

    opacity.value = withDelay(delay, withTiming(1, { duration: 50 }));

    translateY.value = withDelay(
      delay,
      withTiming(endY, {
        duration: 1000 + Math.random() * 500,
      })
    );

    translateX.value = withDelay(
      delay,
      withTiming(endX, {
        duration: 1000 + Math.random() * 500,
      })
    );

    // Fade out
    opacity.value = withDelay(delay + 800, withTiming(0, { duration: 400 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const colors = ['#FFD700', '#FF6B9D', '#58CC02', '#4ECDC4', '#AA96DA', '#F97316', '#FF9600', '#ec4899'];
  const color = colors[index % colors.length];

  return (
    <>
      <Animated.View style={[styles.firework, animatedStyle]}>
        <View style={[styles.fireworkCore, { backgroundColor: color }]} />
      </Animated.View>
      {/* Burst particles when firework reaches peak */}
      <FireworkBurst index={index} color={color} />
    </>
  );
}

// Burst particles exploding from firework
function FireworkBurst({ index, color }: { index: number; color: string }) {
  const burstCount = 12;
  const bursts = Array.from({ length: burstCount }, (_, i) => i);

  return (
    <>
      {bursts.map((burstIndex) => (
        <BurstParticle
          key={`burst-${index}-${burstIndex}`}
          fireworkIndex={index}
          burstIndex={burstIndex}
          burstCount={burstCount}
          color={color}
        />
      ))}
    </>
  );
}

// Individual burst particle
function BurstParticle({
  fireworkIndex,
  burstIndex,
  burstCount,
  color,
}: {
  fireworkIndex: number;
  burstIndex: number;
  burstCount: number;
  color: string;
}) {
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    const fireworkDelay = 300 + fireworkIndex * 150;
    const burstDelay = fireworkDelay + 800; // Burst when firework reaches peak
    const angle = (burstIndex / burstCount) * Math.PI * 2;
    const distance = 80 + Math.random() * 60;

    const startX = (SCREEN_WIDTH / 10) * (fireworkIndex + 1);
    const startY = -SCREEN_HEIGHT * 0.5 - Math.random() * 200;

    translateX.value = startX;
    translateY.value = startY;

    // Burst out
    opacity.value = withDelay(burstDelay, withTiming(1, { duration: 50 }));

    translateX.value = withDelay(
      burstDelay,
      withTiming(startX + Math.cos(angle) * distance, {
        duration: 600,
      })
    );

    translateY.value = withDelay(
      burstDelay,
      withTiming(startY + Math.sin(angle) * distance + 50, {
        duration: 600,
      })
    );

    scale.value = withDelay(
      burstDelay,
      withSequence(
        withTiming(1.2, { duration: 100 }),
        withTiming(0, { duration: 500 })
      )
    );

    opacity.value = withDelay(burstDelay + 300, withTiming(0, { duration: 300 }));
  }, [fireworkIndex, burstIndex, burstCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.burstParticle, animatedStyle]}>
      <View style={[styles.burstCore, { backgroundColor: color }]} />
    </Animated.View>
  );
}

// Animated XP Badge
function AnimatedXPBadge({ xp, isDark }: { xp: number; isDark: boolean }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(withSpring(1.1, { damping: 8 }), withSpring(1, { damping: 8 })),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.xpBadge, isDark && styles.xpBadgeDark, animatedStyle]}>
      <ThemedText style={styles.xpText}>+{xp} XP</ThemedText>
    </Animated.View>
  );
}

function ConfettiParticle({ index, isDark }: { index: number; isDark: boolean }) {
  const translateY = useSharedValue(-100);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(0);

  // Random colors for confetti
  const colors = ['#FFD700', '#FF6B9D', '#4ECDC4', '#95E1D3', '#F38181', '#AA96DA', '#FCBAD3', '#58CC02', '#F97316'];
  const color = colors[index % colors.length];

  // Random emoji confetti
  const emojis = ['🎉', '✨', '🎊', '💫', '⭐', '🌟', '💛', '💙', '💚', '💜', '🔥', '💥'];
  const emoji = emojis[index % emojis.length];

  useEffect(() => {
    const randomDelay = Math.random() * 1500;
    const randomX = (Math.random() - 0.5) * SCREEN_WIDTH;
    const randomRotation = Math.random() * 1080;
    const duration = 2500 + Math.random() * 1500;

    opacity.value = withDelay(randomDelay, withTiming(1, { duration: 100 }));

    translateY.value = withDelay(
      randomDelay,
      withTiming(SCREEN_HEIGHT + 100, {
        duration,
      })
    );

    translateX.value = withDelay(
      randomDelay,
      withTiming(randomX, { duration })
    );

    rotate.value = withDelay(randomDelay, withTiming(randomRotation, { duration }));

    // Fade out at the end
    opacity.value = withDelay(randomDelay + duration - 500, withTiming(0, { duration: 500 }));
  }, [index]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.confetti, animatedStyle]}>
      <ThemedText style={[styles.confettiEmoji, { color }]}>
        {emoji}
      </ThemedText>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  content: {
    alignItems: 'center',
    gap: 24,
    zIndex: 10,
  },
  trophyIcon: {
    fontSize: 120,
    lineHeight: 140,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: -20,
    marginBottom: 30,
  },
  star: {
    fontSize: 36,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFD700',
    textAlign: 'center',
    textShadowColor: 'rgba(255, 215, 0, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginTop: 30,
  },
  titleDark: {
    color: '#FFD700',
      marginTop: 30,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    color: '#4a5568',
    marginTop: 8,
  },
  messageDark: {
    color: '#cbd5e0',
  },
  achievementContainer: {
    marginTop: 24,
    paddingBottom: 30
  },
  achievementBadge: {
    backgroundColor: '#fff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  achievementBadgeDark: {
    backgroundColor: '#1f2937',
    borderColor: '#FFD700',
  },
  achievementIcon: {
    fontSize: 32,
  },
  achievementText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2d3748',
  },
  achievementTextDark: {
    color: '#f7fafc',
  },
  confetti: {
    position: 'absolute',
    top: 0,
  },
  confettiEmoji: {
    fontSize: 24,
  },
  firework: {
    position: 'absolute',
    zIndex: 5,
  },
  fireworkCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  burstParticle: {
    position: 'absolute',
    zIndex: 5,
  },
  burstCore: {
    width: 6,
    height: 6,
    borderRadius: 3,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 6,
  },
  xpContainer: {
    marginTop: 12,
  },
  xpBadge: {
    backgroundColor: '#58CC02',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#58CC02',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
    borderWidth: 3,
    borderColor: '#fff',
  },
  xpBadgeDark: {
    backgroundColor: '#58CC02',
    borderColor: '#1f2937',
  },
  xpText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});