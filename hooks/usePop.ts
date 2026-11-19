import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { motion } from '../theme';
import { useReduceMotion } from './useReduceMotion';

/**
 * "Pop" när något markeras (brief 09): skala 1 → popScale → 1.
 * Inte vid första render eller avmarkering, och inte med reduce motion.
 * Returnerar ett Animated-värde att lägga som `scale`.
 */
export function usePop(active: boolean): Animated.Value {
  const reduceMotion = useReduceMotion();
  const pop = useRef(new Animated.Value(1)).current;
  const wasActive = useRef(active);
  useEffect(() => {
    if (active && !wasActive.current && !reduceMotion) {
      pop.setValue(1);
      Animated.sequence([
        Animated.timing(pop, { toValue: motion.popScale, duration: motion.popIn, useNativeDriver: true }),
        Animated.spring(pop, { toValue: 1, ...motion.popSpring, useNativeDriver: true }),
      ]).start();
    }
    wasActive.current = active;
  }, [active, reduceMotion, pop]);
  return pop;
}
