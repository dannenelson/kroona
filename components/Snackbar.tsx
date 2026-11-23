// Snackbar (brief 33): ersätter toasten och små bekräftelseskärmar. En i taget
// (ny ersätter gammal), syns ca 4 s, kan svepas bort nedåt. Valfri miniatyr
// till vänster och åtgärd (t.ex. "Visa") som kompakt pill till höger.
// Läge: centrerad, ovanför flikfältet när det syns, annars 40 px från botten.
import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { makeStyles, useTheme, typography, fonts, spacing, radius, motion, edgeBlur, snackbar } from '../theme';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { haptic } from '../utils/haptic';
import { tabBarSpace } from './CustomTabBar';
import Button from './Button';

export type SnackbarOptions = {
  text: string;
  /** Miniatyr (t.ex. produktbilden) till vänster. */
  thumbUri?: string;
  /** Valfri åtgärd, t.ex. { label: 'Visa', onPress }. */
  action?: { label: string; onPress: () => void };
};

type SnackbarApi = {
  show: (options: SnackbarOptions) => void;
};

const SnackbarContext = createContext<SnackbarApi | null>(null);

export function useSnackbar(): SnackbarApi {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar måste användas inuti <SnackbarProvider>');
  return ctx;
}

// Flikarnas sökvägar: där syns flikfältet och snackbaren ligger ovanför det.
const TAB_PATHS = new Set(['/', '/feed', '/find', '/saved']);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const { scheme, shadows } = useTheme();
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const reduceMotion = useReduceMotion();
  const [current, setCurrent] = useState<SnackbarOptions | null>(null);
  // 0 = dold, 1 = synlig. Svepet nedåt läggs ovanpå som egen förflyttning.
  const shown = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    Animated.timing(shown, {
      toValue: 0,
      duration: motion.duration.base,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setCurrent(null);
      drag.setValue(0);
    });
  }, [drag, shown]);

  const show = useCallback(
    (options: SnackbarOptions) => {
      if (timer.current) clearTimeout(timer.current);
      setCurrent(options);
      drag.setValue(0);
      shown.stopAnimation();
      shown.setValue(0);
      if (reduceMotion) {
        Animated.timing(shown, { toValue: 1, duration: motion.duration.fast, useNativeDriver: true }).start();
      } else {
        Animated.spring(shown, { toValue: 1, ...motion.spring, useNativeDriver: true }).start();
      }
      haptic.success();
      timer.current = setTimeout(hide, motion.snackbar.duration);
    },
    [drag, hide, reduceMotion, shown],
  );

  // Svep nedåt: följer fingret, släpp efter `dismissDistance` döljer, annars tillbaka.
  const swipe = usePanGesture({
    activeOffsetY: spacing.xs,
    runOnJS: true,
    disableReanimated: true,
    onUpdate: (e) => drag.setValue(Math.max(0, e.translationY)),
    onDeactivate: (e) => {
      if (e.translationY > motion.snackbar.dismissDistance) {
        hide();
      } else {
        Animated.spring(drag, { toValue: 0, ...motion.spring, useNativeDriver: true }).start();
      }
    },
  });

  const api = useMemo(() => ({ show }), [show]);
  const onTabs = TAB_PATHS.has(pathname);
  const bottom = onTabs ? tabBarSpace(insets.bottom) + spacing.md : snackbar.bottomOffset;
  // Minska rörelse: bara tonning. Annars glider den upp; opaciteten ligger på
  // ett eget lager utanför blurren (opacitet på blurrens förälder bryter glaset,
  // se Glass.tsx), så den används bara i reduce motion.
  const translateY = reduceMotion
    ? drag
    : Animated.add(shown.interpolate({ inputRange: [0, 1], outputRange: [motion.snackbar.slide + bottom, 0] }), drag);

  return (
    <SnackbarContext.Provider value={api}>
      {children}
      {current !== null && (
        <View pointerEvents="box-none" style={[styles.host, { bottom }]}>
          <GestureDetector gesture={swipe}>
            <Animated.View
              accessibilityRole="alert"
              accessibilityLiveRegion="polite"
              style={[
                styles.bar,
                { boxShadow: shadows.menu, transform: [{ translateY }] },
                reduceMotion && { opacity: shown },
              ]}
            >
              <BlurView
                tint={scheme}
                intensity={edgeBlur.menuIntensity}
                blurMethod="dimezisBlurViewSdk31Plus"
                // Egen radie på blur-lagret, se Glass.tsx (hårda kanter).
                style={[StyleSheet.absoluteFill, styles.shape]}
              />
              <View style={[StyleSheet.absoluteFill, styles.fill]} />
              {current.thumbUri ? <Image source={{ uri: current.thumbUri }} style={styles.thumb} /> : null}
              <Text style={styles.text} numberOfLines={2}>
                {current.text}
              </Text>
              {current.action ? (
                <Button
                  variant="secondary"
                  size="compact"
                  onPress={() => {
                    current.action?.onPress();
                    hide();
                  }}
                >
                  {current.action.label}
                </Button>
              ) : null}
            </Animated.View>
          </GestureDetector>
        </View>
      )}
    </SnackbarContext.Provider>
  );
}

const useStyles = makeStyles((t) => ({
  host: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: spacing.screenMargin,
  },
  bar: {
    maxWidth: snackbar.maxWidth,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: snackbar.padding,
    borderRadius: radius.bubble,
    borderCurve: 'continuous',
    borderWidth: t.glass.borderWidth,
    borderColor: t.glass.borderColor,
    overflow: 'hidden',
  },
  shape: {
    borderRadius: radius.bubble,
    borderCurve: 'continuous',
    overflow: 'hidden',
  },
  fill: {
    backgroundColor: t.colors.menu,
  },
  thumb: {
    width: snackbar.thumb,
    height: snackbar.thumb,
    borderRadius: radius.tile,
    borderCurve: 'continuous',
    backgroundColor: t.colors.placeholder,
  },
  text: {
    ...typography.body,
    fontFamily: fonts.ui500,
    color: t.colors.textPrimary,
    flexShrink: 1,
    paddingHorizontal: spacing.xs,
  },
}));
