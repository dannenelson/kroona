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
// håller CTA:n nederst och ovanför tangentbordet.
//
// Två presentationer (första stegets `presentation`):
// - 'fullscreen' (standard): helskärmslager med blur + scrim och X/chevron.
// - 'card' (brief 40, YouTube/Instagram-stil): kort med luft runt om över en
//   mörk overlay, vänsterställd rubrik. Två snapp-lägen, 2/3 och full höjd:
//   skroll uppåt växer kortet först, skroll nedåt på listans topp krymper det
//   och stänger under 2/3 (en kontinuerlig gest, UI-tråden). Listor i kortet
//   använder <SheetScrollView>, som kopplas till kortets gest.
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
import {
  Animated,
  BackHandler,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type ScrollViewProps,
} from 'react-native';
import Reanimated, {
  interpolate,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureDetector, useNativeGesture, usePanGesture, type PanGesture } from 'react-native-gesture-handler';
import {
  makeStyles,
  useTheme,
  typography,
  fonts,
  spacing,
  motion,
  edgeBlur,
  touchTarget,
  snackbar,
  control,
  radius,
  sheetCard,
} from '../theme';
import EdgeFade from './EdgeFade';
import { useReduceMotion } from '../hooks/useReduceMotion';
import IconButton from './IconButton';
import CloseIcon from '../assets/icons/CloseIcon';

