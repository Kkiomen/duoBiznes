import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text } from 'react-native';

type DuolingoButtonProps = {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'disabled';
  disabled?: boolean;
};

export function DuolingoButton({ 
  onPress, 
  title, 
  variant = 'primary',
  disabled = false 
}: DuolingoButtonProps) {
  const getColors = () => {
    if (disabled || variant === 'disabled') return ['#e5e5e5', '#d4d4d4'];
    if (variant === 'secondary') return ['#1cb0f6', '#1899d6'];
    return ['#58cc02', '#46a302']; // primary green
  };

  const getTextColor = () => {
    if (disabled || variant === 'disabled') return '#afafaf';
    return '#fff';
  };

  const getBorderColor = () => {
    if (disabled || variant === 'disabled') return '#afafaf';
    if (variant === 'secondary') return '#1899d6';
    return '#46a302';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || variant === 'disabled'}
      style={({ pressed }) => [
        styles.container,
        { transform: [{ scale: pressed ? 0.98 : 1 }] }
      ]}
    >
      <LinearGradient
        colors={getColors()}
        style={styles.button}
      >
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  bottomBorder: {
    position: 'absolute',
    bottom: 0,
    left: 8,
    right: 8,
    height: 6,
    borderRadius: 16,
    zIndex: -1,
  },
  text: {
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

