import { Animated, Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, typography, spacing, radius, motion, touchTarget, homeHeader } from '../theme';
import Glass, { useGlass, type GlassTone } from './Glass';
import { usePressAnimation } from '../hooks/usePressAnimation';
import { haptic } from '../utils/haptic';

type Props = {
  children: string;
  onPress?: () => void;
  /** 'filled' (standard, surface2) eller 'glass' (på foto). */
  variant?: 'filled' | 'glass';
  /** Gäller glas-varianten: 'photo' ger glas på foto som följer temat. */
  tone?: GlassTone;
  selected?: boolean;
  disabled?: boolean;
  /** 'md' 34 hög (standard), 'filter' 36 hög (filterpillar på Hem, brief 46). */
  size?: 'md' | 'filter';
  /** Haptik vid tryck: 'light' (standard) eller 'selection' (som TextTabs). */
  haptics?: 'light' | 'selection';
  style?: StyleProp<ViewStyle>;
};

// Höjd 34 enligt referensen: label-radhöjd + padding (18 + 2×8).
// hitSlop fyller ut till minsta tryckyta 44.
const PILL_HEIGHT = typography.label.lineHeight + spacing.sm * 2;
const HIT = (touchTarget - PILL_HEIGHT) / 2;
const HIT_FILTER = (touchTarget - homeHeader.filterPillHeight) / 2;

/**
 * Pill: byter innehåll överst på en skärm (design.md §11). Filtrering görs med
 * TextTabs, utom på Hem där storleken 'filter' används (FilterPills, brief 46). States enligt design.md §0:
 * pressed = pressed-yta + skala 0,96, selected = inverterad (text-färg som yta),
 * disabled = 35 % opacitet. Form: pill (radie full, ingen squircle).
 */
export default function Pill({
  children,
  onPress,
  variant = 'filled',
  tone = 'photo',
  selected = false,
  disabled = false,
  size = 'md',
  haptics = 'light',
  style,
}: Props) {
  const sizeStyle = size === 'filter' ? styles.filterSize : undefined;
  const { colors } = useTheme();
  const g = useGlass(tone);
  const isGlass = variant === 'glass';
  const press = usePressAnimation(motion.pressedScale);

  // Ytbytet vid tryck tonar in som ett lager (pressed-yta eller glasets tint).
  const renderBody = () => {
    if (selected) {
      // Inverterad: glasets innehållsfärg (glas) eller textfärg (fylld) som yta.
      const bg = isGlass ? g.content : colors.textPrimary;
      return (
        <View style={[styles.shape, sizeStyle, { backgroundColor: bg }]}>
          <Text style={[styles.label, { color: colors.bg }]}>{children}</Text>
        </View>
      );
    }
    if (isGlass) {
      return (
        <Glass tone={tone} dimmed={disabled} style={[styles.shape, sizeStyle]}>
          <Animated.View
            style={[StyleSheet.absoluteFill, { backgroundColor: g.borderColor, opacity: press.progress }]}
          />
          <Text style={[styles.label, { color: g.content }]}>{children}</Text>
        </Glass>
      );
    }
    return (
      <View style={[styles.shape, sizeStyle, styles.filled, { backgroundColor: colors.surfaceRaised }]}>
        <Animated.View
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressed, opacity: press.progress }]}
        />
        <Text style={[styles.label, { color: colors.textPrimary }]}>{children}</Text>
      </View>
    );
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => {
        if (haptics === 'selection') haptic.selection();
        else haptic.light();
        onPress?.();
      }}
      hitSlop={size === 'filter' ? { top: HIT_FILTER, bottom: HIT_FILTER } : { top: HIT, bottom: HIT }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[
        // Glas tonas inuti Glass (dimmed): opacitet på blurrens förälder bryter effekten.
        disabled && !(isGlass && !selected) && styles.disabled,
        style,
      ]}
    >
      <Animated.View style={press.scaleStyle}>{renderBody()}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shape: {
    height: PILL_HEIGHT,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterSize: {
    height: homeHeader.filterPillHeight,
  },
  label: {
    ...typography.label,
  },
  filled: {
    overflow: 'hidden',
  },
  disabled: {
    opacity: motion.disabledOpacity,
  },
});
