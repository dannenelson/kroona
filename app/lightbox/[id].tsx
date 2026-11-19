// Lightbox (brief 19–20): produktens bilder i helskärm och riktig proportion.
// Öppnas från den bild som visas i heron och ligger ovanpå Produktdetalj i
// rotens BlankStack (lightboxScreenOptions i components/product/productTransition.ts).
//
// Gestarbitrering (brief 20), helt på UI-tråden med shared values:
// - Två fingrar → nyp (1–4x), alltid. Låset `lightboxGestureLock` sätts redan
//   när andra fingret landar, så bibliotekets stängningsgest stängs av i samma
//   bildruta (interpolatorn returnerar `options.gestureEnabled`).
// - Inzoomad: ett finger panorerar bilden (inom ramen); paging och stängning av.
// - Inte inzoomad: ett finger i sidled bläddrar (egen pager, inte ScrollView),
//   vertikalt nedåt lämnas till bibliotekets stängningsgest, och drag från
//   vänsterkanten lämnas till kantswipen.
// - Dubbeltryck växlar 1x ↔ 2,5x. Släpp under 1x fjädrar tillbaka.
import { useEffect, useLayoutEffect, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Reanimated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
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
import Transition from 'react-native-screen-transitions';
import { motion, overlay, spacing } from '../../theme';
import { PRODUCTS } from '../../data/products';
import { getProductImages } from '../../lib/catalog';
import {
  getCachedImageSize,
  lightboxGestureLock,
  lightboxIndex,
  lightboxTargetIndex,
  prefetchImageSizes,
  type ImageSize,
} from '../../lib/lightboxStore';
import { LIGHTBOX_BOUNDARY_GROUP, lightboxBoundaryId } from '../../components/product/productTransition';
import PagerDots from '../../components/PagerDots';
import IconButton from '../../components/IconButton';
import CloseIcon from '../../assets/icons/CloseIcon';

// Marginal så att en nästan-1x-zoom räknas som utzoomad.
const ZOOM_EPSILON = 0.01;

export default function LightboxScreen() {
  const params = useLocalSearchParams<{ id: string; hero?: string; index?: string }>();
  const { id, hero } = params;
  const startIndex = Number(params.index ?? 0) || 0;
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();

  const product = PRODUCTS.find((p) => p.id === id);
  const images = product ? getProductImages(product) : [];
  const lastIndex = Math.max(0, images.length - 1);

  // Bildernas riktiga proportion: zoomens mål är bildens contain-rektangel.
  // Storlekarna är hämtade i förväg av heron (lib/lightboxStore), så målet är
  // rätt redan vid första mätningen. Saknas en storlek hämtas den här.
  const [sizes, setSizes] = useState<Record<string, ImageSize>>(() => {
    const known: Record<string, ImageSize> = {};
    images.forEach((uri) => {
      const s = getCachedImageSize(uri);
      if (s) known[uri] = s;
    });
    return known;
  });
  useEffect(() => {
    prefetchImageSizes(
      images.filter((uri) => !sizes[uri]),
      (uri, s) => setSizes((prev) => (prev[uri] ? prev : { ...prev, [uri]: s })),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const fitted = (uri: string) => {
    const s = sizes[uri];
    if (!s) return { width, height };
    const k = Math.min(width / s.w, height / s.h);
    return { width: s.w * k, height: s.h * k };
  };

  // Pager: förflyttning i px (negativ åt höger), index i den delade storen.
  // Bara den aktuella bilden är zoommål (brief 21): flera mål i samma grupp
  // tävlar om gruppens aktiva id, och mål utanför skärmen håller övergången
  // tills biblioteket ger upp (ca 320 ms), så att öppningen "dyker upp".
  const [current, setCurrent] = useState(startIndex);
  const pageX = useSharedValue(-startIndex * width);
  const position = useDerivedValue(() => -pageX.value / Math.max(1, width));

  // Zoom för den bild som visas.
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const panStart = useSharedValue({ x: 0, y: 0, tx: 0, ty: 0 });
  const zoomed = useDerivedValue(() => scale.value > 1 + ZOOM_EPSILON);

  // Säkra att interpolatorns index stämmer med route-paramen från första bildrutan.
  useLayoutEffect(() => {
    lightboxIndex.value = startIndex;
    lightboxTargetIndex.value = startIndex;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Efter bläddring: flytta zoomens mål först när heron har scrollat (UI-tråden,
  // HeroPager) och den nya bildens boundary är aktiv. Två bildrutor räcker för
  // att scroll och layout ska ha slagit igenom innan biblioteket mäter källan.
  useEffect(() => {
    if (lightboxTargetIndex.value === current) return;
    let second = 0;
    const first = requestAnimationFrame(() => {
      second = requestAnimationFrame(() => {
        lightboxTargetIndex.value = current;
      });
    });
    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(second);
    };
  }, [current]);

  // Vid stängning/avmontering: lås upp så att Produktdetalj inte ärver låset.
  useEffect(
    () => () => {
      lightboxGestureLock.value = 0;
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
      // Heron hoppar till samma bild (HeroPager, UI-tråden) och målet flyttas,
      // så att stängningen landar rätt.
      scheduleOnRN(setCurrent, target);
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

  const pan = usePanGesture({
    maxPointers: 1,
    manualActivation: true,
    onTouchesDown: (e) => {
      'worklet';
      const t = e.allTouches[0];
      if (!t) return;
      panStart.value = { x: t.absoluteX, y: t.absoluteY, tx: tx.value, ty: ty.value };
    },
    onTouchesMove: (e) => {
      'worklet';
      const t = e.allTouches[0];
      if (!t || e.numberOfTouches > 1) {
        GestureStateManager.fail(e.handlerTag);
        return;
      }
      if (zoomed.value) {
        GestureStateManager.activate(e.handlerTag);
        return;
      }
      const dx = t.absoluteX - panStart.value.x;
      const dy = t.absoluteY - panStart.value.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < motion.dismissActivationDistance) return;
      const fromEdge = panStart.value.x <= motion.dismissEdgeWidth && dx > 0;
      if (Math.abs(dx) > Math.abs(dy) && !fromEdge) {
        GestureStateManager.activate(e.handlerTag); // bläddra
      } else {
        GestureStateManager.fail(e.handlerTag); // stängning eller kantswipe
      }
    },
    onUpdate: (e) => {
      'worklet';
      if (zoomed.value) {
        tx.value = panStart.value.tx + e.translationX;
        ty.value = panStart.value.ty + e.translationY;
        return;
      }
      pageX.value = -lightboxIndex.value * width + e.translationX;
    },
    onDeactivate: (e) => {
      'worklet';
      if (zoomed.value) {
        tx.value = withSpring(clampPan(tx.value, width, scale.value), motion.spring);
        ty.value = withSpring(clampPan(ty.value, height, scale.value), motion.spring);
        return;
      }
      const swiped =
        Math.abs(e.translationX) > width / 2 || Math.abs(e.velocityX) > motion.pageFlickVelocity;
      const direction = e.translationX < 0 ? 1 : -1;
      goToPage(swiped ? lightboxIndex.value + direction : lightboxIndex.value);
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

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <GestureDetector gesture={gesture}>
        <Reanimated.View style={[styles.row, { width: width * images.length, height }, rowStyle]}>
          {images.map((uri, index) => (
            <View key={uri + index} style={[styles.page, { width, height }]}>
              {/* Zoomens mål: bildens contain-rektangel, ett id per bild (som i heron). */}
              <Transition.Boundary
                id={hero ? lightboxBoundaryId(hero, index) : `${id}_${index}`}
                group={LIGHTBOX_BOUNDARY_GROUP}
                enabled={index === current}
                style={fitted(uri)}
              >
                <ZoomLayer index={index} scale={scale} tx={tx} ty={ty}>
                  <Image source={{ uri }} style={fitted(uri)} resizeMode="contain" />
                </ZoomLayer>
              </Transition.Boundary>
            </View>
          ))}
        </Reanimated.View>
      </GestureDetector>

      <View style={[styles.close, { top: insets.top + spacing.sm }]}>
        <IconButton tone="dark" icon={CloseIcon} accessibilityLabel="Stäng bild" onPress={() => router.back()} />
      </View>

      <PagerDots
        count={images.length}
        position={position}
        style={[styles.dots, { bottom: insets.bottom + spacing.lg }]}
      />
    </View>
  );
}

/** Zoomtransform bara på den bild som visas; övriga bilder ligger orörda. */
function ZoomLayer({
  index,
  scale,
  tx,
  ty,
  children,
}: {
  index: number;
  scale: { value: number };
  tx: { value: number };
  ty: { value: number };
  children: React.ReactNode;
}) {
  const style = useAnimatedStyle(() => {
    const current = lightboxIndex.value === index;
    return {
      transform: [
        { translateX: current ? tx.value : 0 },
        { translateY: current ? ty.value : 0 },
        { scale: current ? scale.value : 1 },
      ],
    };
  });
  return <Reanimated.View style={style}>{children}</Reanimated.View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: overlay.lightboxBg,
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
