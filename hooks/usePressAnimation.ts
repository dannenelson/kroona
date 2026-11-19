import { useMemo, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { motion } from '../theme';
import { useReduceMotion } from './useReduceMotion';

/**
 * Animerad tryck-feedback (brief 06): in snabbt, ut med lätt fjäder.
 * Ett värde 0 → 1 driver både nedskalning och ytbyte (overlay-opacitet),
 * med native driver. Reduce motion: ingen skala, bara ytbytet tonar.
 *
 *   const press = usePressAnimation(motion.pressedScale);
 *   <Pressable onPressIn={press.onPressIn} onPressOut={press.onPressOut}>
 *     <Animated.View style={press.scaleStyle}>…
 *       <Animated.View style={[overlay, { opacity: press.progress }]} />
 */
export function usePressAnimation(scale: number = motion.pressedScale) {
  const reduceMotion = useReduceMotion();
  const progress = useRef(new Animated.Value(0)).current;

  return useMemo(() => {
    const onPressIn = () => {
      progress.stopAnimation();
      Animated.timing(progress, {
        toValue: 1,
        duration: motion.pressIn,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    };
    const onPressOut = () => {
      progress.stopAnimation();
      if (reduceMotion) {
        Animated.timing(progress, {
          toValue: 0,
          duration: motion.duration.fast,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(progress, {
          toValue: 0,
          ...motion.pressOutSpring,
          useNativeDriver: true,
        }).start();
      }
    };
    /** Nollställer direkt utan fjäder (t.ex. när kortet lyfts till menyn). */
    const reset = () => {
      progress.stopAnimation();
      progress.setValue(0);
    };
    const scaleValue = reduceMotion
      ? 1
      : progress.interpolate({ inputRange: [0, 1], outputRange: [1, scale] });
    // Opacitet får inte gå under 0 när fjädern svänger förbi.
    const opacity = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
      extrapolate: 'clamp',
    });
    return {
      onPressIn,
      onPressOut,
      reset,
      progress: opacity,
      scaleStyle: { transform: [{ scale: scaleValue }] },
    };
  }, [progress, reduceMotion, scale]);
}
