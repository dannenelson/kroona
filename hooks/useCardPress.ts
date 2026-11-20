import { useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { motion } from '../theme';
import { usePressAnimation } from './usePressAnimation';

/**
 * Kortens tryckrespons (brief 07, 31): ingen opacitet, bara krympning med
 * ungefär lika många pixlar på alla kortstorlekar (`motion.pressInsetPx`,
 * begränsat till `pressScaleMin`–`pressScaleMax`). In snabbt, ut med fjäder
 * (usePressAnimation). Minska rörelse: ingen skala.
 *
 * Kontextmenyn: `liftForMenu` sätter kortet direkt till skala 1 (ingen fjäder)
 * när menyn lyfter kopian, och `menuClosed` släpper spärren, så att tryckets
 * pressOut-fjäder inte kämpar med lyftet.
 *
 *   const press = useCardPress();
 *   <Pressable onLayout={press.onLayout} onPressIn={press.onPressIn} onPressOut={press.onPressOut}>
 *     <Animated.View style={press.scaleStyle}>…
 */
export function useCardPress() {
  const [width, setWidth] = useState(0);
  const scale = width
    ? Math.min(Math.max(1 - motion.pressInsetPx / width, motion.pressScaleMin), motion.pressScaleMax)
    : motion.pressScaleMin;
  const press = usePressAnimation(scale);
  const menuOpen = useRef(false);

  return useMemo(
    () => ({
      onLayout: (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width),
      onPressIn: press.onPressIn,
      onPressOut: () => {
        if (!menuOpen.current) press.onPressOut();
      },
      scaleStyle: press.scaleStyle,
      liftForMenu: () => {
        menuOpen.current = true;
        press.reset();
      },
      menuClosed: () => {
        menuOpen.current = false;
      },
    }),
    [press],
  );
}
