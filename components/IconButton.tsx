import { Animated, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, motion, radius, touchTarget, iconSize } from '../theme';
import Glass, { useGlass, type GlassTone } from './Glass';
import Icon, { type IconName } from './Icon';
import { usePressAnimation } from '../hooks/usePressAnimation';
import { usePop } from '../hooks/usePop';
import { haptic } from '../utils/haptic';

type Props = {
  /** Ikonens namn i ikonsystemet (`Icon`, brief 57–58). Vald = `filled`. */
  name: IconName;
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
  name,
  accessibilityLabel,
  onPress,
  selected = false,
  disabled = false,
  tone = 'theme',
  variant = 'glass',
  style,
}: Props) {
  const { colors, shadows } = useTheme();
  const g = useGlass(tone);
  // Pop när ikonen blir fylld (inte vid avmarkering eller med reduce motion).
  const pop = usePop(selected);

  // Djupare yta vid tryck: en hårlinjefärg ovanpå glaset (samma som menyrader).
  const pressedTint = tone === 'photo' ? g.borderColor : colors.border;
  const isGlass = variant === 'glass';
  const press = usePressAnimation(motion.pressedScale);

  const content = (
    <Animated.View style={{ transform: [{ scale: pop }] }}>
      <Icon name={name} filled={selected} color={g.content} size={iconSize.lg} />
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
          // Skuggan på ett yttre lager, så att Glass overflow: hidden inte klipper den.
          <View style={[styles.circle, { boxShadow: shadows.glassButton }]}>
            <Glass tone={tone} dimmed={disabled} style={styles.circle}>
              {fill}
              {content}
            </Glass>
          </View>
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
