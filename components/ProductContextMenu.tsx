import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ImageSourcePropType,
} from 'react-native';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets, type EdgeInsets } from 'react-native-safe-area-context';
import { makeStyles, useTheme, edgeBlur, typography, spacing, radius, motion, iconSize } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';

type IconProps = { color: string; size?: number };

export type ContextMenuItem = {
  label: string;
  icon: ComponentType<IconProps>;
  onPress?: () => void;
};

/** Bildens läge i fönstret när det långa trycket började. */
export type AnchorRect = { x: number; y: number; width: number; height: number };

export type ContextMenuRequest = {
  anchor: AnchorRect;
  /** Exakt samma source-objekt som originalet använder (samma cache, ingen omladdning). */
  imageSource: ImageSourcePropType;
  /** Originalbildens hörnradie, så att kopian är identisk vid skala 1. */
  imageRadius: number;
  /** Hur mycket bilden lyfts (alltid > 1, mindre för stora kort). */
  liftScale: number;
  /** Innehåll ovanpå bilden som ska följa med lyftet (t.ex. märket Nyhet/Begagnad). */
  renderOverlay?: () => ReactNode;
  items: readonly ContextMenuItem[];
  /** Mäter originalbilden igen (listan kan ha rört sig medan menyn var öppen). */
  measure: (done: (rect: AnchorRect) => void) => void;
  /** Döljer/visar originalbilden. Anropas i samma render som kopian visas/tas bort. */
  setOriginalHidden: (hidden: boolean) => void;
};

type ContextMenuApi = {
  /** Öppnar menyn (anropas när det långa trycket aktiveras). */
  open: (request: ContextMenuRequest) => void;
  /** Fingret rör sig under samma gest: markerar raden under fingret. */
  move: (x: number, y: number) => void;
  /** Fingret släpps: väljer markerad rad, stänger eller låter menyn stå kvar. */
  release: () => void;
  close: () => void;
};

// Lokala mått från referensen "Kroona Looken A": menybredd 250, rad 46.
const MENU_WIDTH = 250;
const ROW_HEIGHT = 46;
// Så långt fingret måste röra sig innan det räknas som drag (iOS: ca 10 pt).
const DRAG_SLOP = spacing.sm;

type MenuLayout = {
  lift: { x: number; y: number; width: number; height: number };
  menu: { x: number; y: number; width: number; height: number };
  /** Menyn ligger under kortet (annars ovanför). */
  below: boolean;
};

/**
 * Placering (brief 07): lyftet är originalet × lyftskalan, centrerat på
 * originalets mitt. Bilden krymps aldrig. Ryms den inte flyttas den inåt
 * (inom marginaler och safe area), så att menyn ryms under, annars ovanför.
 * Ryms inte kort och meny ens då läggs menyn mot nederkanten och får
 * överlappa kortets nederdel.
 */
function layoutMenu(
  anchor: AnchorRect,
  liftScale: number,
  itemCount: number,
  win: { width: number; height: number },
  insets: EdgeInsets,
): MenuLayout {
  const menuHeight = itemCount * ROW_HEIGHT;
  const width = anchor.width * liftScale;
  const height = anchor.height * liftScale;
  const top = insets.top + spacing.lg;
  const bottom = win.height - insets.bottom - spacing.lg;
  const gap = spacing.xl;

  const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), Math.max(lo, hi));
  const x = clamp(
    anchor.x + (anchor.width - width) / 2,
    spacing.screenMargin,
    win.width - spacing.screenMargin - width,
  );
  const menuX = clamp(
    x + width / 2 - MENU_WIDTH / 2,
    spacing.screenMargin,
    win.width - spacing.screenMargin - MENU_WIDTH,
  );
  const naturalY = anchor.y + (anchor.height - height) / 2;

  // Under: kortet flyttas upp så långt som behövs för att menyn ska rymmas.
  const yBelow = clamp(naturalY, top, bottom - menuHeight - gap - height);
  if (yBelow + height + gap + menuHeight <= bottom) {
    return {
      lift: { x, y: yBelow, width, height },
      menu: { x: menuX, y: yBelow + height + gap, width: MENU_WIDTH, height: menuHeight },
      below: true,
    };
  }
  // Ovanför: kortet flyttas ner så att menyn ryms över det.
  const yAbove = clamp(naturalY, top + menuHeight + gap, bottom - height);
  if (yAbove + height <= bottom) {
    return {
      lift: { x, y: yAbove, width, height },
      menu: { x: menuX, y: yAbove - gap - menuHeight, width: MENU_WIDTH, height: menuHeight },
      below: false,
    };
  }
  // Ryms inte alls: kortet överst, menyn mot nederkanten.
  return {
    lift: { x, y: top, width, height },
    menu: { x: menuX, y: bottom - menuHeight, width: MENU_WIDTH, height: menuHeight },
    below: true,
  };
}

