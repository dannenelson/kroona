// Sheet (brief 33): återanvändbart helskärmslager för miniflöden, t.ex.
// Lägg till i samling → Skapa ny samling → Spara. Samma lagerprincip som
// ProductContextMenu (ingen RN Modal): blur + scrim över skärmen, så att man
// skymtar den under, och innehållet ovanpå.
//
//   const sheet = useSheet();
//   sheet.open({ title: 'Skapa samling', render: () => <MittSteg /> });
//   // i ett steg: sheet.push(nästaSteg), sheet.pop(), sheet.close()
//
// Ett steg ritar sitt innehåll med <SheetContent footer={<Button …/>}>, som
// håller CTA:n nederst och ovanför tangentbordet. Steg med egen skrollande
// lista kan stänga av swipe-stängningen (`swipeToClose: false`).
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Animated, BackHandler, Keyboard, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
import { makeStyles, useTheme, typography, spacing, motion, edgeBlur, touchTarget, snackbar, control } from '../theme';
import EdgeFade from './EdgeFade';
import { useReduceMotion } from '../hooks/useReduceMotion';
import IconButton from './IconButton';
import CloseIcon from '../assets/icons/CloseIcon';
import BackIcon from '../assets/icons/BackIcon';

export type SheetStep = {
  /** Titel centrerad i headern. */
  title: string;
  /** Stegets innehåll, normalt inslaget i <SheetContent>. */
  render: () => ReactNode;
  /** Swipe nedåt stänger lagret (standard). Av för steg med skrollande lista. */
  swipeToClose?: boolean;
  /** Anropas när lagret stängs (X, swipe, bakåt eller `close()`), för alla steg i stacken. */
  onClose?: () => void;
};

type SheetApi = {
  /** Öppnar lagret med ett första steg (ersätter ev. öppet flöde). */
  open: (step: SheetStep) => void;
  /** Nästa steg i flödet (tillbaka-chevron i headern). */
  push: (step: SheetStep) => void;
  /** Ett steg tillbaka; i första steget stängs lagret. */
  pop: () => void;
  close: () => void;
};

const SheetContext = createContext<SheetApi | null>(null);

/** Headerns underkant i lagret (från SheetProvider), för stegens marginaler. */
const SheetLayoutContext = createContext(0);

/** Marginaler för skrollande innehåll i ett steg (brief 39). */
type SheetInsets = { top: number; bottom: number };
const SheetInsetsContext = createContext<SheetInsets>({ top: 0, bottom: 0 });

/**
 * Marginaler för en skrollande lista i ett steg (`edgeToEdge`): lägg dem som
 * `paddingTop`/`paddingBottom` i listans `contentContainerStyle`, så att första
 * raden börjar under headern och de fasta elementen och sista raden kan
 * skrollas fri från CTA:n. Listan skrollar bakom båda och blurras där.
 */
export function useSheetInsets() {
  return useContext(SheetInsetsContext);
}

export function useSheet(): SheetApi {
  const ctx = useContext(SheetContext);
  if (!ctx) throw new Error('useSheet måste användas inuti <SheetProvider>');
  return ctx;
}

