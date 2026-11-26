import { useRef, useState, type ComponentRef, type ReactNode } from 'react';
import type { View } from 'react-native';
import { usePanGesture } from 'react-native-gesture-handler';
import { motion } from '../theme';
import { useContextMenu, type AnchorRect, type ContextMenuItem } from '../components/ProductContextMenu';

type Options = {
  items: ContextMenuItem[];
  /** Bilden som lyfts (samma source som originalet). Saknas den visas bara `renderOverlay`. */
  imageUri?: string;
  /** Originalets hörnradie, så att kopian är identisk vid skala 1. */
  radius: number;
  /** Innehåll ovanpå den lyfta kopian (t.ex. mosaik, avatar, namn). */
  renderOverlay?: () => ReactNode;
  /** Kortets tryckrespons (useCardPress), som nollställs när menyn lyfter. */
  press?: { liftForMenu: () => void; menuClosed: () => void };
};

/**
 * Långt tryck → kontextmeny (samma meny, gest och lyft som produktkorten),
 * delad av samlingskort, listrader och PartnerCard (brief 35). Ge `ref` till
 * vyn som ska lyftas och `hidden` döljer originalet medan kopian visas.
 */
export function useLongPressMenu({ items, imageUri, radius, renderOverlay, press }: Options) {
  const contextMenu = useContextMenu();
  const ref = useRef<ComponentRef<typeof View>>(null);
  const [hidden, setHidden] = useState(false);

  const measure = (done: (rect: AnchorRect) => void) => {
    ref.current?.measureInWindow((x, y, width, height) => done({ x, y, width, height }));
  };

  // Öppnar samma meny utan långt tryck (t.ex. från en "mer"-knapp på raden).
  const open = () => {
    if (items.length === 0) return;
    press?.liftForMenu();
    measure((anchor) =>
      contextMenu.open({
        anchor,
        imageSource: { uri: imageUri ?? '' },
        imageRadius: radius,
        liftScale: motion.liftScale,
        renderOverlay,
        items,
        measure,
        setOriginalHidden: (h) => {
          if (!h) press?.menuClosed();
          setHidden(h);
        },
      }),
    );
  };

  const gesture = usePanGesture({
    activateAfterLongPress: motion.longPressMs,
    enabled: items.length > 0,
    runOnJS: true,
    disableReanimated: true,
    onActivate: open,
    onUpdate: (e) => contextMenu.move(e.absoluteX, e.absoluteY),
    onDeactivate: () => contextMenu.release(),
  });

  return { gesture, ref, hidden, open };
}