function rowAt(layout: MenuLayout | null, count: number, x: number, y: number): number | null {
  if (!layout) return null;
  const m = layout.menu;
  if (x < m.x || x > m.x + m.width || y < m.y || y > m.y + m.height) return null;
  return Math.min(count - 1, Math.floor((y - m.y) / ROW_HEIGHT));
}

const ContextMenuContext = createContext<ContextMenuApi | null>(null);

export function useContextMenu(): ContextMenuApi {
  const ctx = useContext(ContextMenuContext);
  if (!ctx) throw new Error('useContextMenu måste användas inuti <ContextMenuProvider>');
  return ctx;
}

/**
 * Meny vid långt tryck på kort (iOS-kontextmeny-känsla), brief 05.
 *
 * Ligger som ett lager ovanför hela appen (i app/_layout) i stället för en
 * Modal: en Modal avbryter den pågående touchen, och då går det inte att dra
 * fingret vidare till en rad. Gesten ägs av kortet (gesture-handler) och
 * rapporterar fingrets läge hit via move/release.
 *
 * Släpp utan att ha dragit: menyn står kvar, tryck på rad väljer, tryck
 * utanför stänger. Har man dragit och släpper utanför raderna: menyn stängs.
 */
export function ContextMenuProvider({ children }: { children: ReactNode }) {
  const insets = useSafeAreaInsets();
  const win = useWindowDimensions();
  const [request, setRequest] = useState<ContextMenuRequest | null>(null);
  const [highlighted, setHighlighted] = useState<number | null>(null);
  const reduceMotion = useReduceMotion();
  // Originalets läge: där kopian börjar och slutar (p = 0).
  const [home, setHome] = useState<AnchorRect | null>(null);

  const progress = useRef(new Animated.Value(0)).current;
  const backdrop = useRef(new Animated.Value(0)).current;

  // Senaste värden för gest-callbacks, som inte ska behöva skapas om.
  const state = useRef({
    request: null as ContextMenuRequest | null,
    layout: null as MenuLayout | null,
    highlighted: null as number | null,
    start: null as { x: number; y: number } | null,
    dragged: false,
    closing: false,
  }).current;

  const layout = useMemo(
    () => (request ? layoutMenu(request.anchor, request.liftScale, request.items.length, win, insets) : null),
    [request, win, insets],
  );
  state.request = request;
  state.layout = layout;

  const setHighlight = useCallback(
    (i: number | null) => {
      if (state.highlighted === i) return;
      state.highlighted = i;
      setHighlighted(i);
      if (i !== null) Haptics.selectionAsync();
    },
    [state],
  );

  const close = useCallback(() => {
    const req = state.request;
    if (!req || state.closing) return;
    state.closing = true;

    // Bytet kopia → original sker i samma React-batch (en commit, samma frame):
    // kopian tas bort och originalet blir synligt samtidigt.
    const done = () => {
      state.closing = false;
      state.highlighted = null;
      setHighlighted(null);
      setRequest(null);
      setHome(null);
      req.setOriginalHidden(false);
    };

    Animated.timing(backdrop, {
      toValue: 0,
      duration: motion.menuFadeDuration,
      useNativeDriver: true,
    }).start();

    // Mät om originalet och låt kopian landa exakt där.
    req.measure((rect) => {
      setHome(rect);
      if (reduceMotion) {
        Animated.timing(progress, {
          toValue: 0,
          duration: motion.menuFadeDuration,
          useNativeDriver: true,
        }).start(done);
      } else {
        // Ingen översvängning på vägen tillbaka: kopian blir aldrig mindre än originalet.
        Animated.spring(progress, {
          toValue: 0,
          ...motion.menuSpring,
          overshootClamping: true,
          useNativeDriver: true,
        }).start(done);
      }
    });
  }, [state, backdrop, progress, reduceMotion]);

  const select = useCallback(
    (i: number) => {
      const item = state.request?.items[i];
      if (!item) return;
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      item.onPress?.();
      close();
    },
    [state, close],
  );

  const open = useCallback(
    (req: ContextMenuRequest) => {
      if (state.request) return;
      state.start = null;
      state.dragged = false;
      state.highlighted = null;
      setHighlighted(null);
      setHome(req.anchor);
      setRequest(req);
      // Samma batch som kopian monteras: originalet döljs i samma frame.
      req.setOriginalHidden(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      progress.setValue(0);
      backdrop.setValue(0);
      Animated.timing(backdrop, {
        toValue: 1,
        duration: motion.duration.fast,
        useNativeDriver: true,
      }).start();
      if (reduceMotion) {
        Animated.timing(progress, {
          toValue: 1,
          duration: motion.duration.fast,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(progress, { toValue: 1, ...motion.menuSpring, useNativeDriver: true }).start();
      }
    },
    [state, progress, backdrop, reduceMotion],
  );

  const move = useCallback(
    (x: number, y: number) => {
      if (!state.request || state.closing) return;
      if (!state.start) state.start = { x, y };
      if (!state.dragged && Math.hypot(x - state.start.x, y - state.start.y) > DRAG_SLOP) {
        state.dragged = true;
      }
      setHighlight(rowAt(state.layout, state.request.items.length, x, y));
    },
    [state, setHighlight],
  );

  const release = useCallback(() => {
    if (!state.request || state.closing) return;
    if (state.highlighted !== null) {
      select(state.highlighted);
    } else if (state.dragged) {
      close();
    }
    // Annars: släppt där man höll in, menyn står kvar för tryck.
  }, [state, select, close]);

  const api = useMemo(() => ({ open, move, release, close }), [open, move, release, close]);

  return (
    <ContextMenuContext.Provider value={api}>
      {children}
      {request && layout && (
        <MenuOverlay
          request={request}
          layout={layout}
          home={home ?? request.anchor}
          highlighted={highlighted}
          progress={progress}
          backdrop={backdrop}
          reduceMotion={reduceMotion}
          onSelect={select}
          onClose={close}
        />
      )}
    </ContextMenuContext.Provider>
  );
}

type OverlayProps = {
  request: ContextMenuRequest;
  layout: MenuLayout;
  home: AnchorRect;
  highlighted: number | null;
  progress: Animated.Value;
  backdrop: Animated.Value;
  reduceMotion: boolean;
  onSelect: (i: number) => void;
  onClose: () => void;
};

function MenuOverlay({
  request,
  layout,
  home,
  highlighted,
  progress,
  backdrop,
  reduceMotion,
  onSelect,
  onClose,
}: OverlayProps) {
  const { scheme, shadows } = useTheme();
  const styles = useStyles();

  // Kopian har originalets storlek och radie och ligger på originalets plats.
  // Lyftet sker bara med transform (native driver): förflyttning till
  // lyft-layoutens mitt och skala upp till lyft-storleken × 1,04.
  const a = request.anchor;
  const k = request.liftScale;
  const dx = layout.lift.x + layout.lift.width / 2 - (home.x + a.width / 2);
  const dy = layout.lift.y + layout.lift.height / 2 - (home.y + a.height / 2);
  const lift = (to: number) =>
    reduceMotion ? 0 : progress.interpolate({ inputRange: [0, 1], outputRange: [0, to] });
  const liftScale = reduceMotion
    ? 1
    : progress.interpolate({ inputRange: [0, 1], outputRange: [1, k] });
  const menuScale = reduceMotion
    ? 1
    : progress.interpolate({ inputRange: [0, 1], outputRange: [motion.menuEnterScale, 1] });
  // Menyn glider in från kortets håll.
  const direction = layout.below ? -1 : 1;
  const menuShift = reduceMotion
    ? 0
    : progress.interpolate({ inputRange: [0, 1], outputRange: [direction * motion.menuOffset, 0] });
  const menuOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: backdrop }]}>
        <Pressable accessibilityLabel="Stäng meny" style={StyleSheet.absoluteFill} onPress={onClose}>
          <BlurView
            tint={scheme}
            intensity={edgeBlur.menuBackdropIntensity}
            blurMethod="dimezisBlurViewSdk31Plus"
            style={StyleSheet.absoluteFill}
          />
          <View style={[StyleSheet.absoluteFill, styles.scrim]} />
        </Pressable>
      </Animated.View>

      {/* Skuggan är ett eget lager som tonar med lyftet, så att den inte
          försvinner med ett ryck när kopian byts mot originalet. */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.liftShadow,
          {
            left: home.x,
            top: home.y,
            width: a.width,
            height: a.height,
            borderRadius: request.imageRadius,
            boxShadow: shadows.lift,
            opacity: menuOpacity,
            transform: [{ translateX: lift(dx) }, { translateY: lift(dy) }, { scale: liftScale }],
          },
        ]}
      />
      <Animated.View
        pointerEvents="none"
        style={[
          styles.lift,
          {
            left: home.x,
            top: home.y,
            width: a.width,
            height: a.height,
            borderRadius: request.imageRadius,
            transform: [{ translateX: lift(dx) }, { translateY: lift(dy) }, { scale: liftScale }],
          },
        ]}
      >
        <Image
          source={request.imageSource}
          style={styles.liftImage}
          resizeMode="cover"
          fadeDuration={0}
        />
        {request.renderOverlay?.()}
      </Animated.View>

      <Animated.View
        accessibilityRole="menu"
        style={[
          styles.menu,
          {
            left: layout.menu.x,
            top: layout.menu.y,
            width: layout.menu.width,
            boxShadow: shadows.menu,
            opacity: menuOpacity,
            transformOrigin: layout.below ? 'top' : 'bottom',
            transform: [{ translateY: menuShift }, { scale: menuScale }],
          },
        ]}
      >
        <BlurView
          tint={scheme}
          intensity={edgeBlur.menuIntensity}
          blurMethod="dimezisBlurViewSdk31Plus"
          // Egen radie på blur-lagret, se Glass.tsx (hårda kanter).
          style={[StyleSheet.absoluteFill, styles.menuShape]}
        />
        <View style={[StyleSheet.absoluteFill, styles.menuFill]} />
        {request.items.map((item, i) => (
          <MenuRow
            key={item.label}
            item={item}
            first={i === 0}
            highlighted={highlighted === i}
            onPress={() => onSelect(i)}
          />
        ))}
      </Animated.View>
    </View>
  );
}

function MenuRow({
  item,
  first,
  highlighted,
  onPress,
}: {
  item: ContextMenuItem;
  first: boolean;
  highlighted: boolean;
  onPress: () => void;
}) {
  const styles = useStyles();
  const { colors } = useTheme();
  const Icon = item.icon;
  return (
    <Pressable
      accessibilityRole="menuitem"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        !first && styles.rowDivider,
        (pressed || highlighted) && styles.rowPressed,
      ]}
    >
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Icon color={colors.textPrimary} size={iconSize.md} />
    </Pressable>
  );
}

const useStyles = makeStyles((t) => ({
  scrim: {
    backgroundColor: t.colors.scrim,
  },
  liftShadow: {
    position: 'absolute',
    borderCurve: 'continuous',
  },
  lift: {
    position: 'absolute',
    borderCurve: 'continuous',
    overflow: 'hidden',
    backgroundColor: t.colors.placeholder,
  },
  liftImage: {
    width: '100%',
    height: '100%',
  },
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
  row: {
    height: ROW_HEIGHT,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowDivider: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: t.colors.border,
  },
  rowPressed: {
    backgroundColor: t.colors.pressed,
  },
  rowLabel: {
    ...typography.body,
    color: t.colors.textPrimary,
  },
}));
