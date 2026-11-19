import { useEffect, useRef, type ComponentType } from 'react';
import { Animated, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, motion, radius, touchTarget, iconSize } from '../theme';
import Glass, { useGlass, type GlassTone } from './Glass';
import { usePressAnimation } from '../hooks/usePressAnimation';
import { useReduceMotion } from '../hooks/useReduceMotion';
import { haptic } from '../utils/haptic';

type IconProps = { color: string; size?: number };

type Props = {
  icon: ComponentType<IconProps>;
  /** Ikon i selected-state (t.ex. fyllt bokmärke). Faller tillbaka på `icon`. */
  selectedIcon?: ComponentType<IconProps>;
  accessibilityLabel: string;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  /** 'theme', 'photo' eller 'plain', se Glass. */
  tone?: GlassTone;
  /** 'glass' (standard) har egen glasyta. 'bare' saknar yta, för knappar i en glaskapsel. */
  variant?: 'glass' | 'bare';
  size?: 'md';
  style?: StyleProp<ViewStyle>;
};

/**
 * Rund ikonknapp, 44 px (touchTarget). States enligt design.md §0:
 * pressed = djupare yta + skala 0,96 (animerat, brief 06), selected = fylld ikon
 * (`selectedIcon`, som iOS) med en kort "pop" vid markering (brief 09),
 * disabled = 35 % opacitet. Lätt haptik vid tryck.
 */
export default function IconButton({
  icon: Icon,
  selectedIcon,
  accessibilityLabel,
  onPress,
  selected = false,
  disabled = false,
  tone = 'theme',
  variant = 'glass',
  style,
}: Props) {
  const { colors } = useTheme();
  const g = useGlass(tone);
  // Vald = fylld ikon. Saknas fylld variant visas outline.
  const ShownIcon = selected && selectedIcon ? selectedIcon : Icon;
  const reduceMotion = useReduceMotion();

  // Pop när ikonen blir fylld: 1 → popScale → 1. Inte vid första render
  // eller avmarkering, och inte med reduce motion.
  const pop = useRef(new Animated.Value(1)).current;
  const wasSelected = useRef(selected);
  useEffect(() => {
    if (selected && !wasSelected.current && !reduceMotion) {
      pop.setValue(1);
      Animated.sequence([
        Animated.timing(pop, { toValue: motion.popScale, duration: motion.popIn, useNativeDriver: true }),
        Animated.spring(pop, { toValue: 1, ...motion.popSpring, useNativeDriver: true }),
      ]).start();
    }
    wasSelected.current = selected;
  }, [selected, reduceMotion, pop]);

  // Djupare yta vid tryck: en hårlinjefärg ovanpå glaset (samma som menyrader).
  const pressedTint = tone === 'photo' ? g.borderColor : colors.border;
  const isGlass = variant === 'glass';
  const press = usePressAnimation(motion.pressedScale);

  const content = (
    <Animated.View style={{ transform: [{ scale: pop }] }}>
      <ShownIcon color={g.content} size={iconSize.lg} />
    </Animated.View>
  );
  const fill = (
    <Animated.View
      style={[StyleSheet.absoluteFill, { backgroundColor: pressedTint, opacity: press.progress }]}
    />
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={() => {
        haptic.light();
        onPress?.();
      }}
      onPressIn={press.onPressIn}
      onPressOut={press.onPressOut}
      style={[
        // Glas tonas inuti Glass (dimmed): opacitet på blurrens förälder bryter effekten.
        disabled && !isGlass && styles.disabled,
        style,
      ]}
    >
      <Animated.View style={press.scaleStyle}>
        {isGlass ? (
          <Glass tone={tone} dimmed={disabled} style={styles.circle}>
            {fill}
            {content}
          </Glass>
        ) : (
          // I en glaskapsel (kapselns kant är ett eget lager och tar ingen plats).
          <View style={[styles.circle, styles.bare]}>
            {fill}
            {content}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: touchTarget,
    height: touchTarget,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bare: {
    overflow: 'hidden',
  },
  disabled: {
    opacity: motion.disabledOpacity,
  },
});
