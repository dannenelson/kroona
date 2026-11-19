// Hierarkirörelsen för Produktdetalj (spik brief 18), med
// react-native-screen-transitions: kortets bild zoomar till heron, och
// stängning (drag nedåt överst eller kantswipe) går tillbaka till kortet.
// Föregående skärm syns bakom (blank stack, JS-skärmar).
import type { BlankStackNavigationOptions } from 'react-native-screen-transitions/expo-router';
import { motion, radius, spacing } from '../../theme';

/** Grupp för produktbilder: kort (källa) och hero (mål) delar `id` = produkt-id. */
export const PRODUCT_BOUNDARY_GROUP = 'product';

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
  screenStyleInterpolator: ({ bounds, active, insets }) => {
    'worklet';
    const id = (active.route.params as { id?: string } | undefined)?.id;
    if (!id) return {};
    return bounds({ id, group: PRODUCT_BOUNDARY_GROUP }).navigation.zoom({
      borderRadius: screenCornerRadius(insets.top),
    });
  },
  transitionSpec: { open: motion.zoomSpec.open, close: motion.zoomSpec.close },
};
