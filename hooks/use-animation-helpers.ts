import { useEffect } from 'react';
import { useSharedValue, withSpring, withTiming, withSequence, withDelay, runOnJS } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

/**
 * Hook for spring press animation
 * Returns animated scale value that bounces on press
 */
export function useSpringPress(isPressed: boolean) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isPressed ? 0.95 : 1, {
      damping: 15,
      stiffness: 150,
    });
  }, [isPressed]);

  return scale;
}

/**
 * Hook for staggered animations
 * Animates items sequentially with delay
 */
export function useStaggeredAnimation(index: number, itemCount: number, delay: number = 50) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  useEffect(() => {
    const staggerDelay = index * delay;

    opacity.value = withDelay(
      staggerDelay,
      withTiming(1, { duration: 300 })
    );

    translateY.value = withDelay(
      staggerDelay,
      withSpring(0, {
        damping: 12,
        stiffness: 100,
      })
    );
  }, [index]);

  return { opacity, translateY };
}

/**
 * Hook for success animation
 * Scales up with bounce and triggers haptic feedback
 */
export function useSuccessAnimation(isSuccess: boolean) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (isSuccess) {
      // Haptic feedback
      runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);

      // Success animation: scale bounce
      scale.value = withSequence(
        withSpring(1.1, { damping: 8, stiffness: 200 }),
        withSpring(1, { damping: 12, stiffness: 150 })
      );
    }
  }, [isSuccess]);

  return { scale, opacity };
}

/**
 * Hook for error animation
 * Shakes horizontally and triggers haptic feedback
 */
export function useErrorAnimation(isError: boolean) {
  const translateX = useSharedValue(0);

  useEffect(() => {
    if (isError) {
      // Haptic feedback
      runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Error);

      // Shake animation
      translateX.value = withSequence(
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(-10, { duration: 50 }),
        withTiming(10, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    }
  }, [isError]);

  return translateX;
}

/**
 * Hook for pulse animation
 * Creates subtle looping pulse effect
 */
export function usePulseAnimation(shouldPulse: boolean = true) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (shouldPulse) {
      scale.value = withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      );

      // Loop
      const interval = setInterval(() => {
        scale.value = withSequence(
          withTiming(1.05, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        );
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [shouldPulse]);

  return scale;
}

/**
 * Hook for entrance animation
 * Fades in and slides up
 */
export function useEntranceAnimation(delay: number = 0) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(30);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 400 })
    );

    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 15,
        stiffness: 120,
      })
    );
  }, []);

  return { opacity, translateY };
}

/**
 * Trigger haptic feedback on selection
 */
export function triggerSelectionHaptic() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
}

/**
 * Trigger haptic feedback on success
 */
export function triggerSuccessHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}

/**
 * Trigger haptic feedback on error
 */
export function triggerErrorHaptic() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
}
