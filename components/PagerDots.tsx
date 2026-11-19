import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Reanimated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { overlay, pagerDots, photoShadows, radius } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';

type Props = {
  count: number;
  /** Sidposition som flyttal (0 = första sidan, 1,5 = mitt emellan andra och tredje). */
  position: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
  /** Direkt på foto utan bakgrund (heron): högre opacitet på inaktiva och mjuk skugga. */
  onPhoto?: boolean;
};

/**
 * Sidindikator (brief 19, Looken A:s pager dots): små cirklar där den aktiva
 * är längre (pill) och ljusare. Längd och opacitet interpoleras mot
 * scroll-positionen, så att den aktiva växer och den föregående krymper medan
 * man drar. Minska rörelse: punkterna byter direkt vid närmaste sida.
 * Återanvändbar (lightbox nu, hero senare).
 */
export default function PagerDots({ count, position, style, onPhoto = false }: Props) {
  if (count < 2) return null;
  return (
    <View style={[styles.row, style]} pointerEvents="none">
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} index={i} position={position} onPhoto={onPhoto} />
      ))}
    </View>
  );
}

function Dot({ index, position, onPhoto }: { index: number; position: SharedValue<number>; onPhoto: boolean }) {
  const reduceMotion = useReduceMotion();
  const inactive = onPhoto ? pagerDots.inactiveOpacityOnPhoto : pagerDots.inactiveOpacity;
  const dotStyle = useAnimatedStyle(() => {
    const p = reduceMotion ? Math.round(position.value) : position.value;
    const distance = Math.abs(p - index);
    return {
      width: interpolate(distance, [0, 1], [pagerDots.activeLength, pagerDots.size], Extrapolation.CLAMP),
      opacity: interpolate(distance, [0, 1], [1, inactive], Extrapolation.CLAMP),
    };
  });
  return <Reanimated.View style={[styles.dot, onPhoto && styles.dotOnPhoto, dotStyle]} />;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: pagerDots.gap,
  },
  dot: {
    height: pagerDots.size,
    borderRadius: radius.full,
    backgroundColor: overlay.onPhoto,
  },
  dotOnPhoto: {
    boxShadow: photoShadows.pagerDot,
  },
});
