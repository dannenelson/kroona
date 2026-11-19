import { createContext, useCallback, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { makeStyles, motion, radius, spacing, typography } from '../theme';
import Glass from './Glass';
import { useReduceMotion } from '../hooks/useReduceMotion';

type ToastApi = {
  /** Visar en kort bekräftelse som försvinner av sig själv. */
  show: (text: string) => void;
};

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast måste användas inuti <ToastProvider>');
  return ctx;
}

/**
 * Liten, tillfällig glasruta längst ner (brief 13). Glider in och ut med
 * translateY: opacitet på blurrens förälder bryter glaseffekten (se Glass.tsx).
 * Reduce motion: visas och döljs direkt. Släpper igenom tryck.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReduceMotion();
  const [text, setText] = useState<string | null>(null);
  // 0 = dold (utanför nederkanten), 1 = synlig.
  const shown = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [height, setHeight] = useState(0);

  const hide = useCallback(() => {
    if (reduceMotion) {
      shown.setValue(0);
      setText(null);
      return;
    }
    Animated.timing(shown, { toValue: 0, duration: motion.duration.base, useNativeDriver: true }).start(
      ({ finished }) => finished && setText(null),
    );
  }, [reduceMotion, shown]);

  const show = useCallback(
    (next: string) => {
      if (timer.current) clearTimeout(timer.current);
      setText(next);
      shown.stopAnimation();
      if (reduceMotion) {
        shown.setValue(1);
      } else {
        Animated.spring(shown, { toValue: 1, ...motion.spring, useNativeDriver: true }).start();
      }
      timer.current = setTimeout(hide, motion.toastDuration);
    },
    [hide, reduceMotion, shown],
  );

  const api = useMemo(() => ({ show }), [show]);
  // Dold läge: hela rutan plus glidavståndet under sin plats.
  const offset = height + insets.bottom + motion.toastSlide;
  const translateY = shown.interpolate({ inputRange: [0, 1], outputRange: [offset, 0] });

  return (
    <ToastContext.Provider value={api}>
      {children}
      {text !== null && (
        <View pointerEvents="none" style={[styles.host, { bottom: insets.bottom + spacing.lg }]}>
          <Animated.View
            onLayout={(e) => setHeight(e.nativeEvent.layout.height)}
            style={{ transform: [{ translateY }] }}
          >
            <Glass tone="theme" style={styles.toast}>
              <Text style={styles.text} accessibilityLiveRegion="polite" accessibilityRole="alert">
                {text}
              </Text>
            </Glass>
          </Animated.View>
        </View>
      )}
    </ToastContext.Provider>
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
  toast: {
    borderRadius: radius.card,
    borderCurve: 'continuous',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  text: {
    ...typography.body,
    color: t.glass.content,
    textAlign: 'center',
  },
}));