export type SheetStep = {
  /** Titel centrerad i headern. */
  title: string;
  /** Stegets innehåll, normalt inslaget i <SheetContent>. */
  render: () => ReactNode;
  /** Swipe nedåt stänger lagret (standard). Av för steg med skrollande lista. */
  swipeToClose?: boolean;
  /** Anropas när lagret stängs (X, swipe, bakåt eller `close()`), för alla steg i stacken. */
  onClose?: () => void;
  /** 'card' = kort-sheet (brief 40); gäller hela flödet, styrs av första steget. */
  presentation?: 'fullscreen' | 'card';
  /** Högerställd textlänk på kortets rubrikrad (brief 41, t.ex. "Ny samling"). */
  headerAction?: { label: string; onPress: () => void };
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

/** 'card' inne i kort-sheeten (brief 40), annars 'fullscreen'. */
const SheetPresentationContext = createContext<'fullscreen' | 'card'>('fullscreen');

/** Kortets gest och skroll, för <SheetScrollView> (brief 40). */
type CardScroll = {
  pan: PanGesture;
  scrollRef: ReturnType<typeof useAnimatedRef<Reanimated.ScrollView>>;
  scrollY: SharedValue<number>;
  hasScroll: SharedValue<boolean>;
};
const SheetCardScrollContext = createContext<CardScroll | null>(null);

/**
 * Skrollande lista i ett steg. I kort-sheeten kopplas den till kortets gest:
 * skroll uppåt växer kortet först, skroll nedåt på toppen krymper/stänger det.
 * I helskärm är den en vanlig ScrollView.
 */
export function SheetScrollView(props: ScrollViewProps) {
  const card = useContext(SheetCardScrollContext);
  if (!card) return <ScrollView {...props} />;
  return <CardScrollView card={card} {...props} />;
}

function CardScrollView({ card, ...props }: ScrollViewProps & { card: CardScroll }) {
  const native = useNativeGesture({ simultaneousWith: card.pan });
  // Fånga bara shared values i workleten (inte gesten), annars fryses gestens
  // relationslista och kan inte uppdateras när listan monteras igen.
  const { scrollY, hasScroll } = card;
  const onScroll = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });
  useEffect(() => {
    hasScroll.value = true;
    return () => {
      hasScroll.value = false;
    };
  }, [hasScroll]);
  return (
    <GestureDetector gesture={native}>
      <Reanimated.ScrollView
        {...props}
        ref={card.scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        // Ingen gummistuds överst: där tar kortets gest över.
        bounces={false}
      />
    </GestureDetector>
  );
}

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
  // Kort-sheet: stängning animeras av CardLayer, som sedan anropar finishCardClose.
  const [cardClosing, setCardClosing] = useState(false);
  const presentation = steps[0]?.presentation ?? 'fullscreen';
  const presentationRef = useRef(presentation);
  presentationRef.current = presentation;
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
      setCardClosing(false);
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
    if (presentationRef.current === 'card') {
      setCardClosing(true);
      return;
    }
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
  const finishCardClose = useCallback(() => {
    setSteps([]);
    setCardClosing(false);
  }, []);
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
      {step && presentation === 'card' && (
        <CardLayer
          title={step.title}
          headerAction={step.headerAction}
          depth={steps.length}
          closing={cardClosing}
          onBack={pop}
          onRequestClose={close}
          onClosed={finishCardClose}
          stepStyle={{ opacity: stepIn, transform: [{ translateX: stepShift }] }}
          stepKey={steps.length}
        >
          {step.render()}
        </CardLayer>
      )}
      {step && presentation === 'fullscreen' && (
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
                    <IconButton tone="theme" icon="back-arrow" accessibilityLabel="Tillbaka" onPress={pop} />
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
 * Kort-sheeten (brief 40). Bottenförankrat kort med luft runt om över en mörk
 * overlay; synlig höjd `h` är ett shared value med snapp-lägena 2/3 och full.
 * En pan-gest på kortet körs samtidigt med listans skroll (SheetScrollView):
 * fingret uppåt växer kortet till full höjd medan listan hålls på toppen,
 * därefter skrollar listan; fingret nedåt på listans topp krymper kortet, och
 * under 2/3 stängs det vid släpp efter avstånd eller fart. Allt på UI-tråden.
 * Minska rörelse: kortet tonar in/ut i stället för att glida.
 */
function CardLayer({
  title,
  headerAction,
  depth,
  closing,
  onBack,
  onRequestClose,
  onClosed,
  stepStyle,
  stepKey,
  children,
}: {
  title: string;
  headerAction?: SheetStep['headerAction'];
  depth: number;
  closing: boolean;
  onBack: () => void;
  onRequestClose: () => void;
  onClosed: () => void;
  stepStyle: object;
  stepKey: number;
  children: ReactNode;
}) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const { height: windowHeight } = useWindowDimensions();
  const bottomGap = insets.bottom + sheetCard.inset;
  const full = windowHeight - insets.top - sheetCard.inset - bottomGap;
  const mid = Math.min(full, windowHeight * sheetCard.midRatio);
  const headerBottom = spacing.md + touchTarget;

  const h = useSharedValue(0);
  const fade = useSharedValue(reduceMotion ? 0 : 1);
  const lastY = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const hasScroll = useSharedValue(false);
  const scrollRef = useAnimatedRef<Reanimated.ScrollView>();

  // Öppna: glid upp till 2/3 (Minska rörelse: direkt på 2/3 och tona in).
  useEffect(() => {
    if (reduceMotion) {
      h.value = mid;
      fade.value = withTiming(1, { duration: motion.sheet.open });
    } else {
      h.value = withSpring(mid, motion.spring);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Senare steg (t.ex. Skapa samling) får full höjd.
  useEffect(() => {
    if (depth > 1) h.value = reduceMotion ? full : withSpring(full, motion.spring);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depth]);

  // Stäng: glid ut (eller tona ut), sedan avmonteras lagret.
  useEffect(() => {
    if (!closing) return;
    const done = (finished?: boolean) => {
      'worklet';
      if (finished) scheduleOnRN(onClosed);
    };
    if (reduceMotion) fade.value = withTiming(0, { duration: motion.sheet.close }, done);
    else h.value = withTiming(0, { duration: motion.sheetCard.flyOut }, done);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closing]);

  const snapTo = (target: number) => {
    'worklet';
    h.value = reduceMotion ? target : withSpring(target, motion.spring);
  };
  const lockScroll = () => {
    'worklet';
    if (hasScroll.value) scrollTo(scrollRef, 0, 0, false);
  };

  const pan = usePanGesture({
    activeOffsetY: [-motion.dismissActivationDistance, motion.dismissActivationDistance],
    failOffsetX: [-motion.dismissActivationDistance, motion.dismissActivationDistance],
    onBegin: () => {
      'worklet';
      lastY.value = 0;
    },
    onUpdate: (e) => {
      'worklet';
      const dy = e.translationY - lastY.value;
      lastY.value = e.translationY;
      if (dy < 0 && h.value < full) {
        // Fingret uppåt: kortet växer först, listan står still på toppen.
        h.value = Math.min(full, h.value - dy);
        lockScroll();
      } else if (dy > 0 && scrollY.value <= 0) {
        // Fingret nedåt med listan på toppen: kortet krymper (under 2/3 = stäng-drag).
        h.value = Math.max(0, h.value - dy);
        lockScroll();
      }
    },
    onDeactivate: (e) => {
      'worklet';
      const v = e.velocityY;
      const { snapVelocity, dismissDistance } = motion.sheetCard;
      if (h.value < mid - 1) {
        if (v > snapVelocity || h.value < mid - dismissDistance) scheduleOnRN(onRequestClose);
        else snapTo(mid);
        return;
      }
      if (v < -snapVelocity) snapTo(full);
      else if (v > snapVelocity) snapTo(mid);
      else snapTo(h.value > (mid + full) / 2 ? full : mid);
    },
  });

  const cardStyle = useAnimatedStyle(() => ({ height: h.value, opacity: fade.value }));
  const scrimStyle = useAnimatedStyle(() => ({
    opacity: interpolate(h.value, [0, mid], [0, 1], 'clamp') * fade.value,
  }));
  const cardScroll = useMemo(() => ({ pan, scrollRef, scrollY, hasScroll }), [pan, scrollRef, scrollY, hasScroll]);

  return (
    <View style={StyleSheet.absoluteFill} accessibilityViewIsModal>
      <Reanimated.View style={[StyleSheet.absoluteFill, scrimStyle]}>
        <Pressable
          style={[StyleSheet.absoluteFill, styles.cardScrim]}
          onPress={onRequestClose}
          accessibilityLabel="Stäng"
        />
      </Reanimated.View>
      <GestureDetector gesture={pan}>
        <Reanimated.View
          style={[
            styles.card,
            { left: sheetCard.inset, right: sheetCard.inset, bottom: bottomGap },
            cardStyle,
          ]}
        >
          <SheetPresentationContext.Provider value="card">
            <SheetCardScrollContext.Provider value={cardScroll}>
              <SheetLayoutContext.Provider value={headerBottom}>
                <KeyboardAvoidingView behavior="padding" style={styles.flex}>
                  <Animated.View key={stepKey} style={[styles.flex, stepStyle]}>
                    {children}
                  </Animated.View>
                </KeyboardAvoidingView>
              </SheetLayoutContext.Provider>
            </SheetCardScrollContext.Provider>
          </SheetPresentationContext.Provider>
          {/* Vänsterställd rubrik; tillbaka-chevron i senare steg. Ingen X. */}
          <View style={styles.cardHeader} pointerEvents="box-none">
            {depth > 1 ? (
              <IconButton tone="theme" icon="back-arrow" accessibilityLabel="Tillbaka" onPress={onBack} />
            ) : null}
            <Text style={styles.cardTitle} numberOfLines={1} accessibilityRole="header">
              {title}
            </Text>
            {headerAction ? (
              // Neutral textlänk (Instagram-mönstret), tryckyta ≥ 44, tonar vid tryck.
              <Pressable
                onPress={headerAction.onPress}
                accessibilityRole="button"
                hitSlop={spacing.sm}
                style={({ pressed }) => [styles.cardAction, pressed && styles.cardActionPressed]}
              >
                <Text style={styles.cardActionText}>{headerAction.label}</Text>
              </Pressable>
            ) : null}
          </View>
        </Reanimated.View>
      </GestureDetector>
    </View>
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
  const presentation = useContext(SheetPresentationContext);
  const [fixedHeight, setFixedHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const fade = control.sheetFadeHeight;
  // Fasta element börjar en bit under headern; innehållet under dem.
  const fixedTop = headerBottom + spacing.lg;
  const top = header
    ? fixedTop + fixedHeight + spacing.md
    : headerBottom + (presentation === 'card' ? spacing.sm : spacing.xxl);
  // I kortet finns alltid luft och blur nedtill, även utan CTA (brief 41).
  const bottom = footer ? footerHeight : presentation === 'card' ? spacing.lg : 0;
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
        {footer || presentation === 'card' ? (
          <EdgeFade position="bottom" variant="clear" height={bottom + fade} />
        ) : null}

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
            style={[
              styles.footer,
              // I kortet ligger CTA:n en bit över kortets kant; i helskärm över safe area.
              { paddingBottom: presentation === 'card' ? spacing.lg : Math.max(insets.bottom, snackbar.bottomOffset) },
            ]}
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
  cardScrim: {
    backgroundColor: t.colors.sheetCardScrim,
  },
  card: {
    position: 'absolute',
    overflow: 'hidden',
    borderRadius: radius.sheetCard,
    borderCurve: 'continuous',
    backgroundColor: t.colors.sheetCard,
  },
  cardHeader: {
    position: 'absolute',
    top: spacing.md,
    left: 0,
    right: 0,
    height: touchTarget,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.screenMargin,
  },
  cardTitle: {
    ...typography.headline,
    color: t.colors.textPrimary,
    flex: 1,
  },
  cardAction: {
    minHeight: touchTarget,
    justifyContent: 'center',
  },
  cardActionPressed: {
    opacity: motion.pressedTextOpacity,
  },
  cardActionText: {
    ...typography.body,
    fontFamily: fonts.ui600,
    color: t.colors.textPrimary,
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
