// Hierarkirörelsen för Produktdetalj (spik brief 18), med
// react-native-screen-transitions: kortets bild zoomar till heron, och
// stängning (drag nedåt överst eller kantswipe) går tillbaka till kortet.
// Föregående skärm syns bakom (blank stack, JS-skärmar).
import type { TransitionInterpolatedStyle } from 'react-native-screen-transitions';
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/expo-router';
import { motion, radius, spacing } from '../../theme';

/** Grupp för produktbilder: kort (källa) och hero (mål) delar `id` = produkt-id. */
export const PRODUCT_BOUNDARY_GROUP = 'product';

// Marginal så att en skärm som just blivit näst översta inte blinkar till.
const STACK_DEPTH_EPSILON = 0.001;

/**
 * Bara ETT steg bakom ska synas (grid → A → B: när B dras syns A, inte gridden
 * i A:s kanter). stackProgress summerar progress från toppen ned till och med
 * skärmen själv, så djupet (antal skärmar ovanför) är stackProgress − 1.
 * Returnerar ett dolt innehåll för skärmar med två eller fler ovanför, annars
 * null. Den i fokus (djup 0) och den närmast under (djup 1) påverkas aldrig.
 * Bakom A syns då rotens solida temabakgrund (colors.bg i app/_layout).
 */
export function hideWhenDeep(stackProgress: number): TransitionInterpolatedStyle | null {
  'worklet';
  const depth = stackProgress - 1;
  return depth > 1 + STACK_DEPTH_EPSILON ? { content: { style: { opacity: 0 } } } : null;
}

/** Flikarna (gridden): som idag, men dolda när två eller fler skärmar ligger ovanför. */
export const tabsScreenOptions: BlankStackNavigationOptions = {
  inactiveBehavior: 'pause',
  screenStyleInterpolator: ({ stackProgress }) => {
    'worklet';
    return hideWhenDeep(stackProgress) ?? {};
  },
};

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
  screenStyleInterpolator: ({ bounds, active, insets, stackProgress }) => {
    'worklet';
    const hidden = hideWhenDeep(stackProgress);
    if (hidden) return hidden;
    const id = (active.route.params as { id?: string } | undefined)?.id;
    if (!id) return {};
    return bounds({ id, group: PRODUCT_BOUNDARY_GROUP }).navigation.zoom({
      borderRadius: screenCornerRadius(insets.top),
    });
  },
  transitionSpec: { open: motion.zoomSpec.open, close: motion.zoomSpec.close },
};
