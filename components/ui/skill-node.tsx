import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { LinearGradient } from 'expo-linear-gradient';
import type { Href } from 'expo-router';
import { Link } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

type SkillNodeProps = {
  title: string;
  level: number;
  locked?: boolean;
  completed?: boolean;
  current?: boolean;
  progress?: number; // 0-3 (liczba gwiazdek)
  icon?: string;
  color?: 'blue' | 'green' | 'yellow' | 'pink' | 'purple' | 'orange';
  href?: Href;
};

export function SkillNode({ 
  title, 
  level, 
  locked, 
  completed,
  current,
  progress = 0,
  icon = '🤖',
  color = 'green',
  href = '/lesson' 
}: SkillNodeProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme].candy;
  
  const colorMap: Record<string, readonly [string, string]> = {
    blue: [c.blue, '#3b82f6'] as const,
    green: ['#58cc02', '#46a302'] as const,
    yellow: [c.yellow, '#eab308'] as const,
    pink: [c.pink, '#ec4899'] as const,
    purple: [c.purple, '#8b5cf6'] as const,
    orange: [c.orange, '#f97316'] as const,
  };

  const gradientColors: readonly [string, string] = locked
    ? ['#9ca3af', '#6b7280'] as const
    : colorMap[color];

  if (locked) {
    return (
      <View style={styles.container}>
        <View style={styles.pressable}>
          <View style={styles.nodeWrapper}>
            <LinearGradient
              colors={['#d1d5db', '#9ca3af']}
              style={[styles.outerRing, styles.lockedRing]}
            >
              <View style={[styles.innerRing, { backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#f3f4f6' }]}>
                <View style={styles.iconCircle}>
                  <ThemedText style={[styles.icon, styles.lockedIcon]}>🔒</ThemedText>
                </View>
              </View>
            </LinearGradient>

            {/* Lock message badge */}
            <View style={styles.lockBadge}>
              <ThemedText style={styles.lockText}>Ukończ poprzednie</ThemedText>
            </View>
          </View>
        </View>
        <ThemedText style={[styles.title, styles.lockedTitle]}>
          {title}
        </ThemedText>
      </View>
    );
  }

  return (
    <Link href={href} asChild>
      <Pressable 
        style={({ pressed }) => [
          styles.container,
          { transform: [{ scale: pressed ? 0.95 : 1 }] }
        ]}
      >
        <View style={styles.pressable}>
          <View style={styles.nodeWrapper}>
            <LinearGradient
              colors={gradientColors}
              style={[styles.outerRing]}
            >
              <View style={[styles.innerRing, { backgroundColor: colorScheme === 'dark' ? '#1a1a1a' : '#fff' }]}>
                <LinearGradient
                  colors={gradientColors}
                  style={styles.iconCircle}
                >
                  <ThemedText style={styles.icon}>{icon}</ThemedText>
                </LinearGradient>
              </View>
            </LinearGradient>

            {/* Progress stars */}
            {progress > 0 && (
              <View style={styles.starsContainer}>
                {[1, 2, 3].map((i) => (
                  <ThemedText key={i} style={styles.star}>
                    {i <= progress ? '⭐' : '☆'}
                  </ThemedText>
                ))}
              </View>
            )}

            {/* Check mark for completed */}
            {completed && !current && (
              <View style={styles.checkmark}>
                <ThemedText style={styles.checkmarkText}>✓</ThemedText>
              </View>
            )}
          </View>
        </View>
        
        <ThemedText style={styles.title}>
          {title}
        </ThemedText>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 10,
    width: 110,
  },
  pressable: {
    width: 110,
    height: 110,
  },
  nodeWrapper: {
    width: 110,
    height: 110,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  lockedRing: {
    shadowOpacity: 0.1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  innerRing: {
    width: 98,
    height: 98,
    borderRadius: 49,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    padding: 4,
  },
  icon: {
    fontSize: 44,
    lineHeight: 60,
    height: 60,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  lockedIcon: {
    fontSize: 40,
    lineHeight: 52,
    height: 52,
    opacity: 0.6,
    includeFontPadding: false,
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  starsContainer: {
    position: 'absolute',
    bottom: -4,
    flexDirection: 'row',
    gap: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  star: {
    fontSize: 13,
    lineHeight: 16,
    includeFontPadding: false,
  },
  checkmark: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#58cc02',
    borderRadius: 14,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: 18,
    includeFontPadding: false,
  },
  lockedTitle: {
    opacity: 0.4,
    fontWeight: '600',
  },
  lockBadge: {
    position: 'absolute',
    bottom: -8,
    backgroundColor: 'rgba(107,114,128,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  lockText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});