export function SheetProvider({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const { scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const [steps, setSteps] = useState<SheetStep[]>([]);
  // Aktuell stack för pop och close (anrop från äldre closures ska inte läsa gamla värden).
  const depth = useRef(0);
  depth.current = steps.length;
  const stackRef = useRef<SheetStep[]>([]);
  stackRef.current = steps;
  // Riktning för senaste stegbytet: 1 = framåt (push), -1 = bakåt (pop).
  const [direction, setDirection] = useState<1 | -1>(1);
  const shown = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const stepIn = useRef(new Animated.Value(1)).current;

  // Stegbyte: animationen startar när det nya steget har monterats (effekten
  // nedan) och körs med JS-driver: med native driver kopplades det nymonterade
  // stegets vy aldrig till animationen och blev kvar osynlig (brief 34).
  const pendingStep = useRef(false);
  const animateStep = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      stepIn.setValue(0);
      pendingStep.current = true;
    },
    [stepIn],
  );

  const open = useCallback(
    (step: SheetStep) => {
      setSteps([step]);
      drag.setValue(0);
      stepIn.setValue(1);
      shown.setValue(0);
      Animated.timing(shown, { toValue: 1, duration: motion.sheet.open, useNativeDriver: true }).start();
    },
    [drag, shown, stepIn],
  );

  const close = useCallback(() => {
    Keyboard.dismiss();
    stackRef.current.forEach((s) => s.onClose?.());
    Animated.timing(shown, { toValue: 0, duration: motion.sheet.close, useNativeDriver: true }).start(
      ({ finished }) => {
        if (!finished) return;
        setSteps([]);
        drag.setValue(0);
      },
    );
  }, [drag, shown]);

  const push = useCallback(
    (step: SheetStep) => {
      setSteps((prev) => [...prev, step]);
      animateStep(1);
    },
    [animateStep],
  );

  const pop = useCallback(() => {
    if (depth.current <= 1) {
      close();
      return;
    }
    setSteps((prev) => prev.slice(0, -1));
    animateStep(-1);
  }, [animateStep, close]);

  useEffect(() => {
    if (!pendingStep.current) return;
    pendingStep.current = false;
    Animated.timing(stepIn, { toValue: 1, duration: motion.sheet.step, useNativeDriver: false }).start();
  }, [steps.length, stepIn]);

  // Androids bakåt-gest/-knapp: ett steg tillbaka, eller stäng.
  useEffect(() => {
    if (steps.length === 0) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      pop();
      return true;
    });
    return () => sub.remove();
  }, [pop, steps.length]);

  const step = steps[steps.length - 1];

  // Swipe nedåt stänger: lagret följer fingret, släpp efter `dismissDistance`.
  const swipe = usePanGesture({
    enabled: !!step && step.swipeToClose !== false,
    activeOffsetY: motion.dismissActivationDistance,
    failOffsetX: [-motion.dismissActivationDistance, motion.dismissActivationDistance],
    runOnJS: true,
    disableReanimated: true,
    onUpdate: (e) => drag.setValue(Math.max(0, e.translationY)),
    onDeactivate: (e) => {
      if (e.translationY > motion.sheet.dismissDistance) {
        close();
      } else {
        Animated.spring(drag, { toValue: 0, ...motion.spring, useNativeDriver: true }).start();
      }
    },
  });

  const api = useMemo(() => ({ open, push, pop, close }), [open, push, pop, close]);
  // Headerns underkant: stegens innehåll börjar (eller skrollar) under den.
  const headerBottom = insets.top + spacing.sm + touchTarget;

  // Bakgrunden tonar; innehållet tonar och stiger lätt (Minska rörelse: bara tonning).
  const rise = reduceMotion
    ? 0
    : shown.interpolate({ inputRange: [0, 1], outputRange: [motion.sheet.rise, 0] });
  const stepShift = reduceMotion
    ? 0
    : stepIn.interpolate({ inputRange: [0, 1], outputRange: [direction * motion.sheet.stepShift, 0] });
  const dragFade = drag.interpolate({
    inputRange: [0, motion.sheet.dismissDistance * 2],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <SheetContext.Provider value={api}>
      {children}
      {step && (
        <View style={StyleSheet.absoluteFill} accessibilityViewIsModal>
          <Animated.View
            pointerEvents="none"
            style={[StyleSheet.absoluteFill, { opacity: Animated.multiply(shown, dragFade) }]}
          >
            <BlurView
              tint={scheme}
              intensity={edgeBlur.menuBackdropIntensity}
              blurMethod="dimezisBlurViewSdk31Plus"
              style={StyleSheet.absoluteFill}
            />
            <View style={[StyleSheet.absoluteFill, styles.scrim]} />
          </Animated.View>

          <GestureDetector gesture={swipe}>
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: shown,
                  transform: [{ translateY: Animated.add(rise, drag) }],
                },
              ]}
            >
              {/* Stegets innehåll fyller hela lagret och kan skrolla bakom headern
                  (blurras där, se SheetContent); headern ligger ovanpå. */}
              <SheetLayoutContext.Provider value={headerBottom}>
                <KeyboardAvoidingView behavior="padding" style={styles.flex}>
                  <Animated.View
                    key={steps.length}
                    style={[styles.flex, { opacity: stepIn, transform: [{ translateX: stepShift }] }]}
                  >
                    {step.render()}
                  </Animated.View>
                </KeyboardAvoidingView>
              </SheetLayoutContext.Provider>
              <View style={[styles.header, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
                {/* Tillbaka alltid till vänster (bara i senare steg), X alltid till
                    höger. Lika breda sidor, så att titeln står still mellan stegen. */}
                <View style={styles.headerSide}>
                  {steps.length > 1 ? (
                    <IconButton tone="theme" icon={BackIcon} accessibilityLabel="Tillbaka" onPress={pop} />
                  ) : null}
                </View>
                <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
                  {step.title}
                </Text>
                <View style={styles.headerSide}>
                  <IconButton tone="theme" icon={CloseIcon} accessibilityLabel="Stäng" onPress={close} />
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      )}
    </SheetContext.Provider>
  );
}

