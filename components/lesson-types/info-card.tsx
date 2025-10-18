import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, SlideInLeft, ZoomIn } from 'react-native-reanimated';

type InfoCardProps = {
  icon: string;
  heading: string;
  text: string;
  bullets?: string[];
};

export function InfoCard({ icon, heading, text, bullets }: InfoCardProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(500)}>
      <Animated.View style={styles.badge} entering={SlideInLeft.delay(100).duration(400)}>
        <ThemedText style={styles.badgeText}>NOWA WIEDZA</ThemedText>
      </Animated.View>

      <LinearGradient
        colors={['rgba(28, 176, 246, 0.15)', 'rgba(28, 176, 246, 0.05)']}
        style={styles.card}
      >
        <Animated.View style={styles.iconContainer} entering={ZoomIn.delay(200).duration(600)}>
          <LinearGradient
            colors={['#1cb0f6', '#0e8ecb']}
            style={styles.iconBubble}
          >
            <ThemedText style={styles.icon}>{icon}</ThemedText>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <ThemedText style={styles.heading}>{heading}</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <ThemedText style={styles.text}>{text}</ThemedText>
        </Animated.View>

        {bullets && bullets.length > 0 && (
          <View style={styles.bulletsContainer}>
            {bullets.map((bullet, index) => (
              <Animated.View
                key={index}
                style={styles.bulletRow}
                entering={FadeInDown.delay(500 + index * 80).duration(400)}
              >
                <ThemedText style={styles.bulletPoint}>•</ThemedText>
                <ThemedText style={styles.bulletText}>{bullet}</ThemedText>
              </Animated.View>
            ))}
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#1cb0f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(28, 176, 246, 0.2)',
    shadowColor: '#1cb0f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
    gap: 16,
  },
  iconContainer: {
    alignSelf: 'center',
  },
  iconBubble: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#1cb0f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  icon: {
    fontSize: 40,
    lineHeight: 48,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  bulletsContainer: {
    gap: 12,
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 20,
    color: '#1cb0f6',
    lineHeight: 24,
  },
  bulletText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
    color: '#E5E7EB',
  },
});
