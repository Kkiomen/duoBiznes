import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, SlideInLeft, ZoomIn } from 'react-native-reanimated';

type ExampleCardProps = {
  title: string;
  steps: { icon: string; text: string }[];
};

export function ExampleCard({ title, steps }: ExampleCardProps) {
  return (
    <Animated.View style={styles.container} entering={FadeInDown.duration(500).springify()}>
      <Animated.View style={styles.badge} entering={SlideInLeft.delay(100).duration(400).springify()}>
        <ThemedText style={styles.badgeText}>PRZYKŁAD</ThemedText>
      </Animated.View>

      <LinearGradient
        colors={['rgba(139, 92, 246, 0.15)', 'rgba(139, 92, 246, 0.05)']}
        style={styles.card}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <ThemedText style={styles.title}>{title}</ThemedText>
        </Animated.View>

        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <Animated.View
              key={index}
              style={styles.stepRow}
              entering={SlideInLeft.delay(300 + index * 100).duration(400).springify()}
            >
              <Animated.View
                style={styles.stepNumber}
                entering={ZoomIn.delay(350 + index * 100).duration(400).springify()}
              >
                <ThemedText style={styles.stepNumberText}>{index + 1}</ThemedText>
              </Animated.View>
              <View style={styles.stepIconBubble}>
                <ThemedText style={styles.stepIcon}>{step.icon}</ThemedText>
              </View>
              <ThemedText style={styles.stepText}>{step.text}</ThemedText>
            </Animated.View>
          ))}
        </View>
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
    backgroundColor: '#8b5cf6',
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
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  stepsContainer: {
    gap: 16,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#8b5cf6',
  },
  stepIconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: {
    fontSize: 24,
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: '#E5E7EB',
  },
});
