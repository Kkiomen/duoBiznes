import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Animated, { FadeInDown, SlideInLeft, ZoomIn } from 'react-native-reanimated';

type TipCardProps = {
  tip: string;
};

export function TipCard({ tip }: TipCardProps) {
  return (
    <Animated.View style={styles.container} entering={SlideInLeft.duration(500)}>
      <LinearGradient
        colors={['rgba(255, 150, 0, 0.2)', 'rgba(255, 150, 0, 0.08)']}
        style={styles.card}
      >
        <Animated.View style={styles.header} entering={FadeInDown.delay(100).duration(400)}>
          <Animated.View style={styles.iconBubble} entering={ZoomIn.delay(200).duration(500)}>
            <ThemedText style={styles.icon}>💡</ThemedText>
          </Animated.View>
          <ThemedText style={styles.title}>Wskazówka</ThemedText>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <ThemedText style={styles.tipText}>{tip}</ThemedText>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 150, 0, 0.4)',
    shadowColor: '#ff9600',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 150, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ff9600',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  icon: {
    fontSize: 24,
    lineHeight: 30,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFA500',
    letterSpacing: -0.3,
  },
  tipText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#E5E7EB',
  },
});
