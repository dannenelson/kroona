// Parallax på hero (brief 65, Samlings- och Partnerdetalj, inte produkter).
// Bilden rör sig långsammare än innehållet vid scroll (`motion.parallax`, 0,5:
// den flyttas ned med halva scrollen, så den syns röra sig med halva farten)
// och skalas upp från överkanten vid överscroll, så att den fyller glappet.
// Innehållet under hero måste ha temats bakgrund, så att bilden glider in
// bakom det. Minska rörelse: ingen parallax eller skalning.
import { useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import { motion } from '../theme';
import { useReduceMotion } from './useReduceMotion';

export function useParallaxHero(scrollY: SharedValue<number>, heroHeight: number) {
  const reduceMotion = useReduceMotion();
  return useAnimatedStyle(() => {
    const y = scrollY.value;
    if (reduceMotion || heroHeight <= 0) return { transformOrigin: 'top', transform: [{ translateY: 0 }, { scale: 1 }] };
    if (y >= 0) return { transformOrigin: 'top', transform: [{ translateY: y * motion.parallax }, { scale: 1 }] };
    // Överscroll: överkanten följer skärmens topp och bilden växer nedåt till hero-botten.
    return { transformOrigin: 'top', transform: [{ translateY: y }, { scale: 1 - y / heroHeight }] };
  });
}
