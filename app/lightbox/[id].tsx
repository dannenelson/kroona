// Lightbox (brief 19–26): produktens bilder i helskärm och riktig proportion,
// ovanpå Produktdetalj i rotens BlankStack. Kryss och kantswipe stänger med fade
// (lightboxScreenOptions i components/product/productTransition.ts).
//
// Gester, helt på UI-tråden med shared values:
// - Två fingrar → nyp (1–4x). `lightboxGestureLock` stänger av bibliotekets
//   kantswipe när andra fingret landar och så länge bilden är inzoomad.
// - Inzoomad: ett finger panorerar bilden (inom ramen); ingen stängning.
// - Inte inzoomad: i sidled bläddrar (egen pager); drag från vänsterkanten
//   lämnas till kantswipen; upp/ned är swipe-stängning som i Apple Foto: bara
//   den aktiva bilden följer fingret och krymper svagt, bakgrunden tonas med
//   avståndet, kryss/punkter/grannbilder tonas bort. Släpp över tröskel: bilden
//   fortsätter ut med släppfarten och tonar bort, sedan router.back(). Annars
//   fjädrar den tillbaka.
// - Dubbeltryck växlar 1x ↔ 2,5x. Släpp under 1x fjädrar tillbaka.
import { useEffect, useLayoutEffect } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Reanimated, {
  Extrapolation,
  cancelAnimation,
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import {
  GestureDetector,
  GestureStateManager,
  usePanGesture,
  usePinchGesture,
  useSimultaneousGestures,
  useTapGesture,
} from 'react-native-gesture-handler';
import { motion, spacing } from '../../theme';
import { PRODUCTS } from '../../data/products';
import { getProductImages } from '../../lib/catalog';
import {
  lightboxBackdrop,
  lightboxGestureLock,
  lightboxIndex,
  reduceMotionShared,
} from '../../lib/lightboxStore';
import PagerDots from '../../components/PagerDots';
import IconButton from '../../components/IconButton';
import CloseIcon from '../../assets/icons/CloseIcon';

// Marginal så att en nästan-1x-zoom räknas som utzoomad.
const ZOOM_EPSILON = 0.01;
// Pan-gestens läge, låst vid aktivering.
const NONE = 0;
const PAGE = 1;
const DISMISS = 2;
const ZOOM_PAN = 3;

export default function LightboxScreen() {
  const params = useLocalSearchParams<{ id: string; index?: string }>();
  const { id } = params;
  const startIndex = Number(params.index ?? 0) || 0;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const product = PRODUCTS.find((p) => p.id === id);
  const images = product ? getProductImages(product) : [];
  const lastIndex = Math.max(0, images.length - 1);

  // Pager: förflyttning i px (negativ åt höger), index i den delade storen.
  const pageX = useSharedValue(-startIndex * width);
  const position = useDerivedValue(() => -pageX.value / Math.max(1, width));

  // Zoom för den bild som visas.
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const panStart = useSharedValue({ x: 0, y: 0, tx: 0, ty: 0, px: 0 });
  const zoomed = useDerivedValue(() => scale.value > 1 + ZOOM_EPSILON);

  // Swipe-stängning: den aktiva bildens förflyttning, dess opacitet (utfart)
  // och synligheten för kryss, punkter och grannbilder. `mode` = pan-gestens läge.
  const mode = useSharedValue(NONE);
  const release = useSharedValue({ ty: 0, vx: 0, vy: 0, ok: false });
  const dragX = useSharedValue(0);
  const dragY = useSharedValue(0);
  const imageOpacity = useSharedValue(1);
  const chrome = useSharedValue(1);
  const d = motion.lightboxDismiss;
  const fadeDistance = d.fadeDistance * height;
  // Bakgrunden (bibliotekets backdrop, enda mörka lagret) följer avståndet och utfartens toning.
  const backdrop = useDerivedValue(
    () => interpolate(Math.abs(dragY.value), [0, fadeDistance], [1, 0], Extrapolation.CLAMP) * imageOpacity.value,
  );
  useAnimatedReaction(
    () => backdrop.value,
    (v) => {
      lightboxBackdrop.value = v;
    },
  );
  const close = () => router.back();

  // Indexet följer route-paramen från första bildrutan.
  useLayoutEffect(() => {
    lightboxIndex.value = startIndex;
    lightboxBackdrop.value = 1;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Vid stängning/avmontering: lås upp så att Produktdetalj inte ärver låset.
  useEffect(
    () => () => {
      lightboxGestureLock.value = 0;
      lightboxBackdrop.value = 1;
    },
    [],
  );

  const clampPan = (value: number, size: number, s: number) => {
    'worklet';
    const max = Math.max(0, (size * s - size) / 2);
    return Math.min(max, Math.max(-max, value));
  };
  const resetZoom = () => {
    'worklet';
    scale.value = withSpring(1, motion.spring);
    tx.value = withSpring(0, motion.spring);
    ty.value = withSpring(0, motion.spring);
    lightboxGestureLock.value = 0;
  };
  const goToPage = (index: number) => {
    'worklet';
    const target = Math.min(lastIndex, Math.max(0, index));
    pageX.value = withSpring(-target * width, motion.spring);
    if (lightboxIndex.value !== target) {
      lightboxIndex.value = target;
      // Heron hoppar till samma bild (HeroPager, UI-tråden).
    }
  };

  const pinch = usePinchGesture({
    // Låset redan när andra fingret landar: stängningsgesten får aldrig två fingrar.
    onTouchesDown: (e) => {
      'worklet';
      if (e.numberOfTouches >= 2) lightboxGestureLock.value = 1;
    },
    onBegin: () => {
      'worklet';
      startScale.value = scale.value;
      lightboxGestureLock.value = 1;
    },
    onUpdate: (e) => {
      'worklet';
      scale.value = Math.min(motion.lightboxMaxZoom, startScale.value * e.scale);
    },
    onFinalize: () => {
      'worklet';
      if (scale.value <= 1 + ZOOM_EPSILON) {
        resetZoom();
      } else {
        tx.value = withSpring(clampPan(tx.value, width, scale.value), motion.spring);
        ty.value = withSpring(clampPan(ty.value, height, scale.value), motion.spring);
      }
    },
  });

  // Pan: läget låses vid aktivering (inte vid slutet: ett nyp kan ha zoomat
  // bilden innan gesten avslutas). All snäppning och återställning sker i
  // onFinalize, som alltid körs (även vid avbrott eller utan aktivering), utifrån
  // faktisk position, så att inget kan bli kvar mitt emellan.
  const pan = usePanGesture({
    maxPointers: 1,
    manualActivation: true,
    onTouchesDown: (e) => {
      'worklet';
      const t = e.allTouches[0];
      if (!t || e.numberOfTouches > 1 || imageOpacity.value < 1) return;
      // Fånga pågående fjädrar så att ett nytt drag fortsätter där bilden är.
      cancelAnimation(pageX);
      cancelAnimation(dragX);
      cancelAnimation(dragY);
      mode.value = NONE;
      release.value = { ty: 0, vx: 0, vy: 0, ok: false };
      panStart.value = { x: t.absoluteX, y: t.absoluteY, tx: tx.value, ty: ty.value, px: pageX.value };
    },
    onTouchesMove: (e) => {
      'worklet';
      const t = e.allTouches[0];
      if (!t || e.numberOfTouches > 1) {
        GestureStateManager.fail(e.handlerTag);
        return;
      }
      if (mode.value !== NONE) return;
      if (zoomed.value) {
        mode.value = ZOOM_PAN;
        GestureStateManager.activate(e.handlerTag);
        return;
      }
      const dx = t.absoluteX - panStart.value.x;
      const dy = t.absoluteY - panStart.value.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < motion.dismissActivationDistance) return;
      const horizontal = Math.abs(dx) > Math.abs(dy);
      if (horizontal && panStart.value.x <= motion.dismissEdgeWidth && dx > 0) {
        GestureStateManager.fail(e.handlerTag); // kantswipe (biblioteket)
        return;
      }
      mode.value = horizontal ? PAGE : DISMISS;
      if (!horizontal) chrome.value = withTiming(0, { duration: motion.duration.fast });
      GestureStateManager.activate(e.handlerTag);
    },
    onUpdate: (e) => {
      'worklet';
      if (mode.value === ZOOM_PAN) {
        tx.value = panStart.value.tx + e.translationX;
        ty.value = panStart.value.ty + e.translationY;
      } else if (mode.value === DISMISS) {
        dragX.value = e.translationX;
        dragY.value = e.translationY;
      } else if (mode.value === PAGE) {
        pageX.value = panStart.value.px + e.translationX;
      }
    },
    // Släppvärden (bara aktiverade gester får dem); besluten tas i onFinalize.
    onDeactivate: (e) => {
      'worklet';
      release.value = { ty: e.translationY, vx: e.velocityX, vy: e.velocityY, ok: !e.canceled };
    },
    onFinalize: () => {
      'worklet';
      const ended = mode.value;
      const r = release.value;
      mode.value = NONE;
      if (imageOpacity.value < 1) return; // utfart pågår: stängs strax
      if (ended === DISMISS && r.ok && (Math.abs(r.ty) > d.distance * height || Math.abs(r.vy) > d.velocity)) {
        // Fortsätt ut med släppfarten (minst `velocity`) och tona bort; sedan stäng.
        const t = { duration: d.flyOutDuration };
        if (!reduceMotionShared.value) {
          const vy = Math.sign(r.ty) * Math.max(Math.abs(r.vy), d.velocity);
          dragX.value = withTiming(dragX.value + (r.vx * t.duration) / 1000, t);
          dragY.value = withTiming(dragY.value + (vy * t.duration) / 1000, t);
        }
        imageOpacity.value = withTiming(0, t, (finished) => {
          if (finished) scheduleOnRN(close);
        });
        return;
      }
      // Allt annat landar exakt: bilden i centrum, chrome synlig, pagern på en hel sida.
      dragX.value = withSpring(0, motion.spring);
      dragY.value = withSpring(0, motion.spring);
      chrome.value = withTiming(1, { duration: motion.duration.fast });
      if (zoomed.value) {
        tx.value = withSpring(clampPan(tx.value, width, scale.value), motion.spring);
        ty.value = withSpring(clampPan(ty.value, height, scale.value), motion.spring);
      }
      const p = -pageX.value / Math.max(1, width);
      const flick = ended === PAGE && r.ok && Math.abs(r.vx) > motion.pageFlickVelocity;
      goToPage(flick ? (r.vx < 0 ? Math.floor(p) + 1 : Math.ceil(p) - 1) : Math.round(p));
    },
  });

  const doubleTap = useTapGesture({
    numberOfTaps: 2,
    onActivate: () => {
      'worklet';
      if (zoomed.value) {
        resetZoom();
      } else {
        scale.value = withSpring(motion.lightboxDoubleTapZoom, motion.spring);
        lightboxGestureLock.value = 1;
      }
    },
  });

  const gesture = useSimultaneousGestures(pinch, pan, doubleTap);

  const rowStyle = useAnimatedStyle(() => ({ transform: [{ translateX: pageX.value }] }));
  const chromeStyle = useAnimatedStyle(() => ({ opacity: chrome.value }));
  // Den aktiva bilden: zoom plus swipe-stängningens förflyttning, svag nedskalning och utfart.
  const dragScale = useDerivedValue(() =>
    reduceMotionShared.value
      ? 1
      : interpolate(Math.abs(dragY.value), [0, fadeDistance], [1, d.minScale], Extrapolation.CLAMP),
  );
  const view = { scale, tx, ty, dragX, dragY, dragScale, imageOpacity, chrome };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GestureDetector gesture={gesture}>
        <Reanimated.View style={[styles.row, { width: width * images.length, height }, rowStyle]}>
          {images.map((uri, index) => (
            <View key={uri + index} style={[styles.page, { width, height }]}>
              <ZoomLayer index={index} view={view}>
                <Image source={{ uri }} style={{ width, height }} resizeMode="contain" />
              </ZoomLayer>
            </View>
          ))}
        </Reanimated.View>
      </GestureDetector>

      <Reanimated.View style={[styles.close, { top: insets.top + spacing.sm }, chromeStyle]}>
        <IconButton tone="dark" icon={CloseIcon} accessibilityLabel="Stäng bild" onPress={close} />
      </Reanimated.View>

      <Reanimated.View style={[styles.dots, { bottom: insets.bottom + spacing.lg }, chromeStyle]}>
        <PagerDots count={images.length} position={position} />
      </Reanimated.View>
    </View>
  );
}

type ViewValues = Record<
  'scale' | 'tx' | 'ty' | 'dragX' | 'dragY' | 'dragScale' | 'imageOpacity' | 'chrome',
  SharedValue<number>
>;

/** Zoom och swipe-stängning bara på den bild som visas; grannbilderna tonas bort under draget. */
function ZoomLayer({ index, view: v, children }: { index: number; view: ViewValues; children: React.ReactNode }) {
  const style = useAnimatedStyle(() => {
    const active = lightboxIndex.value === index;
    return {
      opacity: active ? v.imageOpacity.value : v.chrome.value,
      transform: [
        { translateX: active ? v.tx.value + v.dragX.value : 0 },
        { translateY: active ? v.ty.value + v.dragY.value : 0 },
        { scale: active ? v.scale.value * v.dragScale.value : 1 },
      ],
    };
  });
  return <Reanimated.View style={style}>{children}</Reanimated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
  },
  page: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  close: {
    position: 'absolute',
    right: spacing.screenMargin,
  },
  dots: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
});