/**
 * Ett stegs layout (brief 33, 38, 39). Innehållet fyller lagret och går bakom
 * headern, de fasta elementen (`header`, t.ex. produktchip + sök) och CTA-ytan
 * (`footer`), där det blurras progressivt med kantblurren (EdgeFade, samma som
 * skärmarnas kanter och flikfältet): suddigt närmast kanten, skarpt längre in.
 * - Vanligt innehåll (t.ex. Skapa samling) får marginalerna automatiskt.
 * - `edgeToEdge`: barnet är en skrollande lista som själv lägger
 *   `useSheetInsets()` i sin `contentContainerStyle`.
 * CTA:n ligger fast nederst och ovanför tangentbordet.
 */
export function SheetContent({
  children,
  header,
  footer,
  edgeToEdge = false,
}: {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  edgeToEdge?: boolean;
}) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const headerBottom = useContext(SheetLayoutContext);
  const [fixedHeight, setFixedHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const fade = control.sheetFadeHeight;
  // Fasta element börjar en bit under headern; innehållet under dem.
  const fixedTop = headerBottom + spacing.lg;
  const top = header ? fixedTop + fixedHeight + spacing.md : headerBottom + spacing.xxl;
  const bottom = footer ? footerHeight : 0;
  const value = useMemo(() => ({ top, bottom }), [top, bottom]);

  return (
    <SheetInsetsContext.Provider value={value}>
      <View style={styles.flex}>
        {edgeToEdge ? (
          children
        ) : (
          <View style={[styles.body, { paddingTop: top, paddingBottom: bottom }]}>{children}</View>
        )}

        {/* Progressiv blur upptill (bakom header och fasta element) och nedtill (bakom CTA). */}
        <EdgeFade position="top" variant="clear" height={top} />
        {footer ? <EdgeFade position="bottom" variant="clear" height={bottom + fade} /> : null}

        {header ? (
          <View
            style={[styles.fixed, { top: fixedTop }]}
            onLayout={(e) => setFixedHeight(e.nativeEvent.layout.height)}
          >
            {header}
          </View>
        ) : null}
        {footer ? (
          <View
            onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
            style={[styles.footer, { paddingBottom: Math.max(insets.bottom, snackbar.bottomOffset) }]}
          >
            {footer}
          </View>
        ) : null}
      </View>
    </SheetInsetsContext.Provider>
  );
}

const useStyles = makeStyles((t) => ({
  flex: {
    flex: 1,
  },
  scrim: {
    backgroundColor: t.colors.sheetScrim,
  },
  content: {
    ...StyleSheet.absoluteFill,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
  },
  headerSide: {
    width: touchTarget,
  },
  title: {
    ...typography.headline,
    color: t.colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  body: {
    flex: 1,
    paddingHorizontal: spacing.screenMargin,
  },
  fixed: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: spacing.screenMargin,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.screenMargin,
  },

}));
