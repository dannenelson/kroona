// Hierarkirörelsen för Produktdetalj (spik brief 18), med
// react-native-screen-transitions: kortets bild zoomar till heron, och
// stängning (drag nedåt överst eller kantswipe) går tillbaka till kortet.
// Föregående skärm syns bakom (blank stack, JS-skärmar).
import type { TransitionInterpolatedStyle } from 'react-native-screen-transitions';
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/expo-router';
import { scheduleOnUI } from 'react-native-worklets';
import { Easing, ReduceMotion, interpolate } from 'react-native-reanimated';
import { motion, overlay, radius, spacing } from '../../theme';
import {
  lightboxBackdrop,
  lightboxGestureLock,
  lightboxHeroIndex,
  lightboxIndex,
  reduceMotionShared,
} from '../../lib/lightboxStore';

/** Grupp för produktbilder: kort (källa) och hero (mål) delar `id` = produkt-id. */
export const PRODUCT_BOUNDARY_GROUP = 'product';

// Marginal så att en skärm som just blivit näst översta inte blinkar till.
const STACK_DEPTH_EPSILON = 0.001;

/**
 * Bara ETT steg bakom ska synas (grid → A → B: när B dras syns A, inte gridden
 * i A:s kanter). stackProgress summerar progress från toppen ned till och med
 * skärmen själv, så djupet (antal skärmar ovanför) är stackProgress − 1.
 * Sätter alltid innehållets opacitet: 0 för skärmar med två eller fler ovanför,
 * annars 1 (zoomens egen opacitet behålls om den finns). Den i fokus (djup 0) och den närmast under (djup 1) påverkas aldrig.
 * Bakom A syns då rotens solida temabakgrund (colors.bg i app/_layout).
 */
export function withDepthVisibility(
  style: TransitionInterpolatedStyle,
  stackProgress: number,
): TransitionInterpolatedStyle {
  'worklet';
  const depth = stackProgress - 1;
  // Alltid explicit opacitet: en skärm som varit dold (djup 2) måste få
  // opacitet 1 igen när den åter är på djup 0 eller 1, annars ligger 0 kvar.
  if (depth > 1 + STACK_DEPTH_EPSILON) return { content: { style: { opacity: 0 } } };
  const content = style.content as Record<string, unknown> | undefined;
  if (!content) return { ...style, content: { style: { opacity: 1 } } };
  if ('style' in content || 'props' in content) {
    const inner = (content.style ?? {}) as Record<string, unknown>;
    return { ...style, content: { ...content, style: { opacity: 1, ...inner } } };
  }
  return { ...style, content: { opacity: 1, ...content } };
}

/** Flikarna (gridden): som idag, men dolda när två eller fler skärmar ligger ovanför. */
export const tabsScreenOptions: BlankStackNavigationOptions = {
  inactiveBehavior: 'pause',
  screenStyleInterpolator: ({ stackProgress }) => {
    'worklet';
    return withDepthVisibility({}, stackProgress);
  },
};

/**
 * Sätter tröskeln för distansbaserad stängning och aktiveringen av drag nedåt på UI-runtime, där bibliotekets
 * (patchade) beslut läses (se patches/react-native-screen-transitions+4.2.0.patch).
 * Anropas en gång från app/_layout.
 */
export function installDismissThresholds() {
  const minDistance = motion.dismissMinDistance;
  const cancelVelocity = motion.dismissCancelVelocity;
  const activationDistance = motion.dismissActivationDistance;
  scheduleOnUI(() => {
    'worklet';
    const g = globalThis as unknown as {
      __kroonaDismissMinDistance?: number;
      __kroonaDismissCancelVelocity?: number;
      __kroonaVerticalActivationDistance?: number;
    };
    g.__kroonaDismissMinDistance = minDistance;
    g.__kroonaDismissCancelVelocity = cancelVelocity;
    g.__kroonaVerticalActivationDistance = activationDistance;
  });
}

/** Telefonens egen hörnradie, uppskattad från övre safe area (inget officiellt API). */
function screenCornerRadius(insetTop: number): number {
  'worklet';
  return insetTop >= radius.screenNotch + spacing.sm ? radius.screenDynamicIsland : radius.screenNotch;
}

