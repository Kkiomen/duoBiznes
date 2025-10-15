import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StyleSheet, View } from 'react-native';

type ProgressBarProps = {
  progress: number; // 0..1
};

export function ProgressBar({ progress }: ProgressBarProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const c = Colors[colorScheme].candy;
  const widthPercent = Math.max(0, Math.min(1, progress)) * 100;
  return (
    <View style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.06)' }]}>
      <View style={[styles.fill, { width: `${widthPercent}%`, backgroundColor: Colors[colorScheme].tint }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.08)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#22c55e',
  },
});


