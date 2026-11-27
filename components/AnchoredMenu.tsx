// Förankrad meny (brief 70): vanlig kontextmeny som fälls ut intill en knapp
// (t.ex. mer-knappen ⋯), utan lyft bild och utan blur-bakgrund. Samma menyrad
// och yta som långtrycksmenyn (MenuRow, `menu`-glas). Ligger som ett lager
// ovanför appen. Håller sig inom skärmen: under knappen om den ryms, annars
// ovanför; högerställd mot knappen i skärmens högra halva, annars vänsterställd.
// Tryck utanför stänger. Minska rörelse: bara tonning.
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, edgeBlur, radius, spacing, motion } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { haptic } from '../utils/haptic';
import { MENU_WIDTH, ROW_HEIGHT, MenuRow, type AnchorRect, type ContextMenuItem } from './ProductContextMenu';

type OpenRequest = { anchor: AnchorRect; items: readonly ContextMenuItem[] };

type AnchoredMenuApi = {
  open: (request: OpenRequest) => void;
  close: () => void;
};

const AnchoredMenuContext = createContext<AnchoredMenuApi | null>(null);

export function useAnchoredMenu(): AnchoredMenuApi {
  const ctx = useContext(AnchoredMenuContext);
  if (!ctx) throw new Error('useAnchoredMenu måste användas inuti <AnchoredMenuProvider>');
  return ctx;
}

/** Var menyn hamnar: under/ovanför knappen och kant mot knappens sida, inom skärmen. */
export function layoutAnchoredMenu(
  anchor: AnchorRect,
  itemCount: number,
  win: { width: number; height: number },
  insets: { top: number; bottom: number },
) {
  const height = itemCount * ROW_HEIGHT;
  const gap = spacing.sm;
  const top = insets.top + spacing.sm;
  const bottom = win.height - insets.bottom - spacing.sm;
  const below = anchor.y + anchor.height + gap + height <= bottom;
  const y = below
    ? anchor.y + anchor.height + gap
    : Math.max(top, Math.min(anchor.y - gap - height, bottom - height));
  const alignRight = anchor.x + anchor.width / 2 > win.width / 2;
  const rawX = alignRight ? anchor.x + anchor.width - MENU_WIDTH : anchor.x;
  const x = Math.min(Math.max(rawX, spacing.screenMargin), win.width - spacing.screenMargin - MENU_WIDTH);
  return { x, y, width: MENU_WIDTH, height, below, alignRight };
}

export function AnchoredMenuProvider({ children }: { children: ReactNode }) {
  const win = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const [request, setRequest] = useState<OpenRequest | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    Animated.timing(progress, { toValue: 0, duration: motion.menuFadeDuration, useNativeDriver: true }).start(() => {
      closing.current = false;
      setRequest(null);
    });
  }, [progress]);

  const open = useCallback(
    (req: OpenRequest) => {
      if (req.items.length === 0) return;
      closing.current = false;
      progress.setValue(0);
      setRequest(req);
      haptic.light();
      if (reduceMotion) {
        Animated.timing(progress, { toValue: 1, duration: motion.duration.fast, useNativeDriver: true }).start();
      } else {
        Animated.spring(progress, { toValue: 1, ...motion.menuSpring, useNativeDriver: true }).start();
      }
    },
    [progress, reduceMotion],
  );

  const api = useMemo(() => ({ open, close }), [open, close]);
  const layout = request ? layoutAnchoredMenu(request.anchor, request.items.length, win, insets) : null;

  return (
    <AnchoredMenuContext.Provider value={api}>
      {children}
      {request && layout ? (
        <AnchoredMenuOverlay
          items={request.items}
          layout={layout}
          progress={progress}
          reduceMotion={reduceMotion}
          onClose={close}
        />
      ) : null}
    </AnchoredMenuContext.Provider>
  );
}

function AnchoredMenuOverlay({
  items,
  layout,
  progress,
  reduceMotion,
  onClose,
}: {
  items: readonly ContextMenuItem[];
  layout: ReturnType<typeof layoutAnchoredMenu>;
  progress: Animated.Value;
  reduceMotion: boolean;
  onClose: () => void;
}) {
  const styles = useStyles();
  const { scheme, shadows } = useTheme();
  const scale = reduceMotion
    ? 1
    : progress.interpolate({ inputRange: [0, 1], outputRange: [motion.menuEnterScale, 1] });
  // Menyn växer ut från knappens hörn.
  const origin = `${layout.below ? 'top' : 'bottom'} ${layout.alignRight ? 'right' : 'left'}`;

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Tryck utanför stänger; ingen blur eller dämpning bakom. */}
      <Pressable accessibilityLabel="Stäng meny" style={StyleSheet.absoluteFill} onPress={onClose} />
      <Animated.View
        accessibilityRole="menu"
        style={[
          styles.menu,
          {
            left: layout.x,
            top: layout.y,
            width: layout.width,
            boxShadow: shadows.menu,
            opacity: progress,
            transformOrigin: origin,
            transform: [{ scale }],
          },
        ]}
      >
        <BlurView
          tint={scheme}
          intensity={edgeBlur.menuIntensity}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={[StyleSheet.absoluteFill, styles.menuShape]}
        />
        <View style={[StyleSheet.absoluteFill, styles.menuFill]} />
        {items.map((item, i) => (
          <MenuRow
            key={item.label}
            item={item}
            first={i === 0}
            highlighted={false}
            onPress={() => {
              haptic.success();
              item.onPress?.();
              onClose();
            }}
          />
        ))}
      </Animated.View>
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  menu: {
    position: 'absolute',
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderWidth: t.glass.borderWidth,
    borderColor: t.glass.borderColor,
  },
  menuShape: {
    borderRadius: radius.card,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  menuFill: {
    backgroundColor: t.colors.menu,
  },
}));
