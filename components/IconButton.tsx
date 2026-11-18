import type { ComponentType } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme, darkColors, motion, radius, touchTarget, iconSize } from '../theme';
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
  /** 'theme' följer temat, 'photo' är fast mörkt glas och vit ikon. */
  tone?: GlassTone;
  /** 'glass' (standard) har egen glasyta. 'bare' saknar yta, för knappar i en glaskapsel. */
  variant?: 'glass' | 'bare';
  size?: 'md';
  style?: StyleProp<ViewStyle>;
};

/**
 * Rund ikonknapp, 44 px (touchTarget). States: default, pressed (opacity 0,8),
 * selected (ikon i accent, fylld variant om given), disabled (tertiär färg).
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

  const disabledColor = tone === 'photo' ? darkColors.textTertiary : colors.textTertiary;
  const color = disabled ? disabledColor : selected ? colors.accent : g.content;

  const content = <ShownIcon color={color} size={iconSize.lg} />;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected, disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [pressed && styles.pressed, style]}
    >
      {variant === 'glass' ? (
        <Glass tone={tone} style={styles.circle}>
          {content}
        </Glass>
      ) : (
        // I en glaskapsel: kapselns kant räknas in, så kapseln blir lika hög som en glasknapp.
        <View style={[styles.circle, { height: touchTarget - g.borderWidth * 2 }]}>{content}</View>
      )}
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
  pressed: {
    opacity: motion.pressedOpacity,
  },
});