export const productScreenOptions: BlankStackNavigationOptions = {
  gestureEnabled: true,
  // Drag nedåt (tas bara över överst i innehållet via Transition.ScrollView)
  // och kantswipe från vänster. Högersvep mitt på skärmen stänger inte.
  gestureDirection: [
    'vertical',
    { gesture: 'horizontal', area: motion.dismissEdgeWidth },
  ],
  // Hur mycket släpphastigheten väger in i stängningsbeslutet (se motion.ts).
  gestureVelocityImpact: motion.dismissVelocityImpact,
  screenStyleInterpolator: ({ bounds, active, insets, stackProgress }) => {
    'worklet';
    // Kortinstansens boundary-id (param `b`), annars produkt-id (t.ex. djuplänk).
    const params = active.route.params as { id?: string; b?: string } | undefined;
    const id = params?.b ?? params?.id;
    if (!id) return withDepthVisibility({}, stackProgress);
    return withDepthVisibility(
      bounds({ id, group: PRODUCT_BOUNDARY_GROUP }).navigation.zoom({
        borderRadius: screenCornerRadius(insets.top),
        backgroundScale: motion.zoomBackgroundScale,
        backdropOpacity: motion.zoomBackdropOpacity,
      }),
      stackProgress,
    );
  },
  transitionSpec: { open: motion.zoomSpec.open, close: motion.zoomSpec.close },
};

const lightboxCloseEasing = Easing.bezierFn(...motion.lightboxFade.closeEasing);

/**
 * Lightboxen (brief 22–26): öppning och stängning via kryss eller kantswipe är
 * en fade (opacitet, lätt skala) över en lätt genomskinlig backdrop
 * (`motion.lightboxBackdropOpacity`, enda mörka lagret); detaljvyn bakom ligger
 * still. Swipe ned/upp är lightboxens egen gest (app/lightbox), så biblioteket
 * har bara kantswipen, som stängs av när bilden är inzoomad eller nyps.
 * `lightboxBackdrop` tonar backdropen under den egna gesten. Minska rörelse:
 * bara opacitet.
 */
export const lightboxScreenOptions: BlankStackNavigationOptions = {
  gestureEnabled: true,
  gestureDirection: { gesture: 'horizontal', area: motion.dismissEdgeWidth },
  gestureVelocityImpact: motion.dismissVelocityImpact,
  screenStyleInterpolator: ({ focused, current, stackProgress }) => {
    'worklet';
    const reduce = reduceMotionShared.value;
    // Detaljvyn bakom ligger still (brief 26).
    if (!focused) return withDepthVisibility({}, stackProgress);
    const fade = motion.lightboxFade;
    const p = Math.min(1, Math.max(0, current.progress));
    // Öppning linjär; stängning med kurva (backdropen lämnar sist). Båda är 1 vid p = 1.
    const closing = current.entering !== 1;
    // Lightboxen lämnar (kryss, kantswipe): heron byter nu till bilden man lämnade.
    if (closing && p < 1) lightboxHeroIndex.value = lightboxIndex.value;
    const opacity = closing ? 1 - Math.pow(1 - p, fade.closeOpacityCurve) : p;
    const backdrop = closing ? 1 - Math.pow(1 - p, fade.closeBackdropCurve) : p;
    return {
      ...withDepthVisibility(
        {
          backdrop: {
            style: {
              backgroundColor: overlay.lightboxBg,
              opacity: motion.lightboxBackdropOpacity * backdrop * lightboxBackdrop.value,
            },
          },
          content: {
            style: {
              opacity,
              transform: [{ scale: reduce ? 1 : interpolate(p, [0, 1], [fade.fromScale, 1], 'clamp') }],
            },
          },
        },
        stackProgress,
      ),
      options: { gestureEnabled: lightboxGestureLock.value === 0 },
    };
  },
  // Faden körs även med Minska rörelse (bara opacitet då), annars skulle den hoppa.
  transitionSpec: {
    open: { ...motion.lightboxFade.open, reduceMotion: ReduceMotion.Never },
    close: { ...motion.lightboxFade.close, easing: lightboxCloseEasing, reduceMotion: ReduceMotion.Never },
  },
};
