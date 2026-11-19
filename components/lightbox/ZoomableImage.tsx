import { StyleSheet } from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  GestureDetector,
  useExclusiveGestures,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import { motion } from '../../theme';

type Props = {
  uri: string;
  width: number;
  height: number;
  /** Anropas när bilden går mellan inzoomad och 1x (styr paging och stängning). */
  onZoomChange: (zoomed: boolean) => void;
};

// Liten marginal så att en nästan-1x-zoom räknas som utzoomad.
const ZOOM_EPSILON = 0.01;

/**
 * En bild i lightboxen (brief 19): visas i riktig proportion (contain),
 * nypzoom 1–4x, pan när inzoomad, dubbeltryck växlar 1x ↔ 2,5x. Släpper man
 * under 1x fjädrar bilden tillbaka. Pan är bara aktiv när bilden är inzoomad,
 * så att swipe ned (stängning) och swipe i sidled (paging) fungerar annars.
 */
export default function ZoomableImage({ uri, width, height, onZoomChange }: Props) {
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const zoomed = useSharedValue(false);

  const setZoomed = (next: boolean) => {
    'worklet';
    if (zoomed.value === next) return;
    zoomed.value = next;
    scheduleOnRN(onZoomChange, next);
  };

  // Håll bilden inom ramen: max förflyttning = (skalad storlek − ram) / 2.
  const clampTranslate = (value: number, size: number, s: number) => {
    'worklet';
    const max = Math.max(0, (size * s - size) / 2);
    return Math.min(max, Math.max(-max, value));
  };

  const reset = () => {
    'worklet';
    scale.value = withSpring(1, motion.spring);
    tx.value = withSpring(0, motion.spring);
    ty.value = withSpring(0, motion.spring);
    setZoomed(false);
  };

  const pinch = usePinchGesture({
    onBegin: () => {
      'worklet';
      startScale.value = scale.value;
    },
    onUpdate: (e) => {
      'worklet';
      scale.value = Math.min(motion.lightboxMaxZoom, startScale.value * e.scale);
      if (scale.value > 1 + ZOOM_EPSILON) setZoomed(true);
    },
    onDeactivate: () => {
      'worklet';
      if (scale.value <= 1 + ZOOM_EPSILON) {
        reset();
      } else {
        tx.value = withSpring(clampTranslate(tx.value, width, scale.value), motion.spring);
        ty.value = withSpring(clampTranslate(ty.value, height, scale.value), motion.spring);
      }
    },
  });

  const pan = usePanGesture({
    enabled: zoomed,
    onBegin: () => {
      'worklet';
      startX.value = tx.value;
      startY.value = ty.value;
    },
    onUpdate: (e) => {
      'worklet';
      tx.value = startX.value + e.translationX;
      ty.value = startY.value + e.translationY;
    },
    onDeactivate: () => {
      'worklet';
      tx.value = withSpring(clampTranslate(tx.value, width, scale.value), motion.spring);
      ty.value = withSpring(clampTranslate(ty.value, height, scale.value), motion.spring);
    },
  });

  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    onActivate: () => {
      'worklet';
      if (zoomed.value) {
        reset();
      } else {
        scale.value = withSpring(motion.lightboxDoubleTapZoom, motion.spring);
        setZoomed(true);
      }
    },
  });

  const pinchAndPan = useSimultaneousGestures(pinch, pan);
  const gesture = useExclusiveGestures(doubleTap, pinchAndPan);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: scale.value }],
  }));

  return (
    <GestureDetector gesture={gesture}>
      <Reanimated.View style={[styles.frame, { width, height }]}>
        <Reanimated.Image
          source={{ uri }}
          resizeMode="contain"
          style={[{ width, height }, imageStyle]}
        />
      </Reanimated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
});
