import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, darkColors, overlay, motion, radius, touchTarget, iconSize } from '../theme';
import Glass, { useGlass, type GlassTone } from './Glass';

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
 * pressed = djupare yta + skala 0,96, selected = inverterad yta/ikon,
 * disabled = 35 % opacitet.
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
  const ShownIcon = selected && selectedIcon ? selectedIcon : Icon;

  // Inverterat: på foto vit yta med mörk ikon, annars text-färg som yta.
  const invertedBg = tone === 'photo' ? overlay.onPhoto : colors.textPrimary;
  const invertedFg = tone === 'photo' ? darkColors.bg : colors.bg;
  // Djupare yta vid tryck: en hårlinjefärg ovanpå glaset (samma som menyrader).
  const pressedTint = tone === 'photo' ? g.borderColor : colors.border;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {({ pressed }) => {
        const content = (
          <ShownIcon color={selected ? invertedFg : g.content} size={iconSize.lg} />
        );
        const fill = selected ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: invertedBg }]} />
        ) : pressed ? (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: pressedTint }]} />
        ) : null;

        if (variant === 'glass') {
          return (
            <Glass tone={tone} style={styles.circle}>
              {fill}
              {content}
            </Glass>
          );
        }
        // I en glaskapsel: kapselns kant räknas in, så kapseln blir lika hög som en glasknapp.
        return (
          <View style={[styles.circle, styles.bare, { height: touchTarget - g.borderWidth * 2 }]}>
            {fill}
            {content}
          </View>
        );
      }}
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
  pressed: {
    transform: [{ scale: motion.pressedScale }],
  },
  disabled: {
    opacity: motion.disabledOpacity,
  },
});
