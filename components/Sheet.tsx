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
import { makeStyles, useTheme, typography, spacing, motion, edgeBlur, touchTarget, snackbar } from '../theme';
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
  // Riktning för senaste stegbytet: 1 = framåt (push), -1 = bakåt (pop).
  const [direction, setDirection] = useState<1 | -1>(1);
  const shown = useRef(new Animated.Value(0)).current;
  const drag = useRef(new Animated.Value(0)).current;
  const stepIn = useRef(new Animated.Value(1)).current;

  const animateStep = useCallback(
    (dir: 1 | -1) => {
      setDirection(dir);
      stepIn.setValue(0);
      Animated.timing(stepIn, { toValue: 1, duration: motion.sheet.step, useNativeDriver: true }).start();
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
    if (steps.length <= 1) {
      close();
      return;
    }
    setSteps((prev) => prev.slice(0, -1));
    animateStep(-1);
  }, [animateStep, close, steps.length]);

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
                  paddingTop: insets.top + spacing.sm,
                  opacity: shown,
                  transform: [{ translateY: Animated.add(rise, drag) }],
                },
              ]}
            >
              <KeyboardAvoidingView behavior="padding" style={styles.flex}>
                <View style={styles.header}>
                  <IconButton
                    tone="theme"
                    icon={steps.length > 1 ? BackIcon : CloseIcon}
                    accessibilityLabel={steps.length > 1 ? 'Tillbaka' : 'Stäng'}
                    onPress={pop}
                  />
                  <Text style={styles.title} numberOfLines={1} accessibilityRole="header">
                    {step.title}
                  </Text>
                  <View style={styles.headerSpacer} />
                </View>
                <Animated.View
                  key={steps.length}
                  style={[styles.flex, { opacity: stepIn, transform: [{ translateX: stepShift }] }]}
                >
                  {step.render()}
                </Animated.View>
              </KeyboardAvoidingView>
            </Animated.View>
          </GestureDetector>
        </View>
      )}
    </SheetContext.Provider>
  );
}

/**
 * Ett stegs layout: innehållet överst, `footer` (CTA) centrerad nederst och
 * ovanför tangentbordet (lagrets KeyboardAvoidingView skjuter upp den).
 */
export function SheetContent({ children, footer }: { children: ReactNode; footer?: ReactNode }) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.flex}>
      <View style={styles.body}>{children}</View>
      {footer ? (
        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, snackbar.bottomOffset) }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const useStyles = makeStyles((t) => ({
  flex: {
    flex: 1,
  },
  scrim: {
    backgroundColor: t.colors.scrim,
  },
  content: {
    ...StyleSheet.absoluteFill,
  },
  header: {
    height: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenMargin,
  },
  headerSpacer: {
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
    paddingTop: spacing.xxl,
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
}));
