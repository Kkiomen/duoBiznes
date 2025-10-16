import { ThemedText } from '@/components/themed-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';

type TipCardProps = {
  tip: string;
};

export function TipCard({ tip }: TipCardProps) {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(255, 150, 0, 0.2)', 'rgba(255, 150, 0, 0.08)']}
        style={styles.card}
      >
        <View style={styles.header}>
          <View style={styles.iconBubble}>
            <ThemedText style={styles.icon}>💡</ThemedText>
          </View>
          <ThemedText style={styles.title}>Wskazówka</ThemedText>
        </View>

        <ThemedText style={styles.tipText}>{tip}</ThemedText>
      </LinearGradient>
    </View>
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
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
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
  },
  icon: {
    fontSize: 24,
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
